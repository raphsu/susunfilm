"""預演 → 交給 Seedance 的素材包：參考影片、每顆鏡頭首幀、prompt、spec。"""

import json
import os

import bpy

from . import spec as specmod

SEEDANCE_MAX_S = 15.0


def seedance_prompt(spec, shots_frames=None):
    """把 spec 寫成可以直接貼進 Seedance 的中文提示詞。

    @视频1 / @图片N 是 Seedance 多模態參考的寫法（照平台原文用簡體）：上傳順序即編號。
    參考影片放 previs.mp4，參考圖片依序放人物、產品的真實照片。
    """
    fps = spec["fps"]
    lines = []
    total = sum(s["duration_s"] for s in spec["shots"])

    lines.append("【參考說明】@视频1 是低模預演（previs），只參考它的鏡頭運動、構圖、景別、"
                 "人物走位與動作節奏；不要沿用灰模的材質、顏色與簡化的場景。")
    refs = []
    img_no = 1
    for c in spec["characters"]:
        refs.append(f"人物「{c['label']}」外觀參考 @图片{img_no}")
        img_no += 1
    hero = next((p for p in spec["props"] if p["hero"]), None)
    if hero:
        refs.append(f"產品「{hero['label']}」外觀參考 @图片{img_no}，包裝、標誌與比例要一致")
    if refs:
        lines.append("【主體】" + "；".join(refs) + "。")
    if spec["style_prompt"]:
        lines.append(f"【畫面風格】{spec['style_prompt']}")

    lines.append("【分鏡】")
    t = 0.0
    for i, s in enumerate(spec["shots"]):
        cam = s["camera"]
        tags = [
            specmod.SHOT_SIZE_ZH[cam["shot_size"]],
            specmod.HEIGHT_ZH[cam["height"]],
            f"{round(cam['lens_mm'])}mm",
            specmod.MOVE_ZH[cam["move"]] + ("（手持感）" if cam["handheld"] else ""),
        ]
        acts = "，".join(
            dict.fromkeys(specmod.POSE_ZH[a["pose"]] for a in s["actions"] if a["pose"] != "stand")
        )
        desc = s["description"] or acts
        if acts and s["description"]:
            desc = f"{s['description']}（動作：{acts}）"
        lines.append(f"鏡頭{i + 1} {t:.1f}–{t + s['duration_s']:.1f}s｜{' · '.join(tags)}：{desc}")
        t += s["duration_s"]

    lines.append(f"【規格】畫面比例 {spec['aspect']}，總長約 {total:.0f} 秒，鏡頭之間硬切。")
    if total > SEEDANCE_MAX_S:
        lines.append(f"（注意：總長 {total:.0f}s 超過單次生成上限，建議拆成兩段分別生成）")
    return "\n".join(lines)


def _render_settings(scene):
    r = scene.render
    saved = {
        "filepath": r.filepath, "pct": r.resolution_percentage, "engine": r.engine,
        "media": r.image_settings.media_type, "fmt": r.image_settings.file_format,
        "stamp": r.use_stamp,
    }
    return saved


def _restore(scene, saved):
    r = scene.render
    r.filepath = saved["filepath"]
    r.resolution_percentage = saved["pct"]
    r.engine = saved["engine"]
    r.image_settings.media_type = saved["media"]
    if saved["media"] != "VIDEO" or saved["fmt"] == "FFMPEG":
        r.image_settings.file_format = saved["fmt"]
    r.use_stamp = saved["stamp"]


def export_package(out_dir, spec, scene=None, percentage=50, burn_in=False, render_video=True):
    """輸出到 out_dir：previs.mp4、shot_XX.png、seedance_prompt.txt、spec.json。回傳檔案清單。"""
    scene = scene or bpy.context.scene
    out_dir = bpy.path.abspath(out_dir)
    os.makedirs(out_dir, exist_ok=True)
    files = []

    prompt_path = os.path.join(out_dir, "seedance_prompt.txt")
    with open(prompt_path, "w", encoding="utf-8") as fh:
        fh.write(seedance_prompt(spec) + "\n")
    files.append(prompt_path)

    spec_path = os.path.join(out_dir, "spec.json")
    with open(spec_path, "w", encoding="utf-8") as fh:
        json.dump(spec, fh, ensure_ascii=False, indent=2)
    files.append(spec_path)

    saved = _render_settings(scene)
    frame_saved = scene.frame_current
    camera_saved = scene.camera
    r = scene.render
    try:
        r.engine = "BLENDER_WORKBENCH"
        r.resolution_percentage = percentage
        # 燒進畫面的文字會被影片模型一起學走，預設關閉
        r.use_stamp = burn_in
        if burn_in:
            r.use_stamp_marker = True
            r.use_stamp_frame = True
            r.use_stamp_camera = True
            r.use_stamp_date = False
            r.use_stamp_time = False
            r.use_stamp_render_time = False
            r.use_stamp_filename = False
            r.use_stamp_scene = False

        # 每顆鏡頭的首幀：可當 Seedance 的首幀／構圖參考
        r.image_settings.media_type = "IMAGE"
        r.image_settings.file_format = "PNG"
        markers = sorted(scene.timeline_markers, key=lambda m: m.frame)
        for i, m in enumerate(markers):
            scene.frame_set(m.frame)
            if m.camera:
                scene.camera = m.camera
            path = os.path.join(out_dir, f"shot_{i + 1:02d}.png")
            r.filepath = path
            bpy.ops.render.render(write_still=True)
            files.append(path)

        if render_video:
            r.image_settings.media_type = "VIDEO"
            r.image_settings.file_format = "FFMPEG"
            r.ffmpeg.format = "MPEG4"
            r.ffmpeg.codec = "H264"
            r.ffmpeg.constant_rate_factor = "HIGH"
            r.ffmpeg.audio_codec = "NONE"
            path = os.path.join(out_dir, "previs.mp4")
            r.filepath = path
            scene.frame_set(scene.frame_start)
            bpy.ops.render.render(animation=True)
            files.append(path)
    finally:
        _restore(scene, saved)
        scene.camera = camera_saved
        scene.frame_set(frame_saved)
    return files
