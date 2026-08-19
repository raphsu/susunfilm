import { SITE_URL, site } from '../content/site'

const OG_DEFAULT = '/brand/og-default.jpg'

/**
 * React 19 會自動把 <title> / <meta> / <link> 提升到 <head>，
 * 所以不需要 react-helmet 之類的東西。
 *
 * JSON-LD 是例外：React 不提升 inline <script>，它會留在原地（body）。
 * 這樣是刻意的——留在樹裡才會一起被 build 時的預先渲染輸出成靜態 HTML，
 * 爬蟲不執行 JS 也讀得到。Google 接受 body 裡的 JSON-LD。
 */
export function Seo({
  title,
  description,
  path,
  image = OG_DEFAULT,
  type = 'website',
  jsonLd,
}: {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  jsonLd?: object
}) {
  const full = title === site.name ? `${site.name} ${site.nameEn}` : `${title}｜${site.name} ${site.nameEn}`
  const url = `${SITE_URL}${path}`
  const img = image.startsWith('http') ? image : `${SITE_URL}${image}`
  // 只有那張真的是 1200×630 的預設圖才敢宣告尺寸
  const isDefaultOg = image === OG_DEFAULT

  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={`${site.name} ${site.nameEn}`} />
      <meta property="og:locale" content="zh_TW" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      {isDefaultOg && <meta property="og:image:width" content="1200" />}
      {isDefaultOg && <meta property="og:image:height" content="630" />}
      <meta property="og:image:alt" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  )
}

/** 全站共用的組織資料，掛在首頁 */
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '蘇珊日常 SUSUNFILM',
  alternateName: 'SUSUNFILM',
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo-color-2481.png`,
  email: site.social.email,
  description: '以影像為方法，觀看日常、人物與地方的創作品牌。',
  areaServed: { '@type': 'Place', name: '臺灣 高雄 橋頭' },
  sameAs: [site.social.instagram, site.social.facebook, site.social.threads, site.social.studio],
}
