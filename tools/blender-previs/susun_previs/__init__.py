"""蘇珊日常 Previs：一句話生成低模預演場景，調好鏡頭與動作後打包交給 Seedance。

3D 視窗 → 側邊欄（N）→ Previs 分頁。
"""

bl_info = {
    "name": "Susun Previs",
    "author": "susunfilm",
    "version": (0, 1, 0),
    "blender": (4, 2, 0),
    "location": "3D Viewport > Sidebar > Previs",
    "description": "一句話生成低模預演（Previs），匯出參考影片與 Seedance 提示詞",
    "category": "Animation",
}

import json
import os
import subprocess
import sys
import threading

import bpy
from bpy.props import BoolProperty, EnumProperty, IntProperty, PointerProperty, StringProperty

from . import builder, export, llm
from . import spec as specmod

ADDON_ID = __package__ or __name__

_job = {"thread": None, "result": None, "error": None, "setup": False}


def _prefs(context):
    addon = context.preferences.addons.get(ADDON_ID)
    return addon.preferences if addon else None


def _current_spec():
    txt = bpy.data.texts.get(builder.SPEC_TEXT)
    if not txt:
        return None
    return specmod.normalize(json.loads(txt.as_string()))


class SusunPrevisPreferences(bpy.types.AddonPreferences):
    bl_idname = ADDON_ID

    api_key: StringProperty(
        name="Anthropic API key",
        description="留空則讀環境變數 ANTHROPIC_API_KEY",
        subtype="PASSWORD",
    )

    def draw(self, context):
        self.layout.prop(self, "api_key")


class SusunPrevisSettings(bpy.types.PropertyGroup):
    prompt: StringProperty(
        name="需求",
        description="一句話描述影片，例如：小紅書種草，女生在浴室介紹一瓶精華液，手持拍攝",
        default="小紅書種草短片，女生在浴室拿著一瓶精華液對鏡頭介紹，擦在臉上，手持感",
    )
    engine: EnumProperty(
        name="生成方式",
        items=[
            ("CLAUDE", "Claude", "用 Claude API 從一句話設計分鏡（需要 API key）"),
            ("OFFLINE", "離線模板", "用關鍵字套內建模板，不需網路"),
        ],
        default="CLAUDE",
    )
    out_dir: StringProperty(name="輸出資料夾", default="//previs_export/", subtype="DIR_PATH")
    percentage: IntProperty(name="解析度 %", default=50, min=10, max=100, subtype="PERCENTAGE")
    burn_in: BoolProperty(name="燒入鏡頭資訊", description="在參考影片上印鏡頭名與影格（可能被影片模型學走）", default=False)
    status: StringProperty(default="")


def _finish_job():
    """timer：等背景執行緒的 Claude 回應，回來後在主執行緒搭場景。"""
    t = _job["thread"]
    if t and t.is_alive():
        return 0.5
    _job["thread"] = None
    wm = bpy.context.window_manager
    window = wm.windows[0] if wm.windows else None
    scene = window.scene if window else bpy.context.scene
    settings = scene.susun_previs
    if _job["error"]:
        settings.status = f"失敗：{_job['error']}"
        if _job["setup"]:
            settings.status += "（可切換到「離線模板」）"
    else:
        try:
            with bpy.context.temp_override(window=window):
                frames, shots = builder.build(_job["result"], scene)
            settings.status = f"完成：{len(shots)} 顆鏡頭，{frames} 影格"
        except Exception as e:  # noqa: BLE001 - 顯示給使用者
            settings.status = f"搭場景失敗：{e}"
    for area in (window.screen.areas if window else []):
        area.tag_redraw()
    return None


class PREVIS_OT_generate(bpy.types.Operator):
    bl_idname = "susun_previs.generate"
    bl_label = "一句話生成預演"
    bl_description = "依需求描述生成低模場景、人偶、道具與每顆鏡頭的攝影機"

    def execute(self, context):
        settings = context.scene.susun_previs
        prompt = settings.prompt.strip()
        if not prompt:
            self.report({"WARNING"}, "先寫一句需求")
            return {"CANCELLED"}
        if _job["thread"]:
            self.report({"WARNING"}, "上一個請求還在跑")
            return {"CANCELLED"}

        if settings.engine == "OFFLINE":
            frames, shots = builder.build(specmod.keyword_spec(prompt), context.scene)
            settings.status = f"完成（離線模板）：{len(shots)} 顆鏡頭，{frames} 影格"
            return {"FINISHED"}

        prefs = _prefs(context)
        api_key = prefs.api_key if prefs else ""

        def work():
            _job["result"] = _job["error"] = None
            _job["setup"] = False
            try:
                _job["result"] = llm.generate_spec(prompt, api_key)
            except llm.SetupError as e:
                _job["error"], _job["setup"] = str(e), True
            except Exception as e:  # noqa: BLE001 - 顯示給使用者
                _job["error"] = str(e)

        _job["thread"] = threading.Thread(target=work, daemon=True)
        _job["thread"].start()
        settings.status = "Claude 設計分鏡中…"
        bpy.app.timers.register(_finish_job, first_interval=0.5)
        return {"FINISHED"}


class PREVIS_OT_rebuild(bpy.types.Operator):
    bl_idname = "susun_previs.rebuild"
    bl_label = "依 spec 重建"
    bl_description = f"讀取文字區塊 {builder.SPEC_TEXT}（可以在 Text Editor 手改）重建整個場景。手動調過的關鍵影格會被覆蓋"

    def execute(self, context):
        try:
            data = _current_spec()
        except json.JSONDecodeError as e:
            self.report({"ERROR"}, f"{builder.SPEC_TEXT} 不是合法 JSON：{e}")
            return {"CANCELLED"}
        if not data:
            self.report({"WARNING"}, "還沒有 spec，先生成一次")
            return {"CANCELLED"}
        frames, shots = builder.build(data, context.scene)
        context.scene.susun_previs.status = f"已重建：{len(shots)} 顆鏡頭，{frames} 影格"
        return {"FINISHED"}


class PREVIS_OT_export(bpy.types.Operator):
    bl_idname = "susun_previs.export"
    bl_label = "匯出 Seedance 素材包"
    bl_description = "渲染參考影片、每顆鏡頭首幀，並寫出 Seedance 提示詞"

    def execute(self, context):
        data = _current_spec()
        if not data:
            self.report({"WARNING"}, "還沒有 spec，先生成一次")
            return {"CANCELLED"}
        s = context.scene.susun_previs
        files = export.export_package(s.out_dir, data, context.scene, s.percentage, s.burn_in)
        s.status = f"已匯出 {len(files)} 個檔案 → {bpy.path.abspath(s.out_dir)}"
        self.report({"INFO"}, s.status)
        return {"FINISHED"}


class PREVIS_OT_copy_prompt(bpy.types.Operator):
    bl_idname = "susun_previs.copy_prompt"
    bl_label = "複製 Seedance 提示詞"

    def execute(self, context):
        data = _current_spec()
        if not data:
            self.report({"WARNING"}, "還沒有 spec，先生成一次")
            return {"CANCELLED"}
        context.window_manager.clipboard = export.seedance_prompt(data)
        self.report({"INFO"}, "已複製到剪貼簿")
        return {"FINISHED"}


class PREVIS_OT_install_anthropic(bpy.types.Operator):
    bl_idname = "susun_previs.install_anthropic"
    bl_label = "安裝 anthropic 套件"
    bl_description = "用 Blender 內建的 Python 把 anthropic SDK 裝到使用者 modules 資料夾"

    def execute(self, context):
        target = bpy.utils.user_resource("SCRIPTS", path="modules", create=True)
        cmd = [sys.executable, "-m", "pip", "install", "--upgrade", "--target", target, "anthropic"]
        try:
            subprocess.run([sys.executable, "-m", "ensurepip"], check=False, capture_output=True)
            subprocess.run(cmd, check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as e:
            self.report({"ERROR"}, f"安裝失敗：{(e.stderr or '')[-300:]}")
            return {"CANCELLED"}
        if target not in sys.path:
            sys.path.append(target)
        self.report({"INFO"}, "anthropic 已安裝")
        return {"FINISHED"}


class PREVIS_OT_open_spec(bpy.types.Operator):
    bl_idname = "susun_previs.open_spec"
    bl_label = "編輯 spec"
    bl_description = "在一個 Text Editor 視窗打開 spec JSON"

    def execute(self, context):
        txt = bpy.data.texts.get(builder.SPEC_TEXT)
        if not txt:
            self.report({"WARNING"}, "還沒有 spec，先生成一次")
            return {"CANCELLED"}
        for area in context.screen.areas:
            if area.type == "TEXT_EDITOR":
                area.spaces.active.text = txt
                return {"FINISHED"}
        bpy.ops.wm.window_new()
        area = bpy.context.window_manager.windows[-1].screen.areas[0]
        area.type = "TEXT_EDITOR"
        area.spaces.active.text = txt
        return {"FINISHED"}


class PREVIS_PT_panel(bpy.types.Panel):
    bl_label = "Previs → Seedance"
    bl_idname = "PREVIS_PT_panel"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Previs"

    def draw(self, context):
        s = context.scene.susun_previs
        layout = self.layout

        col = layout.column(align=True)
        col.label(text="1. 一句話")
        col.prop(s, "prompt", text="")
        col.prop(s, "engine", expand=True)
        row = col.row()
        row.scale_y = 1.4
        row.enabled = _job["thread"] is None
        row.operator(PREVIS_OT_generate.bl_idname, icon="SCENE_DATA")
        if s.engine == "CLAUDE":
            try:
                import anthropic  # noqa: F401
            except ImportError:
                col.operator(PREVIS_OT_install_anthropic.bl_idname, icon="IMPORT")
        if s.status:
            col.label(text=s.status, icon="INFO")

        col = layout.column(align=True)
        col.label(text="2. 調整")
        col.label(text="人偶：選骨架 → Pose Mode 轉骨頭，按 I 下關鍵影格", icon="ARMATURE_DATA")
        col.label(text="鏡頭：Shot.*.rig 轉圈、Shot.* 攝影機調距離", icon="CAMERA_DATA")
        row = col.row(align=True)
        row.operator(PREVIS_OT_open_spec.bl_idname, icon="TEXT")
        row.operator(PREVIS_OT_rebuild.bl_idname, icon="FILE_REFRESH")

        col = layout.column(align=True)
        col.label(text="3. 交給 Seedance")
        col.prop(s, "out_dir", text="")
        row = col.row(align=True)
        row.prop(s, "percentage")
        row.prop(s, "burn_in", text="", icon="FONT_DATA")
        col.operator(PREVIS_OT_export.bl_idname, icon="RENDER_ANIMATION")
        col.operator(PREVIS_OT_copy_prompt.bl_idname, icon="COPYDOWN")


classes = (
    SusunPrevisPreferences,
    SusunPrevisSettings,
    PREVIS_OT_generate,
    PREVIS_OT_rebuild,
    PREVIS_OT_export,
    PREVIS_OT_copy_prompt,
    PREVIS_OT_install_anthropic,
    PREVIS_OT_open_spec,
    PREVIS_PT_panel,
)


def register():
    modules = bpy.utils.user_resource("SCRIPTS", path="modules")
    if modules and os.path.isdir(modules) and modules not in sys.path:
        sys.path.append(modules)
    for cls in classes:
        bpy.utils.register_class(cls)
    bpy.types.Scene.susun_previs = PointerProperty(type=SusunPrevisSettings)


def unregister():
    if bpy.app.timers.is_registered(_finish_job):
        bpy.app.timers.unregister(_finish_job)
    del bpy.types.Scene.susun_previs
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
