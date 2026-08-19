#!/usr/bin/env python3
"""
本機接收器。瀏覽器在 facebook.com 頁面內把圖片 blob POST 過來，
直接寫進 assets-source/images/fb/。
這樣圖片位元組不會經過對話，也不需要 Downloads 資料夾權限。
用完就關。
"""
import os, sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs

DEST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    'assets-source', 'images', 'fb')
os.makedirs(DEST, exist_ok=True)

class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_POST(self):
        q = parse_qs(urlparse(self.path).query)
        name = (q.get('name', ['unnamed'])[0])
        name = os.path.basename(name).replace('..', '')[:120] or 'unnamed.jpg'
        n = int(self.headers.get('Content-Length', 0))
        data = self.rfile.read(n)
        with open(os.path.join(DEST, name), 'wb') as f:
            f.write(data)
        self.send_response(200); self._cors()
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        self.wfile.write(f'{name} {len(data)}'.encode())
        print(f'saved {name} {len(data)//1024}KB', flush=True)

    def log_message(self, *a): pass

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
    print(f'receiver on http://localhost:{port} → {DEST}', flush=True)
    HTTPServer(('127.0.0.1', port), H).serve_forever()
