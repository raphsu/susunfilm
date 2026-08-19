import manifest from '../image-manifest.json'

type Entry = { widths: number[]; width: number; height: number }
const MANIFEST = manifest as Record<string, Entry>

/** 部署在子路徑時（GitHub Pages 專案頁），public 資源要補上 base */
const withBase = (p: string) =>
  p.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + p : p

/**
 * srcset 用空白與逗號分隔候選項，檔名裡的空白會讓整條候選被丟掉
 * （Chrome：Dropped srcset candidate…）。三個 LINE 相簿匯出的檔名有空白，
 * 中獎的圖只會退回 src、拿不到對的尺寸。src 屬性瀏覽器會自己編碼，srcset 不會。
 */
const enc = (p: string) => p.replace(/ /g, '%20')

/**
 * 響應式圖片。
 * content 檔案裡寫的還是原始路徑（例如 /images/foo.jpg），
 * 這裡查 image-manifest.json 換成 WebP + JPEG 的多尺寸 srcset。
 *
 * 同時輸出 width/height，讓瀏覽器先算好版位，避免 CLS。
 * 找不到 manifest 就退回原路徑，不會壞掉。
 */
export function Img({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const e = MANIFEST[src]
  const loading = priority ? undefined : 'lazy'
  const common = {
    alt,
    className,
    decoding: 'async' as const,
    ...(priority ? { fetchPriority: 'high' as const } : { loading: loading as 'lazy' }),
  }

  if (!e) return <img src={withBase(src)} {...common} />

  const base = withBase(src).replace(/\.(jpe?g|png)$/i, '')
  const set = (ext: string) => e.widths.map(w => `${enc(base)}-${w}.${ext} ${w}w`).join(', ')
  const fallbackW = e.widths[e.widths.length - 1]

  return (
    // display:contents —— 讓 <picture> 不產生盒子，
    // <img> 才會直接對齊外層的 aspect 容器，h-full/object-cover 才有效。
    <picture className="contents">
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${base}-${fallbackW}.jpg`}
        srcSet={set('jpg')}
        sizes={sizes}
        width={e.width}
        height={e.height}
        {...common}
      />
    </picture>
  )
}
