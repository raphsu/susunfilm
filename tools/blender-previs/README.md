# Susun Previs：Blender 預演 → Seedance

用來減少 AI 影片「抽卡」次數的工作流：

1. **一句話生成低模預演**。Claude 把需求寫成分鏡規格，外掛依規格搭出灰模場景、人偶、產品，以及每顆鏡頭的攝影機。
2. **在 Blender 裡調到對**。直接轉人偶骨頭、改攝影機、改時間軸，試錯都在這一步做完。
3. **打包交給 Seedance**。匯出參考影片、每顆鏡頭首幀和提示詞，Seedance 只負責「照著拍成真的」。

先把鏡頭設計對，再讓 AI 出片。特別適合動作和運鏡要求明確的 UGC 種草與產品廣告。

## 安裝

需要 Blender 4.2 以上（已在 5.0 測過）。

1. 把 `susun_previs/` 資料夾壓成 zip（或在該資料夾執行 `blender --command extension build`）。
2. Blender → Edit → Preferences → Get Extensions → 右上角 ⌄ → **Install from Disk…**，選這個 zip。
3. 要用 Claude 生成的話，到外掛偏好設定填 Anthropic API key（或設環境變數 `ANTHROPIC_API_KEY`），
   再按面板上的 **安裝 anthropic 套件**（Blender 內建的 Python 沒有這個套件）。

沒有 key 也能用：生成方式切到 **離線模板**，用關鍵字套內建的種草或產品廣告模板。

## 使用

3D 視窗按 `N` → **Previs** 分頁。

| 步驟 | 做什麼 |
|---|---|
| 1. 一句話 | 例：「小紅書種草，女生在浴室拿著精華液對鏡頭介紹，擦在臉上，手持感」→ **一句話生成預演** |
| 2. 調整 | 人偶：選 `Char.*` 骨架 → Pose Mode 轉骨頭 → `I` 下關鍵影格。鏡頭：`Shot.*.rig` 控制繞主體的角度，`Shot.*` 攝影機控制距離與高度，`Shot.*.aim` 是瞄準點 |
| 3. 交給 Seedance | **匯出 Seedance 素材包** → 輸出資料夾裡有 `previs.mp4`、`shot_01.png…`、`seedance_prompt.txt`、`spec.json` |

在 Seedance 裡：上傳 `previs.mp4` 當參考影片（@视频1），依序上傳人物照、產品照當參考圖片（@图片1、@图片2…），
然後貼上 `seedance_prompt.txt`。提示詞已經寫明「只參考鏡頭運動、構圖與動作，不要沿用灰模質感」。

### 改結構：編輯 spec

要加一顆鏡頭、換景別、換地點這類結構性的修改，按 **編輯 spec** 直接改 JSON（存在 .blend 裡的 `previs_spec.json`），
再按 **依 spec 重建**。重建會覆蓋手動調過的關鍵影格，所以結構先定，細節最後調。

## 規格裡能用的東西

- **地點**：`studio` `room` `bathroom` `kitchen` `cafe` `street` `outdoor`
- **道具**：`bottle` `box` `can` `phone` `jar` `tube` `cup` `bag` `block`（可以被拿著），`table` `chair` `sofa` `counter` `plant`
- **動作**：`stand` `walk`（搭配 `walk_to`）`sit` `hold` `hold_low` `show` `apply` `drink` `point` `wave` `both_hands`
- **景別**：`ECU` `CU` `MCU` `MS` `MLS` `WS`；**機位高度**：`eye` `low` `high` `top`
- **運鏡**：`static` `push_in` `pull_out` `orbit_left` `orbit_right` `orbit_360` `truck_left` `truck_right` `crane_up` `crane_down` `follow`，另外可以加 `handheld` 手持晃動

主打產品（`hero`）是橘色，其他小道具是藍色，家具是深灰色，一眼就能看出產品在畫面上的位置。

## 不開介面跑（批次／測試）

```bash
blender -b -P tools/blender-previs/cli.py -- --prompt "香水產品廣告，純產品，16:9" --out out/perfume
blender -b -P tools/blender-previs/cli.py -- --spec my_spec.json --out out/x --save out/x/previs.blend
```

`--offline` 不呼叫 Claude，`--no-video` 只輸出首幀與提示詞。也可以用 `pip install bpy` 的 Python 直接執行 `python cli.py -- …`。

## 檔案

```
tools/blender-previs/
├─ cli.py                     無介面流程
└─ susun_previs/              Blender 外掛（extension）
   ├─ __init__.py             面板、operators、偏好設定
   ├─ blender_manifest.toml
   ├─ spec.py                 規格 schema、正規化、離線關鍵字模板
   ├─ llm.py                  Claude（claude-opus-5-5）structured outputs → spec
   ├─ builder.py              spec → 場景、人偶、攝影機、時間軸
   └─ export.py               參考影片、首幀、Seedance 提示詞
```
