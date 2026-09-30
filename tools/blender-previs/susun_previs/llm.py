"""一句話 → spec。透過 Claude API（anthropic Python SDK）的 structured outputs。

Blender 內建的 Python 預設沒有 anthropic 套件；面板上有「安裝 anthropic」按鈕，
或自行用 Blender 的 python 執行 `-m pip install anthropic`。
沒有套件或沒有 key 時，呼叫端會改用 spec.keyword_spec()。
"""

import json

from . import spec as specmod

MODEL = "claude-opus-5-5"

SYSTEM = """你是廣告與短影音的分鏡導演，負責把一句需求變成 Blender 低模預演（previs）的場景規格。
這份規格會被程式直接搭成灰模場景、擺好人偶與攝影機，渲染出預演影片，
再交給 AI 影片模型（Seedance）當作運鏡與動作參考。所以重點是：鏡頭設計清楚、可執行、節奏對。

座標：Z 朝上，單位公尺，地面 z=0。畫面「正面」是 -Y。
- 角色 position 是 [x, y] 腳底位置；facing_deg=0 代表面向 -Y（正面）。人物身高約 1.7m，手在身體 -Y 方向前方。
- 道具 position 是 [x, y, z] 底部中心。桌面高 0.75，流理台/洗手台高 0.9。table 放在 y≈0.55 會在人物正前方偏後，擋不到人。
- held_by 填角色 id 時，道具會跟著那個角色的右手移動，position 會被忽略。
- 小型道具（bottle/box/can/phone/jar/tube/cup/bag/block）才能被拿；家具不行。
- 只有一個 hero=true，也就是主打產品。

鏡頭：
- camera.subject 必須是某個角色或道具的 id，鏡頭會追蹤它。
- angle_deg 是相對主體正面的水平角度，0 = 正面，±30 左右是常見的斜側。
- 景別：ECU 大特寫、CU 特寫、MCU 近景（胸以上）、MS 中景（腰以上）、MLS 中遠景（膝以上）、WS 全景。
- 鏡頭焦段 lens_mm：UGC 手機感用 24–28；人像 35–50；產品特寫 50–100。
- handheld=true 會加手持晃動，適合 UGC；產品廣告通常 false。
- 每顆鏡頭 1.5–5 秒，總長盡量在 15 秒內（影片模型單次生成的長度）。3–6 顆鏡頭。

動作：
- actions 依 at（0–1，在該鏡頭內的時間比例）排序；pose 會維持到下一個動作。
- 沒有 action 的角色會延續上一顆鏡頭的 pose。
- walk 需要 walk_to [x, y]，其他 pose 的 walk_to 給空陣列。
- 手上有產品時，常用 hold（胸前）、show（舉到臉旁給鏡頭看）、apply（擦在臉上）、drink（喝）、both_hands（雙手捧著）。

文字欄位（label、description、style_prompt）用繁體中文。description 寫畫面上發生什麼，給影片模型看的。
style_prompt 寫真實成片的光線、色調、質感，不要描述低模。"""


class SetupError(RuntimeError):
    """缺套件、缺 key 這類使用者可以自己修的問題。"""


def generate_spec(prompt, api_key=""):
    try:
        import anthropic
    except ImportError as e:
        raise SetupError("找不到 anthropic 套件。請按面板上的「安裝 anthropic」，或改用離線模式。") from e

    client = anthropic.Anthropic(api_key=api_key) if api_key else anthropic.Anthropic()

    try:
        response = client.beta.messages.create(
            model=MODEL,
            max_tokens=16000,
            betas=["server-side-fallback-2026-07-01"],
            system=SYSTEM,
            messages=[{"role": "user", "content": prompt}],
            output_config={
                "effort": "medium",
                "format": {"type": "json_schema", "schema": specmod.SCHEMA},
            },
            # 被安全分類器擋下時由伺服器自動改用建議的模型重跑
            extra_body={"fallbacks": "default"},
        )
    except anthropic.AuthenticationError as e:
        raise SetupError("API key 無效。請到偏好設定填入 Anthropic API key，或設定 ANTHROPIC_API_KEY。") from e
    except anthropic.RateLimitError as e:
        raise RuntimeError("Claude API 流量限制，稍等一下再試。") from e
    except anthropic.APIConnectionError as e:
        raise RuntimeError("連不上 Claude API，請確認網路。") from e
    except anthropic.APIStatusError as e:
        raise RuntimeError(f"Claude API 錯誤 {e.status_code}：{e.message}") from e
    except anthropic.AnthropicError as e:
        # 沒有 key 時 SDK 在建構 request 時就會丟這個
        raise SetupError(f"Claude API 無法使用：{e}") from e

    if response.stop_reason == "refusal":
        raise RuntimeError("Claude 拒絕了這個需求，換個描述試試。")
    if response.stop_reason == "max_tokens":
        raise RuntimeError("回應被截斷，需求可以再精簡一點。")

    text = next((b.text for b in response.content if b.type == "text"), "")
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        raise RuntimeError("Claude 回傳的內容不是合法 JSON。") from e
    return specmod.normalize(data)
