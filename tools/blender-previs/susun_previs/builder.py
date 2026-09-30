"""spec → Blender 場景。

全部東西放在 "Previs" collection 底下，重建時整個清掉重來。
人偶是「骨架 + 用骨頭當 parent 的低模積木」，在 Pose Mode 直接轉骨頭就能調動作。
每顆鏡頭一台攝影機，用時間軸 marker 綁定攝影機切換。
"""

import math
import random

import bmesh
import bpy
from mathutils import Matrix, Vector

from . import spec as specmod

COLLECTION = "Previs"
SPEC_TEXT = "previs_spec.json"

RESOLUTION = {"9:16": (1080, 1920), "16:9": (1920, 1080), "1:1": (1080, 1080), "4:5": (1080, 1350)}

COLOR_SET = (0.62, 0.62, 0.60, 1)
COLOR_FURNITURE = (0.45, 0.47, 0.50, 1)
COLOR_HERO = (0.95, 0.45, 0.10, 1)
COLOR_PROP = (0.35, 0.55, 0.85, 1)
CHAR_COLORS = [(0.40, 0.51, 0.44, 1), (0.60, 0.42, 0.55, 1), (0.50, 0.46, 0.34, 1), (0.36, 0.44, 0.60, 1)]

# ---------------------------------------------------------------------------
# 低階幾何
# ---------------------------------------------------------------------------


def _new_object(name, bm, coll, color):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = False
    ob = bpy.data.objects.new(name, me)
    ob.color = color
    coll.objects.link(ob)
    return ob


def _box(bm, size, center):
    geom = bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=geom["verts"])
    bmesh.ops.translate(bm, vec=Vector(center), verts=geom["verts"])


def _cyl(bm, r1, r2, depth, center, segments=10, direction=None):
    geom = bmesh.ops.create_cone(bm, cap_ends=True, segments=segments, radius1=r1, radius2=r2, depth=depth)
    verts = geom["verts"]
    if direction is not None:
        rot = Vector((0, 0, 1)).rotation_difference(Vector(direction).normalized()).to_matrix()
        bmesh.ops.rotate(bm, cent=Vector((0, 0, 0)), matrix=rot, verts=verts)
    bmesh.ops.translate(bm, vec=Vector(center), verts=verts)


def _sphere(bm, r, center, seg=8, rings=6):
    geom = bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=r)
    bmesh.ops.translate(bm, vec=Vector(center), verts=geom["verts"])


def _limb(bm, a, b, r1, r2=None):
    a, b = Vector(a), Vector(b)
    _cyl(bm, r1, r2 if r2 is not None else r1, (b - a).length, (a + b) / 2, segments=8, direction=b - a)


# ---------------------------------------------------------------------------
# 人偶
# ---------------------------------------------------------------------------

# (head, tail, parent)；面向 -Y，角色左手在 +X
BONES = {
    "root": ((0, 0, 0), (0, 0, 0.2), None),
    "hips": ((0, 0, 0.93), (0, 0, 1.05), "root"),
    "spine": ((0, 0, 1.05), (0, 0, 1.25), "hips"),
    "chest": ((0, 0, 1.25), (0, 0, 1.45), "spine"),
    "neck": ((0, 0, 1.45), (0, 0, 1.55), "chest"),
    "head": ((0, 0, 1.55), (0, 0, 1.78), "neck"),
    "upper_arm.L": ((0.19, 0, 1.42), (0.21, 0, 1.14), "chest"),
    "forearm.L": ((0.21, 0, 1.14), (0.22, 0, 0.88), "upper_arm.L"),
    "hand.L": ((0.22, 0, 0.88), (0.22, 0, 0.78), "forearm.L"),
    "thigh.L": ((0.1, 0, 0.93), (0.1, 0, 0.5), "hips"),
    "shin.L": ((0.1, 0, 0.5), (0.1, 0, 0.08), "thigh.L"),
    "foot.L": ((0.1, 0, 0.08), (0.1, -0.14, 0.03), "shin.L"),
}
for _n in [n for n in BONES if n.endswith(".L")]:
    (_h, _t, _p) = BONES[_n]
    BONES[_n[:-2] + ".R"] = ((-_h[0], _h[1], _h[2]), (-_t[0], _t[1], _t[2]), _p.replace(".L", ".R"))

# 骨頭朝向設計成：每根骨頭繞自身 X 軸正轉 = 往身體前方彎。
# 手臂繞 Z 軸：左手 +Z / 右手 -Z 是往外張開。
_STAND = {
    "upper_arm.L": (0, 0, 8), "upper_arm.R": (0, 0, -8),
    "forearm.L": (8, 0, 0), "forearm.R": (8, 0, 0),
}
POSE_TABLE = {
    "stand": {},
    # 手臂角度是對目標手掌位置做格點搜尋得到的，例如 hold 的手在胸前約 33cm
    "hold": {"upper_arm.R": (10, 0, 35), "forearm.R": (105, 0, 0)},
    "hold_low": {"upper_arm.R": (0, 0, 10), "forearm.R": (75, 0, 0)},
    "show": {"upper_arm.R": (55, 0, 10), "forearm.R": (105, 0, 0), "hand.R": (-20, 0, 0)},
    "apply": {"upper_arm.R": (75, 0, -20), "forearm.R": (135, 0, 0), "neck": (0, 0, -8)},
    "drink": {"upper_arm.R": (60, 0, -20), "forearm.R": (140, 0, 0), "neck": (-15, 0, 0)},
    "point": {"upper_arm.R": (80, 0, -15), "forearm.R": (10, 0, 0)},
    "wave": {"upper_arm.R": (10, 0, -100), "forearm.R": (0, 0, -70)},
    "both_hands": {"upper_arm.R": (5, 0, 30), "forearm.R": (100, 0, 0),
                   "upper_arm.L": (5, 0, -30), "forearm.L": (100, 0, 0)},
    "sit": {"thigh.L": (90, 0, 5), "thigh.R": (90, 0, -5), "shin.L": (-90, 0, 0), "shin.R": (-90, 0, 0),
            "_hips_drop": 0.45},
    "walk_a": {"thigh.L": (25, 0, 0), "shin.L": (-10, 0, 0), "thigh.R": (-20, 0, 0), "shin.R": (-30, 0, 0),
               "upper_arm.L": (-20, 0, 8), "upper_arm.R": (20, 0, -8)},
    "walk_b": {"thigh.R": (25, 0, 0), "shin.R": (-10, 0, 0), "thigh.L": (-20, 0, 0), "shin.L": (-30, 0, 0),
               "upper_arm.R": (-20, 0, -8), "upper_arm.L": (20, 0, 8)},
}
# 拿著東西時走路，右手維持拿的姿勢
HOLDING_ARM = {k: v for k, v in POSE_TABLE["hold_low"].items()}


def _full_pose(name, holding=False, seated=False):
    pose = dict(_STAND)
    if seated and name not in ("stand", "walk_a", "walk_b"):
        pose.update(POSE_TABLE["sit"])  # 坐著做手部動作：下半身維持坐姿
    if holding and name in ("stand", "walk_a", "walk_b", "sit"):
        pose.update(HOLDING_ARM)
    for k, v in POSE_TABLE.get(name, {}).items():
        if holding and name in ("walk_a", "walk_b") and k in HOLDING_ARM:
            continue
        pose[k] = v
    return pose


def _attach(ob, arm, bone_name):
    """用骨頭當 parent，但保持物件目前（rest pose）的世界位置。arm 必須還在原點。"""
    bone = arm.data.bones[bone_name]
    parent_mat = bone.matrix_local @ Matrix.Translation((0, bone.length, 0))
    ob.parent = arm
    ob.parent_type = "BONE"
    ob.parent_bone = bone_name
    ob.matrix_parent_inverse = parent_mat.inverted()


def build_mannequin(name, coll, color):
    arm_data = bpy.data.armatures.new(name)
    arm = bpy.data.objects.new(name, arm_data)
    arm.show_in_front = False
    coll.objects.link(arm)

    view_layer = bpy.context.view_layer
    prev_active = view_layer.objects.active
    view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="EDIT")
    for bname, (head, tail, parent) in BONES.items():
        eb = arm_data.edit_bones.new(bname)
        eb.head, eb.tail = head, tail
        if bname.startswith("foot"):
            eb.align_roll(Vector((0, 0, 1)))
        else:
            eb.align_roll(Vector((0, -1, 0)))
    for bname, (_h, _t, parent) in BONES.items():
        if parent:
            arm_data.edit_bones[bname].parent = arm_data.edit_bones[parent]
    bpy.ops.object.mode_set(mode="OBJECT")
    view_layer.objects.active = prev_active

    for pb in arm.pose.bones:
        pb.rotation_mode = "XYZ"

    skin = color
    parts = []

    def part(pname, bone_name, build):
        bm = bmesh.new()
        build(bm)
        ob = _new_object(f"{name}.{pname}", bm, coll, skin)
        _attach(ob, arm, bone_name)
        parts.append(ob)

    part("pelvis", "hips", lambda bm: _box(bm, (0.32, 0.19, 0.16), (0, 0, 0.97)))
    part("belly", "spine", lambda bm: _box(bm, (0.29, 0.17, 0.2), (0, 0, 1.15)))
    part("chest", "chest", lambda bm: _box(bm, (0.36, 0.21, 0.24), (0, 0, 1.34)))
    part("neck", "neck", lambda bm: _limb(bm, (0, 0, 1.45), (0, 0, 1.56), 0.045))

    def head(bm):
        _sphere(bm, 0.105, (0, 0, 1.66))
        _box(bm, (0.03, 0.04, 0.04), (0, -0.105, 1.65))  # 鼻子：一眼看出臉朝哪
    part("head", "head", head)

    for s, sx in (("L", 1), ("R", -1)):
        part(f"upper_arm.{s}", f"upper_arm.{s}", lambda bm, sx=sx: _limb(bm, (0.19 * sx, 0, 1.42), (0.21 * sx, 0, 1.14), 0.045, 0.04))
        part(f"forearm.{s}", f"forearm.{s}", lambda bm, sx=sx: _limb(bm, (0.21 * sx, 0, 1.14), (0.22 * sx, 0, 0.88), 0.038, 0.032))
        part(f"hand.{s}", f"hand.{s}", lambda bm, sx=sx: _box(bm, (0.05, 0.08, 0.11), (0.22 * sx, 0, 0.83)))
        part(f"thigh.{s}", f"thigh.{s}", lambda bm, sx=sx: _limb(bm, (0.1 * sx, 0, 0.93), (0.1 * sx, 0, 0.5), 0.07, 0.055))
        part(f"shin.{s}", f"shin.{s}", lambda bm, sx=sx: _limb(bm, (0.1 * sx, 0, 0.5), (0.1 * sx, 0, 0.08), 0.05, 0.04))
        part(f"foot.{s}", f"foot.{s}", lambda bm, sx=sx: _box(bm, (0.09, 0.24, 0.07), (0.1 * sx, -0.06, 0.035)))
    return arm


def apply_pose(arm, pose_name, holding=False, seated=False):
    pose = _full_pose(pose_name, holding, seated)
    for pb in arm.pose.bones:
        rot = pose.get(pb.name, (0, 0, 0))
        pb.rotation_euler = [math.radians(v) for v in rot]
        pb.location = (0, 0, 0)
    arm.pose.bones["hips"].location = (0, -pose.get("_hips_drop", 0.0), 0)


def key_pose(arm, frame):
    for pb in arm.pose.bones:
        pb.keyframe_insert("rotation_euler", frame=frame, group=pb.name)
    arm.pose.bones["hips"].keyframe_insert("location", frame=frame, group="hips")


# ---------------------------------------------------------------------------
# 道具與場景
# ---------------------------------------------------------------------------

# kind -> (建模函式, 高度)；原點在底部中心
def _prop_geometry(kind, bm):
    if kind == "bottle":
        _cyl(bm, 0.035, 0.035, 0.14, (0, 0, 0.07))
        _cyl(bm, 0.035, 0.013, 0.02, (0, 0, 0.15))
        _cyl(bm, 0.015, 0.015, 0.035, (0, 0, 0.1775))
    elif kind == "box":
        _box(bm, (0.1, 0.05, 0.15), (0, 0, 0.075))
    elif kind == "can":
        _cyl(bm, 0.033, 0.033, 0.12, (0, 0, 0.06), segments=12)
    elif kind == "phone":
        _box(bm, (0.075, 0.009, 0.155), (0, 0, 0.0775))
    elif kind == "jar":
        _cyl(bm, 0.045, 0.045, 0.05, (0, 0, 0.025), segments=12)
        _cyl(bm, 0.047, 0.047, 0.02, (0, 0, 0.06), segments=12)
    elif kind == "tube":
        _cyl(bm, 0.018, 0.018, 0.1, (0, 0, 0.05))
        _cyl(bm, 0.016, 0.016, 0.03, (0, 0, 0.115))
    elif kind == "cup":
        _cyl(bm, 0.035, 0.045, 0.11, (0, 0, 0.055), segments=12)
    elif kind == "bag":
        _box(bm, (0.3, 0.12, 0.24), (0, 0, 0.12))
        _box(bm, (0.2, 0.02, 0.1), (0, 0, 0.29))
    elif kind == "table":
        _box(bm, (1.2, 0.7, 0.04), (0, 0, 0.73))
        for x in (-0.55, 0.55):
            for y in (-0.3, 0.3):
                _box(bm, (0.05, 0.05, 0.71), (x, y, 0.355))
    elif kind == "counter":
        _box(bm, (1.6, 0.6, 0.9), (0, 0, 0.45))
    elif kind == "chair":
        _box(bm, (0.45, 0.45, 0.05), (0, 0, 0.45))
        _box(bm, (0.45, 0.05, 0.45), (0, 0.2, 0.7))
        for x in (-0.2, 0.2):
            for y in (-0.2, 0.2):
                _box(bm, (0.04, 0.04, 0.43), (x, y, 0.215))
    elif kind == "sofa":
        _box(bm, (1.8, 0.8, 0.42), (0, 0, 0.21))
        _box(bm, (1.8, 0.2, 0.45), (0, 0.3, 0.645))
    elif kind == "plant":
        _cyl(bm, 0.14, 0.11, 0.3, (0, 0, 0.15))
        geom = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=0.35)
        bmesh.ops.translate(bm, vec=Vector((0, 0, 0.7)), verts=geom["verts"])
    else:  # block
        _box(bm, (0.1, 0.1, 0.1), (0, 0, 0.05))


PROP_HEIGHT = {
    "bottle": 0.195, "box": 0.15, "can": 0.12, "phone": 0.155, "jar": 0.07, "tube": 0.13,
    "cup": 0.11, "bag": 0.34, "table": 0.75, "counter": 0.9, "chair": 0.9, "sofa": 0.87,
    "plant": 1.05, "block": 0.1,
}


def build_set(location, coll):
    bm = bmesh.new()
    furniture = bmesh.new()
    if location == "studio":
        _box(bm, (14, 14, 0.02), (0, 2, -0.01))
        _box(bm, (14, 0.05, 6), (0, 5, 3))
    elif location in ("room", "bathroom", "kitchen", "cafe"):
        _box(bm, (7, 7, 0.02), (0, 0.5, -0.01))
        _box(bm, (7, 0.1, 3.4), (0, 2.6, 1.7))
        _box(bm, (0.1, 7, 3.4), (-3.2, 0.5, 1.7))
        if location == "room":
            _box(bm, (1.2, 0.02, 1.3), (-1.2, 2.54, 1.5))  # 窗
            _prop_into(furniture, "sofa", (1.4, 1.9, 0), 180)
            _prop_into(furniture, "plant", (-2.6, 2.0, 0), 0)
        elif location == "bathroom":
            _box(bm, (1.0, 0.02, 0.8), (0, 2.54, 1.55))  # 鏡子
        elif location == "kitchen":
            _box(bm, (3.0, 0.35, 0.7), (0, 2.37, 1.85))  # 吊櫃
            _prop_into(furniture, "counter", (0, 2.25, 0), 0)
        elif location == "cafe":
            for x, y in ((-1.8, 1.6), (1.8, 1.8)):
                _prop_into(furniture, "table", (x, y, 0), 0)
                _prop_into(furniture, "chair", (x + 0.8, y, 0), 90)
            _prop_into(furniture, "plant", (-2.8, 2.2, 0), 0)
    elif location == "street":
        _box(bm, (40, 40, 0.02), (0, 5, -0.01))
        _box(bm, (40, 3, 0.15), (0, 3.5, 0.075))  # 人行道
        rng = random.Random(7)
        x = -18.0
        while x < 18:
            w, h = rng.uniform(3, 6), rng.uniform(6, 16)
            _box(bm, (w - 0.3, 6, h), (x + w / 2, 8, h / 2))
            x += w
    else:  # outdoor
        _box(bm, (60, 60, 0.02), (0, 10, -0.01))
        rng = random.Random(11)
        for _ in range(14):
            x, y = rng.uniform(-14, 14), rng.uniform(4, 22)
            _cyl(bm, 0.12, 0.12, 1.6, (x, y, 0.8), segments=6)
            _cyl(bm, 1.2, 0.0, 3.0, (x, y, 2.9), segments=8)
    _new_object("Set", bm, coll, COLOR_SET)
    if furniture.verts:
        _new_object("Set.Furniture", furniture, coll, COLOR_FURNITURE)
    else:
        furniture.free()


def _prop_into(bm, kind, pos, rot_deg):
    tmp = bmesh.new()
    _prop_geometry(kind, tmp)
    m = Matrix.Translation(pos) @ Matrix.Rotation(math.radians(rot_deg), 4, "Z")
    tmp.transform(m)
    me = bpy.data.meshes.new("_tmp")
    tmp.to_mesh(me)
    tmp.free()
    bm.from_mesh(me)
    bpy.data.meshes.remove(me)


def build_prop(p, coll, chars):
    bm = bmesh.new()
    _prop_geometry(p["kind"], bm)
    color = COLOR_HERO if p["hero"] else (COLOR_PROP if p["kind"] in specmod.SMALL_PROPS else COLOR_FURNITURE)
    ob = _new_object(f"Prop.{p['id']}", bm, coll, color)
    ob.rotation_euler = (0, 0, math.radians(p["rotation_deg"]))
    holder = chars.get(p["held_by"])
    if holder:
        # 跟著右手走，但保持直立，方便看清楚產品正面
        con = ob.constraints.new("COPY_LOCATION")
        con.target = holder
        con.subtarget = "hand.R"
        con.head_tail = 0.5
        con.use_offset = True
        ob.location = (0, 0, -PROP_HEIGHT[p["kind"]] * 0.35)
        ob.rotation_euler = (0, 0, holder.rotation_euler.z + math.radians(p["rotation_deg"]))
    else:
        ob.location = p["position"]
    return ob


# ---------------------------------------------------------------------------
# 攝影機
# ---------------------------------------------------------------------------

# 畫面垂直方向要框住的高度 = 係數 × 主體高度
FRAME_PERSON = {"ECU": 0.14, "CU": 0.3, "MCU": 0.5, "MS": 0.75, "MLS": 1.05, "WS": 1.7}
FRAME_PROP = {"ECU": 0.6, "CU": 1.4, "MCU": 2.2, "MS": 3.2, "MLS": 4.5, "WS": 8.0}
# 對人物的瞄準點：(骨頭, head_tail, rest 高度)
AIM_PERSON = {
    "ECU": ("head", 0.45, 1.65), "CU": ("head", 0.3, 1.62), "MCU": ("neck", 0.0, 1.45),
    "MS": ("chest", 0.3, 1.31), "MLS": ("spine", 0.3, 1.11), "WS": ("hips", 0.5, 0.99),
}
ELEVATION = {"eye": 0.0, "low": -18.0, "high": 30.0, "top": 88.0}


def _ease(t):
    return t * t * (3 - 2 * t)


def build_camera(shot, start, end, aspect, subject_info, coll, rng):
    cam_spec = shot["camera"]
    res_x, res_y = RESOLUTION[aspect]
    sensor_v = 36.0 if res_y >= res_x else 36.0 * res_y / res_x

    kind, target, base, facing, height = subject_info
    size = cam_spec["shot_size"]
    if kind == "person":
        bone, head_tail, aim_z = AIM_PERSON[size]
        frame_h = FRAME_PERSON[size] * height
    else:
        bone, head_tail = "", 0.0
        aim_z = base[2] + height / 2
        frame_h = FRAME_PROP[size] * height
    dist = max(0.12, frame_h * cam_spec["lens_mm"] / sensor_v)

    name = f"Shot.{shot['id']}"
    aim = bpy.data.objects.new(f"{name}.aim", None)
    aim.empty_display_size = 0.05
    coll.objects.link(aim)
    con = aim.constraints.new("COPY_LOCATION")
    con.target = target
    if bone:
        con.subtarget = bone
        con.head_tail = head_tail
    else:
        con.use_offset = True
        aim.location = (0, 0, height / 2)

    rig = bpy.data.objects.new(f"{name}.rig", None)
    rig.empty_display_type = "CIRCLE"
    rig.empty_display_size = 0.3
    rig.location = (base[0], base[1], aim_z)
    coll.objects.link(rig)
    if cam_spec["move"] == "follow" and kind == "person":
        fc = rig.constraints.new("COPY_LOCATION")
        fc.target = target
        fc.use_z = False

    cam_data = bpy.data.cameras.new(name)
    cam_data.lens = cam_spec["lens_mm"]
    cam_data.sensor_width = 36.0
    cam_data.sensor_fit = "AUTO"
    cam_data.clip_start = 0.02
    cam_data.passepartout_alpha = 0.85
    cam = bpy.data.objects.new(name, cam_data)
    cam.parent = rig
    coll.objects.link(cam)
    track = cam.constraints.new("TRACK_TO")
    track.target = aim
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"

    move = cam_spec["move"]
    elev0 = ELEVATION[cam_spec["height"]]
    yaw0 = facing + cam_spec["angle_deg"]
    # (距離倍率, 仰角, 水平角偏移, 橫移) 在 t=0 與 t=1
    a = {"d": 1.0, "e": elev0, "y": 0.0, "x": 0.0}
    b = dict(a)
    if move == "push_in":
        a["d"], b["d"] = 1.3, 0.8
    elif move == "pull_out":
        a["d"], b["d"] = 0.8, 1.3
    elif move == "orbit_left":
        b["y"] = -40.0
    elif move == "orbit_right":
        b["y"] = 40.0
    elif move == "orbit_360":
        b["y"] = 360.0
    elif move == "truck_left":
        a["x"], b["x"] = 0.3, -0.3
    elif move == "truck_right":
        a["x"], b["x"] = -0.3, 0.3
    elif move == "crane_up":
        a["e"], b["e"] = elev0 - 15, min(elev0 + 20, 88)
    elif move == "crane_down":
        a["e"], b["e"] = min(elev0 + 20, 88), elev0 - 15

    step = 3 if cam_spec["handheld"] else 4
    frames = list(range(start, end, step)) + [end]
    for f in frames:
        t = (f - start) / max(1, end - start)
        k = t if move == "orbit_360" else _ease(t)
        d = dist * (a["d"] + (b["d"] - a["d"]) * k)
        e = math.radians(a["e"] + (b["e"] - a["e"]) * k)
        if kind == "person":
            d = max(d, 0.5)  # 人手會伸到身體前方，太近會撞進鏡頭
        else:
            # 不要鑽到產品所在的檯面底下
            e = max(e, math.asin(max(-1.0, min(1.0, (base[2] + 0.04 - aim_z) / d))))
        rig.rotation_euler = (0, 0, math.radians(yaw0 + a["y"] + (b["y"] - a["y"]) * k))
        loc = Vector((dist * (a["x"] + (b["x"] - a["x"]) * k), -d * math.cos(e), d * math.sin(e)))
        if cam_spec["handheld"]:
            amp = 0.006 + 0.01 * d
            loc += Vector((rng.uniform(-amp, amp), rng.uniform(-amp, amp) * 0.5, rng.uniform(-amp, amp)))
        cam.location = loc
        cam.keyframe_insert("location", frame=f)
        rig.keyframe_insert("rotation_euler", frame=f)
    return cam


# ---------------------------------------------------------------------------
# 主流程
# ---------------------------------------------------------------------------


def clear(scene):
    coll = bpy.data.collections.get(COLLECTION)
    if coll:
        for ob in list(coll.all_objects):
            data = ob.data
            bpy.data.objects.remove(ob, do_unlink=True)
            if data is not None and data.users == 0:
                if isinstance(data, bpy.types.Mesh):
                    bpy.data.meshes.remove(data)
                elif isinstance(data, bpy.types.Camera):
                    bpy.data.cameras.remove(data)
                elif isinstance(data, bpy.types.Armature):
                    bpy.data.armatures.remove(data)
        bpy.data.collections.remove(coll)
    for m in [m for m in scene.timeline_markers if m.name.startswith("S")]:
        scene.timeline_markers.remove(m)
    for act in [a for a in bpy.data.actions if a.users == 0]:
        bpy.data.actions.remove(act)


def store_spec(spec):
    import json
    txt = bpy.data.texts.get(SPEC_TEXT) or bpy.data.texts.new(SPEC_TEXT)
    txt.clear()
    txt.write(json.dumps(spec, ensure_ascii=False, indent=2))


def build(spec, scene=None):
    """依 spec 重建整個預演場景。回傳 (總影格數, 每顆鏡頭的 (id, start, end))。"""
    scene = scene or bpy.context.scene
    spec = specmod.normalize(spec)
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    clear(scene)
    store_spec(spec)

    coll = bpy.data.collections.new(COLLECTION)
    scene.collection.children.link(coll)
    rng = random.Random(1)
    fps = spec["fps"]

    res_x, res_y = RESOLUTION[spec["aspect"]]
    scene.render.resolution_x, scene.render.resolution_y = res_x, res_y
    scene.render.resolution_percentage = 50
    scene.render.fps = fps
    scene.render.fps_base = 1.0

    build_set(spec["location"], coll)

    chars = {}
    for i, c in enumerate(spec["characters"]):
        arm = build_mannequin(f"Char.{c['id']}", coll, CHAR_COLORS[i % len(CHAR_COLORS)])
        arm.location = (c["position"][0], c["position"][1], 0)
        arm.rotation_euler = (0, 0, math.radians(c["facing_deg"]))
        chars[c["id"]] = arm
    props = {p["id"]: build_prop(p, coll, chars) for p in spec["props"]}
    holding = {p["held_by"] for p in spec["props"] if p["held_by"]}

    # 每個角色：目前 pose、目前位置、目前朝向
    state = {cid: {"pose": "stand", "seated": False, "pos": Vector((*c["position"], 0)), "facing": c["facing_deg"]}
             for cid, c in zip(chars, spec["characters"])}

    def set_pose(cid, pose_name, frame, blend):
        arm = chars[cid]
        hold = cid in holding
        prev, seated = state[cid]["pose"], state[cid]["seated"]
        if blend and frame > 1:
            apply_pose(arm, prev, hold, seated)
            key_pose(arm, frame)
            frame += blend
        if pose_name == "sit":
            seated = True
        elif pose_name in ("stand", "walk_a", "walk_b"):
            seated = False
        apply_pose(arm, pose_name, hold, seated)
        key_pose(arm, frame)
        state[cid]["pose"], state[cid]["seated"] = pose_name, seated

    def key_root(cid, frame):
        arm = chars[cid]
        arm.location = state[cid]["pos"]
        arm.rotation_euler = (0, 0, math.radians(state[cid]["facing"]))
        arm.keyframe_insert("location", frame=frame)
        arm.keyframe_insert("rotation_euler", frame=frame)

    for cid in chars:
        apply_pose(chars[cid], "stand", cid in holding)
        key_pose(chars[cid], 1)
        key_root(cid, 1)

    shots_out = []
    frame = 1
    blend = max(4, round(fps / 3))
    for idx, shot in enumerate(spec["shots"]):
        length = max(1, round(shot["duration_s"] * fps))
        start, end = frame, frame + length - 1

        acts = shot["actions"]
        for j, act in enumerate(acts):
            cid = act["actor"]
            f = start + round(act["at"] * (length - 1))
            next_f = next((start + round(n["at"] * (length - 1)) for n in acts[j + 1:] if n["actor"] == cid), end)
            if act["pose"] == "walk" and act["walk_to"]:
                dest = Vector((act["walk_to"][0], act["walk_to"][1], 0))
                delta = dest - state[cid]["pos"]
                if delta.length > 0.05:
                    state[cid]["facing"] = math.degrees(math.atan2(delta.x, -delta.y))
                key_root(cid, f)
                cycle = max(6, round(fps / 2))
                g, flip = f, False
                while g < next_f:
                    set_pose(cid, "walk_b" if flip else "walk_a", g, 0)
                    g, flip = g + cycle, not flip
                state[cid]["pos"] = dest
                key_root(cid, max(f + 1, next_f))
            else:
                set_pose(cid, act["pose"], f, 0 if f == start and idx == 0 else blend)

        subj = shot["camera"]["subject"]
        if subj in chars:
            cdef = next(c for c in spec["characters"] if c["id"] == subj)
            info = ("person", chars[subj], tuple(state[subj]["pos"]), state[subj]["facing"], 1.75)
            if shot["camera"]["move"] == "follow":
                info = ("person", chars[subj], tuple(Vector((*cdef["position"], 0))), state[subj]["facing"], 1.75)
        elif subj in props:
            p = next(p for p in spec["props"] if p["id"] == subj)
            h = PROP_HEIGHT[p["kind"]]
            if p["held_by"]:
                holder = state[p["held_by"]]
                fwd = Matrix.Rotation(math.radians(holder["facing"]), 3, "Z") @ Vector((0, -0.4, 0))
                base = holder["pos"] + fwd + Vector((0, 0, 1.3))
                info = ("prop", props[subj], tuple(base), holder["facing"] + p["rotation_deg"], h)
            else:
                info = ("prop", props[subj], tuple(p["position"]), p["rotation_deg"], h)
        else:
            empty = bpy.data.objects.new(f"Shot.{shot['id']}.origin", None)
            coll.objects.link(empty)
            info = ("prop", empty, (0, 0, 0), 0.0, 1.7)

        cam = build_camera(shot, start, end, spec["aspect"], info, coll, rng)
        marker = scene.timeline_markers.new(f"S{idx + 1:02d} {shot['id']}", frame=start)
        marker.camera = cam
        if idx == 0:
            scene.camera = cam
        shots_out.append((shot["id"], start, end))
        frame = end + 1

    scene.frame_start, scene.frame_end = 1, max(1, frame - 1)
    scene.frame_set(1)
    _setup_display(scene)
    return frame - 1, shots_out


def _setup_display(scene):
    shading = scene.display.shading
    shading.light = "STUDIO"
    shading.color_type = "OBJECT"
    shading.show_cavity = True
    shading.show_shadows = True
    scene.render.engine = "BLENDER_WORKBENCH"
    if scene.world is None:
        scene.world = bpy.data.worlds.new("Previs")
    scene.world.color = (0.5, 0.5, 0.5)
    screen = getattr(bpy.context, "screen", None)
    for area in (screen.areas if screen else []):
        if area.type == "VIEW_3D":
            for space in area.spaces:
                if space.type == "VIEW_3D":
                    space.shading.type = "SOLID"
                    space.shading.color_type = "OBJECT"
