/**
 * 站台層級的內容。所有文案在這裡，不寫進 component。
 * status: 'verified' 已從來源確認 | 'review' 待確認 | 'draft' 我寫的，尚未經同意
 * 只有 verified 會進 production build（見 src/content/index.ts）
 */
export type Status = 'verified' | 'review' | 'draft'

/**
 * ⚠️ 正式網址還沒定。SEO 的 canonical / OG / sitemap 都靠它。
 * 部署前用環境變數覆蓋：VITE_SITE_URL=https://你的網域
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? 'https://raphsu.github.io/susunfilm').replace(/\/$/, '')

export const site = {
  url: SITE_URL,
  name: '蘇珊日常',
  nameEn: 'SUSUNFILM',
  tagline: '把日常留下來，地方就有了自己的樣子。',
  // 三個既有來源都沒有這句，但使用者 2026-08-19 親自裁示 Hero 用它 → 視為已確認
  taglineStatus: 'verified' as Status,
  keywords: ['影像創作', '地方觀察', '生活紀錄'],

  /** 來源：報名表單「關於我們」段落，已是「我們」口吻 */
  intro: [
    '{ Raph Su + Sunsun彡 }，婚禮外的時間，我們也喜歡分享日常。',
    '用鏡頭傳達內心的情感故事，讓畫面留存那最真誠的溫度感。',
    '一起述說關於這片土地的美好，留下眼前每一個獨一無二的時光！',
  ],
  introStatus: 'verified' as Status,

  /** 反覆出現三次的自有金句 */
  quotes: [
    { text: '家的模樣，不在模板裡，而在每一次轉角招呼、每一段靜靜留下的日常之中。', source: '青聚點提案', status: 'verified' as Status },
    { text: '多看她一眼，也許你就會發現沒發現的地方風景。', source: '青聚點提案 · 報名表單', status: 'verified' as Status },
    { text: '關於這个所在；關於橋仔頭。', source: 'FB 相簿 [life] Kio-a-thau', status: 'verified' as Status },
    { text: '行慢淡薄仔，才看會著。', romanization: 'kiânn bān tām-po̍h-á, tsiah khuànn ē tio̍h', source: '咧咧相官方站', status: 'verified' as Status },
  ],

  nav: [
    { zh: '首頁', en: 'HOME', to: '/' },
    { zh: '關於蘇珊', en: 'ABOUT', to: '/about' },
    { zh: '品牌故事', en: 'STORY', to: '/story' },
    { zh: '作品', en: 'PROJECTS', to: '/projects' },
    { zh: '日常誌', en: 'JOURNAL', to: '/journal' },
    { zh: '一起做過的事', en: 'COLLABORATION', to: '/collaboration' },
    { zh: '聯絡', en: 'CONTACT', to: '/contact' },
  ],

  social: {
    instagram: 'https://www.instagram.com/susunfilm/',
    threads: 'https://www.threads.net/@susunfilm',
    facebook: 'https://www.facebook.com/susunfilm2024',
    email: 'raph.sue@gmail.com', // 來源：FB 專頁公開營業信箱
    studio: 'https://www.raphsu.studio',
  },

  /** 品牌自有 hashtag，直接當 JOURNAL 的 tag 系統 */
  tags: ['巷弄觀察', '地方觀察', '生活紀錄', '剛剛好的生活', '街拍', '散步路徑', '橋頭生活'],
} as const

/** 四大創作專案。使用者 2026-08-19 定案 */
export const projectCategories = [
  { id: 'lele-siong',  no: '01', zh: '橋頭咧咧相',      sub: '橋仔頭日常影像誌',       tailo: 'Kio-thâu lē-lē-siòng' },
  { id: 'home-notes',  no: '02', zh: '《家》的生活筆記', sub: '家的日常・記憶・關係',   tailo: 'Kio-a-thau' },
  { id: 'art-life',    no: '03', zh: '藝術生活觀察',     sub: '藝術・創作・人的生活',   tailo: '' },
  { id: 'cross-field', no: '04', zh: '其他｜異業／區域觀察', sub: '跨域・地方・產業・城市', tailo: '' },
] as const
