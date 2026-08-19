import type { Status } from './site'

export type JournalEntry = {
  id: string
  title: string
  slug: string
  date: string
  category: string
  coverImage: string
  excerpt: string
  body?: string[]
  gallery?: { src: string; alt: string }[]
  status: Status
}

/**
 * ⚠️ 目前沒有一篇 verified 的文章。
 * Notion 的三份素材都不能用：Threads 排程是 AI 草稿、自我問與答無具名受訪者、
 * 黃爸爸口述含隱私風險。詳見 docs/AUDIT.md 第 08 節。
 *
 * 下面三筆的「標題與摘要」是我起的草稿（status: 'draft'），
 * 只有標成 verified 的引文是來源原文。等你改寫或重寫後再改狀態。
 */
export const journal: JournalEntry[] = [
  {
    id: 'yanshui-outdoor-cinema',
    title: '廟埕變成電影院的那個晚上',
    slug: 'yanshui-outdoor-cinema',
    date: '2024',
    category: '地方觀察',
    coverImage: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-02-temple-facade-screening.jpg',
    excerpt: '《鹽水大飯店》在橋頭露天放映。躺椅、紅燈籠、老榕樹下的攤車，還有一整片仰著頭的臉。',
    // ⚠️ 內文是我起的草稿，只描述照片裡看得到的東西，沒有虛構任何情節。
    body: [
      '布幕架在廟埕上。躺椅一排一排攤開，紅燈籠在頭頂亮著。',
      '老榕樹下有一盞燈，攤車就擺在樹底下。散場前，機車和人擠在廟前。',
    ],
    gallery: [
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-02-temple-facade-screening.jpg', alt: '廟前廣場擺滿躺椅，布幕就架在廟埕上' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-05-courtyard-audience.jpg', alt: '觀眾坐在廟埕的躺椅上，紅燈籠在頭頂' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-08-banyan-tree-stall.jpg', alt: '老榕樹下的攤車，一盞燈' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-07-food-stall-vendor.jpg', alt: '攤販在燈下備料' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-10-audience-deckchairs-b.jpg', alt: '一整片躺椅，大人小孩都躺著看' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-11-temple-wide-night.jpg', alt: '夜裡的廟，遠遠看過去的全景' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-15-vendor-eggs-closeup.jpg', alt: '攤子上的鳥蛋特寫' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-16-screen-bw-film.jpg', alt: '布幕上的黑白電影' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-17-temple-motorcycles-crowd.jpg', alt: '散場前，機車和人擠在廟前' }
    ],
    status: 'draft',
  },
  {
    id: 'have-nice-day-wall',
    title: '走完三個小時，最後停在這面牆前面',
    slug: 'have-nice-day-wall',
    date: '2025-09-27',
    category: '巷弄觀察',
    coverImage: '/images/lelesiong/lelesiong-2025-autumn-group-have-nice-day.jpg',
    // 這句是咧咧相官方站原文
    excerpt: '沒有人事先知道會停在這裡。',
    status: 'draft',
  },
  {
    id: 'osaka-mirror',
    title: '在大阪，又對著一面反光鏡拍了一張',
    slug: 'osaka-mirror',
    date: '2025',
    category: '生活紀錄',
    coverImage: '/images/572779037_122240194802254592_5044683965945237359_n (1).jpg',
    excerpt: '在橋頭是這樣，在大阪也是這樣。習慣這種事，不會因為換了城市就改掉。',
    status: 'draft',
  },
  {
    id: 'cijin-dusk',
    title: '旗津的黃昏，和兩頂三角錐',
    slug: 'cijin-dusk',
    date: '2020-12-14',
    category: '地方觀察',
    coverImage: '/images/LINE_ALBUM_20201214 旗津_260819_1.jpg',
    excerpt: '海邊的木雕在暮色裡亮起來，我們站在旁邊，頭上頂著撿來的三角錐。',
    status: 'draft',
  },
]
