#!/usr/bin/env python3
"""
圖片管線。原檔留在 assets-source/（不會被部署），
只把「程式碼真的引用到的」圖片產生成 WebP + JPEG 的多尺寸版本放進 public/images/。

用法：python3 scripts/images.py
需要 Pillow：python3 -m pip install pillow
"""
import json, os, re, shutil, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC  = ROOT / 'assets-source' / 'images'
OUT  = ROOT / 'public' / 'images'
WIDTHS = [640, 1280, 1920]
Q_JPG, Q_WEBP = 82, 78

def referenced() -> set[str]:
    """從 src/ 掃出 /images/... 的引用"""
    hits = set()
    for p in (ROOT / 'src').rglob('*.ts*'):
        for line in p.read_text(encoding='utf-8').splitlines():
            st = line.strip()
            if st.startswith(('*', '//', '/*')):   # 註解裡的範例路徑不算引用
                continue
            for m in re.finditer(r"/images/([^\"'`]+?\.(?:jpg|jpeg|png))", line):
                hits.add(m.group(1))
    return hits

MANIFEST = ROOT / 'src' / 'image-manifest.json'

def build(rel: str):
    src = SRC / rel
    if not src.exists():
        print(f'  ✗ 找不到原檔 {rel}', file=sys.stderr)
        return 0
    dst_dir = OUT / Path(rel).parent
    dst_dir.mkdir(parents=True, exist_ok=True)
    stem = Path(rel).stem
    im = Image.open(src)
    im = im.convert('RGB') if im.mode in ('CMYK', 'P') else im
    if im.mode == 'RGBA':
        bg = Image.new('RGB', im.size, (247, 245, 241))
        bg.paste(im, mask=im.split()[-1]); im = bg
    made = []
    for w in WIDTHS:
        if w > im.width and w != WIDTHS[0]:
            continue                      # 不放大，但最小尺寸一定要有
        tw = min(w, im.width)
        th = round(im.height * tw / im.width)
        r = im.resize((tw, th), Image.LANCZOS)
        r.save(dst_dir / f'{stem}-{w}.jpg',  'JPEG', quality=Q_JPG, optimize=True, progressive=True)
        r.save(dst_dir / f'{stem}-{w}.webp', 'WEBP', quality=Q_WEBP, method=6)
        made.append(w)
    return {'widths': made, 'width': im.width, 'height': im.height}

def main():
    if OUT.exists():
        os.system(f'rm -rf {OUT!s}'.replace(str(OUT), f'"{OUT}"'))
    refs = sorted(referenced())
    print(f'引用到 {len(refs)} 張圖，尺寸 {WIDTHS}')
    manifest = {}
    for rel in refs:
        info = build(rel)
        if info:
            manifest['/images/' + rel] = info
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding='utf-8')
    total = sum(f.stat().st_size for f in OUT.rglob('*') if f.is_file())
    print(f'{len(manifest)} 張、{sum(len(v["widths"])*2 for v in manifest.values())} 個檔案，'
          f'public/images/ 共 {total/1e6:.2f} MB')
    print(f'manifest → {MANIFEST.relative_to(ROOT)}')

if __name__ == '__main__':
    main()
