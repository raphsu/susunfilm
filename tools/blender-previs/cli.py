"""不開介面，直接跑完整流程：一句話 → 場景 → 素材包。

    blender -b -P cli.py -- --prompt "小紅書種草，女生在浴室介紹精華液" --out ./out
    blender -b -P cli.py -- --spec my_spec.json --out ./out --save out/previs.blend

--offline 不呼叫 Claude，改用內建關鍵字模板。
也可以在裝了 `pip install bpy` 的 Python 裡直接 `python cli.py -- ...`。
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bpy  # noqa: E402

from susun_previs import builder, export, llm  # noqa: E402
from susun_previs import spec as specmod  # noqa: E402


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
    ap = argparse.ArgumentParser()
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--prompt", help="一句話需求")
    src.add_argument("--spec", help="spec JSON 檔")
    ap.add_argument("--offline", action="store_true", help="不呼叫 Claude，用關鍵字模板")
    ap.add_argument("--out", default="previs_export", help="輸出資料夾")
    ap.add_argument("--percentage", type=int, default=50, help="渲染解析度百分比")
    ap.add_argument("--no-video", action="store_true", help="只輸出首幀與提示詞")
    ap.add_argument("--save", help="另存 .blend")
    args = ap.parse_args(argv)

    if args.spec:
        with open(args.spec, encoding="utf-8") as fh:
            data = specmod.normalize(json.load(fh))
    elif args.offline:
        data = specmod.keyword_spec(args.prompt)
    else:
        data = llm.generate_spec(args.prompt)

    # 從空場景開始
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)

    frames, shots = builder.build(data)
    print(f"built {len(shots)} shots, {frames} frames")
    files = export.export_package(os.path.abspath(args.out), data, percentage=args.percentage,
                                  render_video=not args.no_video)
    for f in files:
        print("wrote", f)
    if args.save:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(args.save))
        print("saved", args.save)
    print()
    print(export.seedance_prompt(data))


main()
