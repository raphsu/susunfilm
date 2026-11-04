"""
cjk.py - Traditional Chinese support shared by hookscore.py and beats.py.

The original scripts count words with an ASCII regex, so a Chinese line comes
out as zero words, zero seconds and no payload. This module measures Chinese
the way it is spoken: one character is one syllable, and Taiwanese Mandarin on
camera runs at roughly 4.5 characters a second (270 per minute). English words
in the same line still count as words, so mixed lines (中英夾雜) time correctly.

To keep the original thresholds meaningful, Chinese characters are converted to
"English-word equivalents" by speaking time: 2.75 words/s against 4.5 chars/s,
so one word is worth about 1.64 characters. A 5-12 word hook becomes an 8-20
character hook, and the 3-second hook window is about 13 characters.
"""

import re

CJK_CLASS = r"㐀-䶿一-鿿豈-﫿"
CJK_RE = re.compile(f"[{CJK_CLASS}]")
CJK_RUN_RE = re.compile(f"[{CJK_CLASS}]+")
EN_WORD_RE = re.compile(r"[A-Za-z0-9$%'’-]+")

EN_WPS = 2.75            # 165 words per minute, the scripts' default
ZH_CPS = 4.5             # 270 characters per minute
CHARS_PER_WORD = ZH_CPS / EN_WPS

# Digits next to Chinese: Python's \b treats 還 and 3 as the same kind of
# character, so the boundary has to be ASCII-only.
DIGIT_RE = re.compile(
    r"(?:NT\$|\$)\s?\d[\d,]*(?:\.\d+)?"
    r"|(?<![A-Za-z0-9_.])\d[\d,]*(?:\.\d+)?")

# Chinese numerals. A lone 一 is left out for the same reason the English list
# leaves out "one": 一個 / 一下 / 一直 are filler far more often than a count.
# 十分 (very), 萬一 (in case) and 千萬別 (by all means don't) are not numbers.
ZH_NUM_RE = re.compile(
    r"(?<!萬)(?:[〇零兩二三四五六七八九十百千萬億半]|一(?=[十百千萬億]))"
    r"[〇零一二兩三四五六七八九十百千萬億]*")

ZH_MONEY = [
    "新台幣", "台幣", "塊錢", "塊", "元", "預算", "薪水", "營收", "獲利", "房租",
    "紅包", "訂金", "尾款", "報價", "費用", "退款", "賠償",
]

# Things on the line. Matched longest-first so 不要 is one marker, not 不 + 要.
ZH_STAKES = [
    "從來沒有", "從來沒", "從沒", "沒有人", "沒人", "沒想到", "千萬別", "千萬不要",
    "不要", "不能", "不會", "不是", "不見", "來不及", "差一點", "差點", "早知道",
    "而不是", "第一次", "毀了", "毀掉", "搞砸", "失誤", "錯誤", "失去", "損失",
    "弄丟", "丟了", "代價", "後悔", "秘密", "祕密", "真相", "竟然", "居然",
    "只有", "結果", "免費", "警告", "危險", "崩潰", "跑掉", "被偷", "放棄",
    "取消", "辭職", "開除", "刪掉", "封鎖", "直到", "除非", "問題", "風險",
    "應該", "已經", "還在", "之前", "唯一", "最後", "最",
    "別", "沒", "不", "錯", "賠", "虧", "騙", "偷", "停", "才", "但", "卻", "慘",
]

# Openers that spend the first second saying nothing.
ZH_WEAK_OPENERS = [
    "大家好", "哈囉", "哈嘍", "嗨", "嘿", "欸", "那個", "所以", "今天", "好的",
    "好啦", "其實", "基本上", "老實說", "說真的", "就是", "我想跟", "我要跟",
    "我今天", "跟大家", "歡迎", "你知道嗎", "你有沒有", "你是不是", "這支影片",
    "這集", "這是", "有一個", "很多人", "身為", "如果你", "首先", "先說",
]

ZH_IMPERATIVES = [
    "千萬", "不要", "別", "先別", "停", "快", "試試", "試著", "記得", "偷", "抄",
    "存起來", "收藏", "學", "馬上", "立刻", "永遠", "絕對",
]

ZH_DEALBREAKERS = [
    (re.compile(r"^\s*(?:別滑|不要滑|先別滑|停止滑|手指先停)"),
     "Opens with \"別滑走\". Asking for attention proves you have not earned it."),
    (re.compile(r"這支影片|這集|今天(?:要|來)?(?:跟大家|和大家|帶大家)|我(?:要|來)(?:教你|告訴你|分享)"),
     "Video preamble (這支影片 / 今天跟大家…). Delete it and open on the payoff."),
    (re.compile(r"^\s*(?:大家好|哈囉|哈嘍|嗨|嘿|歡迎)"),
     "Greeting (大家好 / 哈囉). Nobody came to the feed to be greeted."),
]

# Two-character words too common to count as a loop back to the hook.
ZH_STOP = {
    "我們", "你們", "他們", "她們", "大家", "自己", "就是", "一個", "這個", "那個",
    "什麼", "因為", "所以", "然後", "可以", "不是", "沒有", "已經", "知道", "還是",
    "如果", "但是", "其實", "真的", "這樣", "那樣", "現在", "時候", "一樣", "一下",
    "一直", "還有", "這是", "那是", "的人", "了一", "是我", "是你",
}


def cjk_count(text):
    return len(CJK_RE.findall(text))


def has_cjk(text):
    return bool(CJK_RE.search(text))


def en_words(text):
    """English words, with Chinese stripped out so it cannot glue to them."""
    stripped = CJK_RE.sub(" ", re.sub(r"(?<=\d),(?=\d)", "", text))
    return EN_WORD_RE.findall(stripped)


def seconds(text, wps=EN_WPS, cps=ZH_CPS):
    return len(en_words(text)) / wps + cjk_count(text) / cps


def eq_words(text):
    """Spoken length expressed in English words, so old thresholds still apply."""
    return len(en_words(text)) + cjk_count(text) / CHARS_PER_WORD


def display_width(text):
    """On-screen width: a Chinese character takes the room of two Latin ones."""
    return len(text.strip()) + cjk_count(text)


def _scan(text, terms):
    """Longest-match scan. Returns (term, start) without overlaps."""
    terms = sorted(terms, key=len, reverse=True)
    hits, i = [], 0
    while i < len(text):
        for t in terms:
            if text.startswith(t, i):
                hits.append((t, i))
                i += len(t)
                break
        else:
            i += 1
    return hits


def zh_numbers(text):
    out = []
    for m in ZH_NUM_RE.finditer(text):
        tok, nxt = m.group(), text[m.end():m.end() + 1]
        if tok == "萬一":                       # in case
            continue
        if tok == "千萬" and nxt in ("別", "不", "要"):   # by all means don't
            continue
        if tok == "十" and nxt == "分":         # 十分 = very, 十分鐘 = ten minutes
            if text[m.end() + 1:m.end() + 2] != "鐘":
                continue
            tok = "十分鐘"
        out.append((tok, m.start()))
    return out


def digits(text):
    return [(m.group().strip(), m.start()) for m in DIGIT_RE.finditer(text)]


def zh_money(text):
    return _scan(text, ZH_MONEY)


def zh_stakes(text):
    return _scan(text, ZH_STAKES)


def concrete_count(text):
    return len(digits(text)) + len(zh_numbers(text)) + len(zh_money(text))


def payload_offset(text):
    """Earliest Chinese payload (number, money, stake) as a character index."""
    found = [p for _, p in zh_numbers(text) + zh_money(text) + zh_stakes(text)]
    return min(found) if found else None


def eq_words_before(text, index):
    return eq_words(text[:index])


def starts_with_any(text, terms):
    head = re.sub(r"^[\s，。、！？「」『』…,.!?\"']+", "", text)
    for t in sorted(terms, key=len, reverse=True):
        if head.startswith(t):
            return t
    return None


def shared_phrases(a, b, limit=3):
    """Chinese phrases (2+ chars) that appear in both lines, longest first."""
    runs_a = CJK_RUN_RE.findall(a)
    b_text = "".join(CJK_RUN_RE.findall(b))
    found = []
    for size in range(6, 1, -1):
        for run in runs_a:
            for i in range(len(run) - size + 1):
                sub = run[i:i + size]
                if sub in b_text and sub not in ZH_STOP and not any(sub in f for f in found):
                    found.append(sub)
    return found[:limit]
