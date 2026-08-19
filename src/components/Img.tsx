import manifest from '../image-manifest.json'

type Entry = { widths: number[]; width: number; height: number }
const MANIFEST = manifest as Record<string, Entry>

/** 部署在子路徑時（GitHub Pages 專案頁），public 資源要補上 base */
const withBase = (p: string) =>
  p.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + p : p

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
  const set = (ext: string) => e.widths.map(w => `${base}-${w}.${ext} ${w}w`).join(', ')
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
