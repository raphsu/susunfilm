import type { Status } from './site'

export type JournalEntry = {
  id: string
  title: string
  slug: string
  /** 查得到才寫。FB 相簿沒有時間戳、照片 EXIF 被剝掉，寧可不顯示也不要猜一個年份 */
  date?: string
  category: string
  coverImage: string
  excerpt: string
  body?: string[]
  gallery?: { src: string; alt: string }[]
  status: Status
}

/**
 * Notion 的三份素材都不能用：Threads 排程是 AI 草稿、自我問與答無具名受訪者、
 * 黃爸爸口述含隱私風險。詳見 docs/AUDIT.md 第 08 節。
 *
 * 標題與摘要都是我起的草稿。第一篇（廟埕）2026-08-20 經使用者指示放行上線，
 * 照片是使用者自己的，文字仍待使用者改寫。其餘三筆維持 draft。
 */
export const journal: JournalEntry[] = [
  {
    id: 'yanshui-outdoor-cinema',
    title: '廟埕變成電影院的那個晚上',
    slug: 'yanshui-outdoor-cinema',
    // 日期不明：FB 相簿沒有時間戳，17 張原檔的 EXIF 只剩 RNI Films 的濾鏡標記
    category: '地方觀察',
    coverImage: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-02-temple-facade-screening.jpg',
    excerpt: '《鹽水大飯店》在橋頭露天放映。躺椅、紅燈籠、老榕樹下的攤車，還有一整片仰著頭的臉。',
    // ⚠️ 標題與內文是我起的草稿（使用者 2026-08-20 指示先上線）。
    //    只描述照片裡看得到的東西，沒有虛構任何情節；等使用者的文字再換掉。
    body: [
      '布幕架在廟埕上。躺椅一排一排攤開，紅燈籠在頭頂亮著。',
      '片名打上去的時候是《鹽水大飯店》。投影機架在一把梯子上，工作燈和貨車就停在觀眾席旁邊，沒有人覺得需要遮起來。',
      '老榕樹下有一盞燈，攤車就擺在樹底下。有人邊看邊吃，有長輩推著自己的折疊椅走過布幕前。散場前，機車和人擠在廟前。',
    ],
    gallery: [
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-11-temple-wide-night.jpg', alt: '夜裡的廟，遠遠看過去的全景' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-03-temple-interior-lanterns.jpg', alt: '廟裡整片紅燈籠亮著，有人坐在階梯上等開場' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-02-temple-facade-screening.jpg', alt: '廟前廣場擺滿躺椅，布幕就架在廟埕上' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-14-screen-wide-balloons.jpg', alt: '布幕上打出片名《鹽水大飯店》，兩顆球形燈立在觀眾席旁' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-12-audience-spotlight.jpg', alt: '工作燈、《鹽水大飯店》的立牌與貨車，都擠在觀眾席側邊' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-04-temple-night-deckchairs.jpg', alt: '一整片躺椅仰著頭，身後是廟的燈籠與街屋' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-05-courtyard-audience.jpg', alt: '觀眾坐在廟埕的躺椅上，紅燈籠在頭頂' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-09-audience-deckchairs-a.jpg', alt: '躺椅一排一排，有人邊看邊吃，小孩擠在大人旁邊' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-10-audience-deckchairs-b.jpg', alt: '一整片躺椅，大人小孩都躺著看' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-08-banyan-tree-stall.jpg', alt: '老榕樹下的攤車，一盞燈' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-07-food-stall-vendor.jpg', alt: '攤販在燈下備料' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-15-vendor-eggs-closeup.jpg', alt: '攤子上的鳥蛋特寫' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-01-screen-and-audience-back.jpg', alt: '從觀眾背後看過去，投影機架在梯子上，布幕亮著' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-06-elder-walking-past-screen.jpg', alt: '一位長輩推著折疊椅走過布幕前' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-16-screen-bw-film.jpg', alt: '布幕上的黑白電影' },
      { src: '/images/fb/yanshui-outdoor-cinema/yanshui-outdoor-cinema-17-temple-motorcycles-crowd.jpg', alt: '散場前，機車和人擠在廟前' }
    ],
    status: 'verified',
  },
  {
    id: 'chiayi-self-portraits',
    title: '在嘉義，我們把自己放進風景裡',
    slug: 'chiayi',
    category: '生活紀錄',
    coverImage: '/images/LINE_ALBUM_早期空拍作品_260819_1.jpg',
    excerpt: '一張在鐵軌旁的月台，一張從天上往下看。都是自拍，只是相機一個站在地上，一個飛起來。',
    // ⚠️ 標題與內文是我起的草稿，只描述照片裡看得到的東西。
    //    地點「嘉義」是使用者 2026-08-20 指認的；日期不明，兩張都沒有 EXIF。
    body: [
      '兩張都是把自己放進去的照片。沒有別人，也沒有人幫忙按快門。',
      '一張在月台上，我們一人抓一角把避光網舉起來，竹林在後面，鐵軌從腳邊繞過去。',
      '一張是空拍。人縮得很小，站在五分車的車頂上，整排雨豆樹佔掉一半的畫面，遠遠有一根煙囪。',
    ],
    gallery: [
      { src: '/images/467885426_122178920618254592_6595225569394719289_n.jpg', alt: '竹林邊的窄軌鐵道月台，兩個人各抓一角，把一大片避光網舉過頭頂' },
      { src: '/images/LINE_ALBUM_早期空拍作品_260819_1.jpg', alt: '空拍：兩個人站在五分車車頂張開手，身後是一整排雨豆樹，遠處有一根煙囪' },
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
    id: 'traffic-cones',
    title: '三角錐系列',
    slug: 'traffic-cones',
    // 沒有單一日期：這是跨年份的同一個動作。旗津那兩張的日期來自檔名 20201214，
    // 茶園那張沒有任何日期線索。
    category: '生活紀錄',
    coverImage: '/images/LINE_ALBUM_20201214 旗津_260819_1.jpg',
    // ⚠️「三角錐系列」是使用者自己的說法；下面的內文是我起的草稿，只描述照片裡看得到的東西。
    excerpt: '從旗津的海邊到雲霧裡的茶園，隔了好幾年，頭上戴的都是同一種東西。',
    body: [
      '第一張要看一下才找得到。空拍的茶園，雲霧壓在山腰上，兩個黃色的點走在茶行之間，人只剩指甲那麼大，頭上頂著三角錐。這張後來變成品牌主視覺。',
      '另外兩張是 2020 年 12 月的旗津。兩件漂流木裝置在暮色裡打了燈，一件是舉著望遠鏡的救生員，一件是站在四隻腳上的章魚。我們一人頂一頂站在兩側，都把腳踢出去。',
      '同一個動作，換了地方、換了年份，還是照做。',
    ],
    gallery: [
      { src: '/images/[蘇珊日常] 橋仔頭，好好生活.jpg', alt: '空拍雲霧中的茶園，兩個穿黃雨衣、頭戴三角錐的人走在茶行之間；畫面上是蘇珊日常的主視覺文案' },
      { src: '/images/LINE_ALBUM_20201214 旗津_260819_1.jpg', alt: '旗津海邊的木雕救生員，兩個人頭戴三角錐站在兩側，遠處是落日與棕櫚樹' },
      { src: '/images/LINE_ALBUM_20201214 旗津_260819_2.jpg', alt: '旗津的漂流木章魚裝置在暮色裡打光，兩個人頭戴三角錐站在兩隻腳旁邊' },
    ],
    status: 'draft',
  },
]
