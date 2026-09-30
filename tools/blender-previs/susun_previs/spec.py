"""Previs 場景規格（spec）：JSON schema、正規化、以及不需 API 的關鍵字 fallback。

座標慣例（Blender 預設）：Z 朝上，單位公尺。「正面」朝 -Y。
facing_deg = 0 代表面向 -Y（也就是面對預設的正面機位）。
"""

import re

ASPECTS = ["9:16", "16:9", "1:1", "4:5"]
LOCATIONS = ["studio", "room", "bathroom", "kitchen", "cafe", "street", "outdoor"]
PROP_KINDS = [
    "bottle", "box", "can", "phone", "jar", "tube", "cup", "bag",
    "table", "chair", "sofa", "counter", "plant", "block",
]
SMALL_PROPS = {"bottle", "box", "can", "phone", "jar", "tube", "cup", "bag", "block"}
POSES = [
    "stand", "walk", "sit", "hold", "hold_low", "show", "apply", "drink",
    "point", "wave", "both_hands",
]
SHOT_SIZES = ["ECU", "CU", "MCU", "MS", "MLS", "WS"]
MOVES = [
    "static", "push_in", "pull_out", "orbit_left", "orbit_right", "orbit_360",
    "truck_left", "truck_right", "crane_up", "crane_down", "follow",
]
HEIGHTS = ["eye", "low", "high", "top"]

# 中文顯示用（Seedance prompt 會用到）
SHOT_SIZE_ZH = {
    "ECU": "大特寫", "CU": "特寫", "MCU": "近景", "MS": "中景", "MLS": "中遠景", "WS": "全景",
}
MOVE_ZH = {
    "static": "固定鏡頭", "push_in": "緩慢推近", "pull_out": "緩慢拉遠",
    "orbit_left": "向左環繞", "orbit_right": "向右環繞", "orbit_360": "360° 環繞",
    "truck_left": "向左橫移", "truck_right": "向右橫移",
    "crane_up": "升鏡", "crane_down": "降鏡", "follow": "跟拍",
}
HEIGHT_ZH = {"eye": "平視", "low": "低角度仰拍", "high": "高角度俯拍", "top": "正上方俯拍"}
POSE_ZH = {
    "stand": "自然站立", "walk": "走位", "sit": "坐下", "hold": "手持產品舉到胸前",
    "hold_low": "手持產品在腰間", "show": "把產品舉到臉旁展示給鏡頭", "apply": "把產品塗抹在臉上",
    "drink": "喝一口", "point": "伸手指向", "wave": "揮手打招呼", "both_hands": "雙手捧著產品",
}


def _vec(n):
    return {"type": "array", "items": {"type": "number"}, "description": f"{n} numbers"}


# 給 Claude structured outputs 用的 schema。只用 structured outputs 支援的關鍵字，
# 數值範圍交給 normalize() 夾限。
SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["title", "aspect", "fps", "location", "style_prompt", "characters", "props", "shots"],
    "properties": {
        "title": {"type": "string"},
        "aspect": {"type": "string", "enum": ASPECTS},
        "fps": {"type": "integer"},
        "location": {"type": "string", "enum": LOCATIONS},
        "style_prompt": {
            "type": "string",
            "description": "給影片模型的畫面風格描述（光線、色調、質感、年代感），繁體中文",
        },
        "characters": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["id", "label", "position", "facing_deg"],
                "properties": {
                    "id": {"type": "string"},
                    "label": {"type": "string", "description": "人物描述，例如「二十多歲女生，短髮」"},
                    "position": _vec(2),
                    "facing_deg": {"type": "number"},
                },
            },
        },
        "props": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["id", "kind", "label", "position", "rotation_deg", "held_by", "hero"],
                "properties": {
                    "id": {"type": "string"},
                    "kind": {"type": "string", "enum": PROP_KINDS},
                    "label": {"type": "string"},
                    "position": _vec(3),
                    "rotation_deg": {"type": "number"},
                    "held_by": {"type": "string", "description": "拿著它的角色 id；沒人拿就給空字串"},
                    "hero": {"type": "boolean", "description": "是否為主打產品"},
                },
            },
        },
        "shots": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["id", "duration_s", "description", "camera", "actions"],
                "properties": {
                    "id": {"type": "string"},
                    "duration_s": {"type": "number"},
                    "description": {"type": "string", "description": "這顆鏡頭畫面上發生什麼，繁體中文，一兩句"},
                    "camera": {
                        "type": "object",
                        "additionalProperties": False,
                        "required": ["subject", "shot_size", "move", "lens_mm", "height", "angle_deg", "handheld"],
                        "properties": {
                            "subject": {"type": "string", "description": "角色或道具的 id"},
                            "shot_size": {"type": "string", "enum": SHOT_SIZES},
                            "move": {"type": "string", "enum": MOVES},
                            "lens_mm": {"type": "number"},
                            "height": {"type": "string", "enum": HEIGHTS},
                            "angle_deg": {"type": "number", "description": "相對主體正面的水平角度；0 正面，正值往主體左手邊繞"},
                            "handheld": {"type": "boolean"},
                        },
                    },
                    "actions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "additionalProperties": False,
                            "required": ["actor", "pose", "at", "walk_to"],
                            "properties": {
                                "actor": {"type": "string"},
                                "pose": {"type": "string", "enum": POSES},
                                "at": {"type": "number", "description": "在這顆鏡頭內的時間比例 0–1"},
                                "walk_to": {
                                    "type": "array", "items": {"type": "number"},
                                    "description": "pose 為 walk 時的目的地 [x, y]；其他 pose 給空陣列",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
}


def _clamp(v, lo, hi, default):
    try:
        v = float(v)
    except (TypeError, ValueError):
        return default
    return max(lo, min(hi, v))


def _pick(v, options, default):
    return v if v in options else default


def _nums(v, n, default):
    if not isinstance(v, (list, tuple)):
        return list(default)
    out = []
    for i in range(n):
        try:
            out.append(float(v[i]))
        except (IndexError, TypeError, ValueError):
            out.append(default[i])
    return out


def normalize(spec):
    """把任何來源（Claude、手改的 JSON、fallback）的 spec 整理成 builder 能直接吃的形狀。"""
    spec = dict(spec or {})
    out = {
        "title": str(spec.get("title") or "Previs"),
        "aspect": _pick(spec.get("aspect"), ASPECTS, "9:16"),
        "fps": int(_clamp(spec.get("fps"), 12, 60, 24)),
        "location": _pick(spec.get("location"), LOCATIONS, "studio"),
        "style_prompt": str(spec.get("style_prompt") or ""),
        "characters": [],
        "props": [],
        "shots": [],
    }

    ids = set()

    def uid(raw, prefix):
        base = re.sub(r"[^A-Za-z0-9_]", "_", str(raw or prefix)) or prefix
        name, i = base, 2
        while name in ids:
            name, i = f"{base}_{i}", i + 1
        ids.add(name)
        return name

    char_ids = {}
    for c in (spec.get("characters") or [])[:4]:
        cid = uid(c.get("id"), "char")
        char_ids[str(c.get("id"))] = cid
        out["characters"].append({
            "id": cid,
            "label": str(c.get("label") or cid),
            "position": _nums(c.get("position"), 2, (0.0, 0.0)),
            "facing_deg": _clamp(c.get("facing_deg"), -360, 360, 0.0),
        })

    prop_ids = {}
    hero_seen = False
    for p in (spec.get("props") or [])[:12]:
        pid = uid(p.get("id"), "prop")
        prop_ids[str(p.get("id"))] = pid
        kind = _pick(p.get("kind"), PROP_KINDS, "block")
        held = char_ids.get(str(p.get("held_by") or ""), "")
        if held and kind not in SMALL_PROPS:
            held = ""
        hero = bool(p.get("hero")) and not hero_seen
        hero_seen = hero_seen or hero
        out["props"].append({
            "id": pid,
            "kind": kind,
            "label": str(p.get("label") or kind),
            "position": _nums(p.get("position"), 3, (0.0, 0.0, 0.0)),
            "rotation_deg": _clamp(p.get("rotation_deg"), -360, 360, 0.0),
            "held_by": held,
            "hero": hero,
        })
    if not hero_seen:
        for p in out["props"]:
            if p["kind"] in SMALL_PROPS:
                p["hero"] = True
                break

    subjects = {**char_ids, **prop_ids}
    default_subject = (
        out["characters"][0]["id"] if out["characters"]
        else out["props"][0]["id"] if out["props"] else ""
    )
    for i, s in enumerate((spec.get("shots") or [])[:12]):
        cam = s.get("camera") or {}
        actions = []
        for a in s.get("actions") or []:
            actor = char_ids.get(str(a.get("actor")))
            if not actor:
                continue
            walk_to = a.get("walk_to") or []
            actions.append({
                "actor": actor,
                "pose": _pick(a.get("pose"), POSES, "stand"),
                "at": _clamp(a.get("at"), 0, 1, 0.0),
                "walk_to": _nums(walk_to, 2, (0.0, 0.0)) if len(walk_to) >= 2 else [],
            })
        actions.sort(key=lambda a: a["at"])
        out["shots"].append({
            "id": uid(s.get("id"), f"shot{i + 1}"),
            "duration_s": _clamp(s.get("duration_s"), 0.5, 15, 3.0),
            "description": str(s.get("description") or ""),
            "camera": {
                "subject": subjects.get(str(cam.get("subject")), default_subject),
                "shot_size": _pick(cam.get("shot_size"), SHOT_SIZES, "MS"),
                "move": _pick(cam.get("move"), MOVES, "static"),
                "lens_mm": _clamp(cam.get("lens_mm"), 12, 200, 35.0),
                "height": _pick(cam.get("height"), HEIGHTS, "eye"),
                "angle_deg": _clamp(cam.get("angle_deg"), -180, 180, 0.0),
                "handheld": bool(cam.get("handheld")),
            },
            "actions": actions,
        })
    return out


# ---------------------------------------------------------------------------
# 關鍵字 fallback：沒有 API key 也能一句話起一個合理的預演。
# 簡繁都認。
# ---------------------------------------------------------------------------

_PRODUCT_WORDS = [
    ("phone", ["手機", "手机", "phone", "iphone"]),
    ("tube", ["口紅", "口红", "唇膏", "牙膏", "護手霜", "护手霜", "lipstick", "tube"]),
    ("jar", ["面霜", "乳霜", "眼霜", "罐裝", "jar", "cream"]),
    ("can", ["易開罐", "易拉罐", "汽水", "啤酒", "can", "soda", "beer"]),
    ("cup", ["咖啡", "杯", "奶茶", "coffee", "cup", "latte"]),
    ("box", ["盒", "禮盒", "礼盒", "包裝", "包装", "box"]),
    ("bag", ["包包", "手提包", "bag", "handbag"]),
    ("bottle", ["瓶", "精華", "精华", "香水", "化妝水", "化妆水", "乳液", "洗髮", "洗发",
                "bottle", "serum", "perfume", "toner"]),
]


def _has(text, words):
    return any(w in text for w in words)


def keyword_spec(prompt):
    """用關鍵字組出一個 spec。不追求聰明，追求「一定能跑、結構合理、方便手調」。"""
    t = (prompt or "").lower()

    aspect = "9:16"
    if _has(t, ["16:9", "橫屏", "横屏", "橫幅", "横幅", "landscape", "youtube", "廣告片", "tvc"]):
        aspect = "16:9"
    elif _has(t, ["1:1", "方形", "square"]):
        aspect = "1:1"
    elif _has(t, ["4:5"]):
        aspect = "4:5"

    location = "studio"
    for loc, words in [
        ("bathroom", ["浴室", "洗手台", "bathroom"]),
        ("kitchen", ["廚房", "厨房", "kitchen"]),
        ("cafe", ["咖啡廳", "咖啡厅", "咖啡店", "cafe", "café"]),
        ("room", ["臥室", "卧室", "客廳", "客厅", "房間", "房间", "bedroom", "living room", "room"]),
        ("street", ["街", "路邊", "路边", "street"]),
        ("outdoor", ["戶外", "户外", "公園", "公园", "outdoor", "park"]),
    ]:
        if _has(t, words):
            location = loc
            break

    kind = "bottle"
    for k, words in _PRODUCT_WORDS:
        if _has(t, words):
            kind = k
            break

    product_only = _has(t, ["純產品", "纯产品", "產品特寫", "产品特写", "無人", "无人", "静物", "靜物",
                            "product only", "packshot", "產品廣告", "产品广告"])
    n_people = 0 if product_only else 1
    if _has(t, ["兩個人", "两个人", "兩人", "两人", "情侶", "情侣", "閨蜜", "闺蜜", "朋友", "couple", "two people"]):
        n_people = 2

    use_pose = "apply" if kind in {"jar", "tube", "bottle"} and _has(
        t, ["擦", "塗", "涂", "抹", "護膚", "护肤", "保養", "保养", "skincare", "apply"]) else (
        "drink" if kind in {"cup", "can", "bottle"} and _has(t, ["喝", "drink", "飲料", "饮料"]) else "show")

    has_table = location in {"cafe", "kitchen", "bathroom"} or product_only
    counter_kind = "counter" if location in {"kitchen", "bathroom"} else "table"
    props = []
    if has_table:
        props.append({"id": "table", "kind": counter_kind, "label": "檯面", "position": [0, 0.55, 0],
                      "rotation_deg": 0, "held_by": "", "hero": False})

    characters = []
    if n_people >= 1:
        characters.append({"id": "girl", "label": "二十多歲女生，自然妝感", "position": [0, 0, 0], "facing_deg": 0})
    if n_people >= 2:
        characters.append({"id": "friend", "label": "她的朋友", "position": [0.7, 0.2, 0], "facing_deg": -30})

    table_top = 0.9 if counter_kind == "counter" else 0.75
    props.append({
        "id": "product", "kind": kind, "label": "主打產品",
        "position": [0, 0.45, table_top] if has_table else [0.25, -0.3, 0],
        "rotation_deg": 0, "held_by": "girl" if characters else "", "hero": True,
    })

    if characters:
        shots = [
            {"id": "hook", "duration_s": 2.5, "description": "開場 hook：她拿著產品直接對鏡頭說話",
             "camera": {"subject": "girl", "shot_size": "MCU", "move": "push_in", "lens_mm": 28,
                        "height": "eye", "angle_deg": 0, "handheld": True},
             "actions": [{"actor": "girl", "pose": "hold", "at": 0, "walk_to": []},
                         {"actor": "girl", "pose": "show", "at": 0.5, "walk_to": []}]},
            {"id": "product", "duration_s": 2.5, "description": "產品特寫，看清楚包裝與質地",
             "camera": {"subject": "product", "shot_size": "CU", "move": "orbit_left", "lens_mm": 50,
                        "height": "eye", "angle_deg": 15, "handheld": False},
             "actions": [{"actor": "girl", "pose": "hold", "at": 0, "walk_to": []}]},
            {"id": "use", "duration_s": 3.0, "description": "使用過程，展示實際效果",
             "camera": {"subject": "girl", "shot_size": "CU", "move": "static", "lens_mm": 50,
                        "height": "eye", "angle_deg": 25, "handheld": True},
             "actions": [{"actor": "girl", "pose": "hold", "at": 0, "walk_to": []},
                         {"actor": "girl", "pose": use_pose, "at": 0.3, "walk_to": []}]},
            {"id": "outro", "duration_s": 2.5, "description": "收尾：拉遠，她滿意地再展示一次產品",
             "camera": {"subject": "girl", "shot_size": "MS", "move": "pull_out", "lens_mm": 35,
                        "height": "eye", "angle_deg": -10, "handheld": False},
             "actions": [{"actor": "girl", "pose": "show", "at": 0.2, "walk_to": []}]},
        ]
    else:
        shots = [
            {"id": "reveal", "duration_s": 3.0, "description": "產品在檯面上，鏡頭從低處升起揭示",
             "camera": {"subject": "product", "shot_size": "MS", "move": "crane_up", "lens_mm": 50,
                        "height": "low", "angle_deg": 0, "handheld": False}, "actions": []},
            {"id": "hero", "duration_s": 4.0, "description": "產品環繞，看清楚每一面",
             "camera": {"subject": "product", "shot_size": "CU", "move": "orbit_left", "lens_mm": 85,
                        "height": "eye", "angle_deg": 30, "handheld": False}, "actions": []},
            {"id": "detail", "duration_s": 2.5, "description": "標誌與質地的大特寫",
             "camera": {"subject": "product", "shot_size": "ECU", "move": "push_in", "lens_mm": 100,
                        "height": "eye", "angle_deg": -20, "handheld": False}, "actions": []},
            {"id": "top", "duration_s": 2.5, "description": "正上方俯拍收尾，留出品牌字卡空間",
             "camera": {"subject": "product", "shot_size": "MS", "move": "static", "lens_mm": 50,
                        "height": "top", "angle_deg": 0, "handheld": False}, "actions": []},
        ]

    return normalize({
        "title": (prompt or "Previs")[:40],
        "aspect": aspect,
        "fps": 24,
        "location": location,
        "style_prompt": "真實質感，柔和自然光，淺景深，生活感，手機直拍的 UGC 氛圍" if characters
        else "乾淨的商業產品攝影，柔光箱打光，高光細膩，背景簡潔",
        "characters": characters,
        "props": props,
        "shots": shots,
    })
