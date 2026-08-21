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
 * **標題與內文都是我起的草稿**，只描述照片裡看得到的東西，沒有虛構情節。
 * 使用者 2026-08-20 指示放行三篇：廟埕、我們把自己放進風景裡、三角錐系列。
 * 照片與「三角錐系列」這個名字都是使用者自己的；文字仍待使用者改寫。
 *
 * 另外兩篇（have-nice-day-wall / osaka-mirror）只有標題與摘要、沒有內文與照片，
 * 維持 draft——放行了頁面只會顯示「內文整理中」。
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
    id: 'self-portraits',
    title: '我們把自己放進風景裡',
    slug: 'self-portraits',
    category: '生活紀錄',
    coverImage: '/images/self/self-07-school-track-aerial.jpg',
    // ⚠️ 標題與內文是我起的草稿。
    // 地點只寫查得到的：五分車那張是**橋頭糖廠**（使用者 2026-08-20 指認）。
    // 其餘地點沒有定論，一律不寫。七張都沒有 EXIF，沒有日期。
    excerpt: '沒有別人，也沒有人幫忙按快門。相機架好、飛起來，然後我們走進去。',
    body: [
      '一組把自己放進去的照片。有的在地上，有的從天上往下看，共同點是沒有第三個人。',
      '躺在跑道上，四肢張開，旁邊是一棵很大的樹。站在月台上，一人抓一角把避光網舉過頭頂。在小火車站的葉子形棚子底下比 YA。爬上火箭遊具的頂端。站在一隻很大的貓底下揮手。',
      '最後一張在橋頭糖廠，空拍，我們站在五分車的車頂上，雨豆樹佔掉一半的畫面。',
    ],
    gallery: [
      { src: '/images/self/self-07-school-track-aerial.jpg', alt: '空拍學校操場：兩個人四肢張開躺在紅色跑道上，旁邊是一棵大樹的樹蔭' },
      { src: '/images/467885426_122178920618254592_6595225569394719289_n.jpg', alt: '竹林邊的窄軌鐵道月台，兩個人各抓一角，把一大片避光網舉過頭頂' },
      { src: '/images/self/self-01-forest-railway-bamboo-shelter.jpg', alt: '鐵道旁一棟竹編屋頂的木造建築，兩個人站在木平台上比 YA' },
      { src: '/images/self/self-02-forest-railway-station.jpg', alt: '林間小火車站，掛著「列車編組停車」的牌子，兩個人站在葉子形狀的棚子底下' },
      { src: '/images/self/self-05-rocket-playground.jpg', alt: '公園裡的火箭造型遊具，頂端是橘色尖錐，兩個人坐在最上層的欄杆後面' },
      { src: '/images/self/self-06-cat-arch.jpg', alt: '一座巨大的貓咪造型拱門，兩個人站在正中央舉起手' },
      { src: '/images/LINE_ALBUM_早期空拍作品_260819_1.jpg', alt: '空拍橋頭糖廠：兩個人站在五分車車頂張開手，身後是一整排雨豆樹，遠處有一根煙囪' },
    ],
    status: 'verified',
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
    coverImage: '/images/self/self-03-bamboo-fog-cones.jpg',
    // ⚠️「三角錐系列」是使用者自己的說法；下面的內文是我起的草稿，只描述照片裡看得到的東西。
    excerpt: '從旗津的海邊到雲霧裡的茶園，隔了好幾年，頭上戴的都是同一種東西。',
    body: [
      '霧裡的竹林，兩個人戴著三角錐互相把腳踢出去。這張最像整件事的樣子。',
      '空拍的茶園，人只剩指甲那麼大，兩個橘色的點在茶行之間。後來另外一張同樣的畫面變成品牌主視覺。',
      '再往前是 2020 年 12 月的旗津。兩件漂流木裝置在暮色裡打了燈，一件是舉著望遠鏡的救生員，一件是站在四隻腳上的章魚。我們一人頂一頂站在兩側。',
      '同一個動作，換了地方、換了年份，還是照做。',
    ],
    gallery: [
      { src: '/images/self/self-03-bamboo-fog-cones.jpg', alt: '霧中的竹林小徑，兩個人頭戴橘色三角錐，各把一隻腳踢向對方' },
      { src: '/images/self/self-04-tea-terrace-aerial-cones.jpg', alt: '空拍山坡上的茶園，兩個頭戴三角錐的人站在茶行之間，小得像兩個橘點' },
      { src: '/images/LINE_ALBUM_20201214 旗津_260819_1.jpg', alt: '旗津海邊的木雕救生員，兩個人頭戴三角錐站在兩側，遠處是落日與棕櫚樹' },
      { src: '/images/LINE_ALBUM_20201214 旗津_260819_2.jpg', alt: '旗津的漂流木章魚裝置在暮色裡打光，兩個人頭戴三角錐站在兩隻腳旁邊' },
      { src: '/images/[蘇珊日常] 橋仔頭，好好生活.jpg', alt: '蘇珊日常的品牌主視覺：空拍雲霧中的茶園，兩個頭戴三角錐的人走在茶行之間' },
    ],
    status: 'verified',
  },
]
