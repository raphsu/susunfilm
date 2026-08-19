import type { Status } from './site'

export type Section = { h: string; p?: string[]; list?: string[]; note?: string }
export type Credit = { role: string; name: string }
export type Milestone = { when: string; what: string }

export type Project = {
  id: string
  no: string
  title: string
  subtitle: string
  tailo?: string
  slug: string
  year?: string
  location?: string
  category: string[]
  coverImage: string
  ratio: string
  description: string
  externalUrl?: string
  externalLabel?: string
  status: Status

  /** 內頁 */
  lead?: string
  sections?: Section[]
  timeline?: Milestone[]
  role?: string[]
  roleStatus?: Status
  credits?: Credit[]
  videos?: { title: string; url: string; len?: string }[]
  gallery?: { src: string; alt: string; ratio?: string }[]
  /** 兩張並置。同一個地方、不同時間。 */
  diptych?: {
    left: { src: string; alt: string; label: string }
    right: { src: string; alt: string; label: string }
    caption?: string
  }
  sources?: string[]
}

/**
 * 四大創作專案。使用者 2026-08-19 定案。
 * 所有內文都出自既有來源原文或原文重組，沒有虛構。
 * 查不到的欄位一律標 [待補資料]，不臆測。
 */
export const projects: Project[] = [
  // ────────────────────────────────────────────────
  {
    id: 'lele-siong',
    no: '01',
    title: '橋頭咧咧相',
    subtitle: '橋仔頭日常影像誌',
    tailo: 'Kio-thâu lē-lē-siòng',
    slug: 'lele-siong',
    year: '2025–',
    location: '高雄 · 橋頭老街',
    category: ['地方', '人物', '影像', '教育'],
    coverImage: '/images/lelesiong/lelesiong-2025-autumn-group-have-nice-day.jpg',
    ratio: 'aspect-[4/5]',
    description: '走完三個小時，最後停在這面牆前面。沒有人事先知道會停在這裡。',
    externalUrl: 'https://raphsu.github.io/lelesiong/',
    externalLabel: '看完整計畫與報名',
    status: 'verified',

    lead: '用最剛好的方式，記錄橋仔頭此刻的生活樣貌，讓地方的故事被看見、被保存，也被喜歡。',
    sections: [
      {
        h: '為什麼是現在',
        p: [
          '橋仔頭正經歷劇烈的社會、經濟、文化變遷。這不是緩慢的演變，而是快速的轉型。',
          '科學園區進駐了 26 家廠商，預計創造一萬五千個就業機會。人口成長率 9.5%，二十到三十九歲的青年將近三成。房價年增幅超過三成。而 2009 到 2011 年的老街拓寬，拆掉了十五棟以上的歷史建築，只剩三棟日治建築留下來。',
          '天成潤餅開了七十年，2025 年 5 月 31 日永久熄燈。這就是為什麼要記錄。',
        ],
      },
      {
        h: '三味',
        list: [
          '少一味｜珍惜的滋味——老店、潤餅店、五金行、夜市攤、老職人。在故事完全消失之前記下來。',
          '多一味｜創新的滋味——青年返鄉、新店家、新行動。讓地方的故事不只是懷舊，也包含希望。',
          '剛剛好｜生活的滋味——晨昏光線、巷弄、街角、火車、農田、生活對話。',
        ],
      },
      {
        h: '影像採集',
        list: [
          'Video Postcard 動態明信片 12–20 支，每支 10–15 秒，以「生活」與「空氣感」為主',
          '主題短片 2–3 支，每支 3–5 分鐘，深度呈現一個故事或一個人物',
          '人物故事訪談 10–15 位，文字紀錄 + 照片 + 短音檔',
        ],
        note: '出自《橋仔頭咧咧相・好好生活企劃提案》v1.0（2025 年 11 月）。目前為企劃內容，成果陸續進行中。',
      },
      {
        h: '攝影走讀工作坊',
        p: [
          '三個小時，練習停下來。三分鐘找一個最吸引你的細節，抽一張任務卡換一種感官走路，回家後三天內剪一支十秒的短片。',
          '不教參數，教你怎麼決定要拍什麼。每場十人，額滿為止。集合在橋仔頭白屋・有田咖啡。',
        ],
        note: '2025 秋季場首辦，2026 為第二季，共五場。年終所有人的動態明信片連播，作品收進小誌《咧咧相》創刊號。',
      },
    ],
    timeline: [
      { when: '2025.09.27', what: '2025 秋季場｜高雄 × 橋頭老街，14:00–17:00' },
      { when: '2025.11', what: '《橋仔頭咧咧相・好好生活企劃提案》v1.0' },
      { when: '2026.08.22', what: '光．熱｜橋仔頭白屋 → 糖廠雨豆樹 → 五分車鐵道' },
      { when: '2026.09.19', what: '聲．廟埕｜興糖福德祠 → 鳳橋宮 → 橋頭舊戲園' },
      { when: '2026.10.17', what: '色．老屋｜台糖宿舍群 → 老街 → 台糖展售館' },
      { when: '2026.11.14', what: '味．市場｜橋頭第一公有市場 → 周邊早餐店' },
      { when: '2026.12.13', what: '放映．小誌｜橋仔頭白屋・有田咖啡' },
    ],
    role: ['企劃統籌', '攝影', '動態影像', '工作坊帶領'],
    roleStatus: 'verified',
    credits: [
      { role: '企劃統籌', name: '小夫 × 蘇珊' },
      { role: '場域協力', name: '橋仔頭白屋・有田咖啡' },
      { role: '在地協力', name: '橋仔頭青聚點' },
    ],
    diptych: {
      left: {
        src: '/images/fb/qiaotou-street/qiaotou-street-01-have-nice-day-wall-bicycle.jpg',
        alt: '藍色鐵皮牆上手寫的 HAVE NICE DAY，牆邊一台黃色腳踏車，沒有人',
        label: '2024.04.25',
      },
      right: {
        src: '/images/lelesiong/lelesiong-2025-autumn-group-have-nice-day.jpg',
        alt: '同一面藍色鐵皮牆前，十位走讀參加者掛著名牌、帶著相機合照',
        label: '2025.09.27',
      },
      caption: '同一面牆。第一次經過的時候只有一台腳踏車，隔一年，十個人走完三小時剛好停在這裡。',
    },
    gallery: [
      { src: '/images/fb/qiaotou-street/qiaotou-street-01-have-nice-day-wall-bicycle.jpg', alt: '藍色鐵皮牆上的手寫字 HAVE NICE DAY，牆邊停著一台黃色腳踏車' },
      { src: '/images/fb/qiaotou-street/qiaotou-street-02-sugar-refinery-tree-avenue.jpg', alt: '糖廠旁的老樹夾道，午後空曠的柏油路' },
      { src: '/images/fb/qiaotou-street/qiaotou-street-05-temple-lanterns-shengshen-zhengde.jpg', alt: '廟口成排的紅燈籠，寫著聖神正德福' },
      { src: '/images/fb/qiaotou-street/qiaotou-street-04-brick-house-tower-bicycle.jpg', alt: '紅磚老屋與水塔，牆邊一台腳踏車' },
      { src: '/images/fb/qiaotou-street/qiaotou-street-03-brick-wall-noticeboard.jpg', alt: '磚牆前的告示牌與樹蔭' },
    ],
    sources: ['橋頭咧咧相官方站', 'Notion《橋仔頭咧咧相・好好生活企劃提案》v1.0'],
  },

  // ────────────────────────────────────────────────
  {
    id: 'home-notes',
    no: '02',
    title: '《家》的生活筆記',
    subtitle: '家的日常・記憶・關係',
    tailo: 'Kio-a-thau',
    slug: 'home-notes',
    year: '2025–',
    location: '高雄 · 仕和里 → 橋頭糖廠',
    category: ['地方', '人物', '影像'],
    coverImage: '/images/546056794_122230203650254592_5362882001383672505_n.jpg',
    ratio: 'aspect-[3/2]',
    description: '小時候阿嬤家在糖廠宿舍群裡，後來因捷運工程拆遷，和糖廠的連結被切斷。',
    status: 'verified',

    lead: '家的模樣，不在模板裡，而在每一次轉角招呼、每一段靜靜留下的日常之中。',
    sections: [
      {
        h: '從一種「熟悉卻陌生」開始',
        p: [
          '小時候阿嬤家就在橋頭糖廠的宿舍群裡，下了課就走到阿嬤家寫作業、玩耍，那時候跟糖廠的生活圈關係算是緊密的。',
          '後來就學要不在市區、要不外地往返，阿嬤家也因為捷運工程拆離，跟糖廠生活圈的連結就這樣斷了。再後來因為工作，又回到橋頭糖廠裡。',
          '這個計畫想補回那段斷離的空缺記憶，以及對「橋頭」的熟悉感與認同感。',
        ],
      },
      {
        h: '範圍',
        p: [
          '從現居的仕和里，走到工作所在、也是小時候阿嬤家的橋頭糖廠廠區。以老街為中心，點、線、面擴散。',
          '多看她一眼，也許你就會發現沒發現的地方風景。',
        ],
      },
      {
        h: '預計產出',
        list: [
          '《橋頭晨昏記事》攝影系列——市場日常、五分車移動、老街騎樓、工業遺構',
          '《橋頭時光切片》短片——15–30 秒社群短影音，與 3–5 分鐘影像紀錄',
          '《橋頭散步札記》文字——散文筆記、訪談紀錄、地方觀察',
          '《晨昏之間：橋頭日常》微策展——線上展覽／小型攝影展／影像分享會',
        ],
        note: '以上為企劃規劃內容，執行進度陸續更新。',
      },
    ],
    timeline: [
      { when: '2025.06.21', what: '解謎橋仔頭—小店仔的前世今生' },
      { when: '2025.07.17–18', what: '來去橋仔頭—環境教育與藝術生活' },
      { when: '2025.07.20', what: '提出青聚點 Dream Idea 績優點子計畫書' },
      { when: '2025.08.14–15', what: '來去橋仔頭—解謎社區盤撋（puânn-nuá）行動' },
      { when: '2025.09.01–09.30', what: '「看見青春」共創成果展' },
    ],
    role: ['企劃', '攝影', '文字紀錄', '田野踏查'],
    roleStatus: 'verified',
    credits: [{ role: '計畫', name: '橋仔頭青聚點 Dream Idea 績優點子計畫' }],
    sources: ['Notion《橋仔頭青聚點 三味》', 'Notion 2025 年橋頭微駐村企劃'],
  },

  // ────────────────────────────────────────────────
  {
    id: 'art-life',
    no: '03',
    title: '藝術生活觀察',
    subtitle: '藝術・創作・人的生活',
    slug: 'art-life',
    year: '2023–2025',
    location: '橋仔頭糖廠藝術村 · 衛武營',
    category: ['藝術', '人物', '影像'],
    coverImage: '/images/from-raphsu-studio/qiaotou-2024-tiezhilu-artists-group.jpg',
    ratio: 'aspect-[3/2]',
    description: '鐵支路：茁・空・光。連續三年的國際藝術進駐，來自法國、日本、台灣與美國的眼睛。',
    status: 'verified',

    lead: '藝術家怎麼看一個地方，和住在那裡的人怎麼看，是兩件事。把兩邊都留下來，地方才完整。',
    sections: [
      {
        h: '橋仔頭糖廠藝術村｜連續三年',
        list: [
          '2023 共振 RESONANCES — Through the Eyes of Artists from France, Japan, Taiwan and the US.',
          '2024 鐵支路：茁・空・光 — 展期 11.09–01.05',
          '2025 初始 — 國際藝術交流進駐成果展',
        ],
      },
      {
        h: '駐村藝術家作品紀錄',
        list: [
          'Jakob Wldoarczyk《Davis’ Granary 戴維斯的穀倉》',
          'Ariel Ruby《Feast for the Eyes, Food for the Gods 視覺的饗宴，神靈的食物》',
          '紀建廷《內部整修 Sometimes Love Just Ain’t Enough》',
          '孫佳暄《家族氣味的初始》',
        ],
      },
      {
        h: '其他藝術紀錄',
        list: [
          '出彩｜賴新龍 個展',
          '朦朧的慾望｜張惠蘭 創作展',
          '胡嘉豪《與你相愛》｜衛武營首演高空表演',
        ],
      },
    ],
    videos: [
      { title: '正片《初始》2025 橋仔頭糖廠藝術村國際藝術交流進駐成果展', url: 'https://vimeo.com/1139745537', len: '13:30' },
      { title: 'KAT｜Jakob Wldoarczyk《Davis’ Granary 戴維斯的穀倉》', url: 'https://vimeo.com/1143085066', len: '2:45' },
      { title: 'KAT｜Ariel Ruby《Feast for the Eyes, Food for the Gods》', url: 'https://vimeo.com/1143084980', len: '2:51' },
      { title: 'KAT｜紀建廷《內部整修 Sometimes Love Just Ain’t Enough》', url: 'https://vimeo.com/1143084896', len: '3:20' },
      { title: 'KAT｜孫佳暄《家族氣味的初始》', url: 'https://vimeo.com/1142891303', len: '3:00' },
    ],
    roleStatus: 'review',
    credits: [{ role: '主辦', name: '橋仔頭糖廠藝術村 KAT' }],
    sources: ['raphsu.studio', 'Vimeo'],
  },

  // ────────────────────────────────────────────────
  {
    id: 'cross-field',
    no: '04',
    title: '其他｜異業／區域觀察',
    subtitle: '跨域・地方・產業・城市',
    slug: 'cross-field',
    year: '2020–',
    location: '台南 · 美濃 · 大寮 · 旗津 · 前鎮',
    category: ['地方', '產業', '城市'],
    coverImage: '/images/LINE_ALBUM_20201214 旗津_260819_2.jpg',
    ratio: 'aspect-[3/2]',
    description: '有帶相機就是不免會職業病上身，沒有相機就會沒有安全感。',
    status: 'verified',

    lead: '不是接案紀錄，是帶著相機去別人的地方，然後忍不住拍。',
    sections: [
      {
        h: '前鎮漁港｜海籽藝術派對・鱻滿藝築，與港共感',
        p: [
          '參與型藝術教育計畫，地點在前鎮漁港船員會館。漁業署與好合文創主辦，魚刺客團隊攜手民眾及外籍船員共同創作，國立高雄大學參與調查與創作規劃。',
          '我們的部分是「港邊鱻旅行」系列走讀的影像紀錄。',
        ],
        note: '展出作品《魚葉樹》《明日餐桌》《漁工塗鴉》《魚玻盪漾》由魚刺客團隊與民眾、外籍船員共同創作，非本站作品。',
      },
      {
        h: '大募集！海洋守護者｜以參與者身分',
        p: [
          '這次我們是以參與者的身份參加。但有帶相機就是不免會職業病上身，沒有相機就會沒有安全感，所以就產生了那些照片。',
          '去了蘆竹溝、井仔腳瓦盤鹽田聽導覽，在熾熱的台南體驗漁村漫步，還自己手作蚵殼黑腹燕鷗。最後回到雙春濱海遊憩區逛市集、看布袋戲。',
        ],
      },
      {
        h: '美濃',
        list: [
          '一日美濃慢旅行（12:50）',
          '首部曲｜美濃色彩',
          '二部曲｜花海成果紀錄',
          '美濃花海冬遊記 2024.2.4–2.14',
          '美濃區公所 農林漁牧業普查宣導短片',
        ],
      },
      {
        h: '其他區域',
        list: [
          '大寮｜紅豆有甜 大寮有你（前導形象影片 3:00 4K）',
          '旗津｜海邊公共藝術（2020.12.14）',
          '麻豆｜柚花季・春日裡的柚花物語，總爺藝文中心，2024.3.16–17、3.30–31',
          '黃埔新村｜2025 彩繪眷村慶元宵寫生比賽',
        ],
      },
    ],
    videos: [
      { title: '「港邊鱻旅行」系列走讀 合集', url: 'https://vimeo.com/1085692332', len: '6:00' },
      { title: '正片｜一日美濃慢旅行', url: 'https://vimeo.com/1081405954', len: '12:50' },
      { title: '首部曲｜美濃色彩', url: 'https://vimeo.com/1161357210', len: '2:32' },
      { title: '二部曲｜花海成果紀錄', url: 'https://vimeo.com/1164281938', len: '2:40' },
      { title: '前導形象影片｜紅豆有甜 大寮有你', url: 'https://vimeo.com/1144561686', len: '3:00' },
    ],
    roleStatus: 'review',
    credits: [
      { role: '海洋守護者｜計畫', name: '113 年度臺南市海洋保育教育推廣計畫' },
      { role: '海洋守護者｜補助', name: '海洋委員會海洋保育署' },
      { role: '海洋守護者｜主辦', name: '臺南市政府觀光旅遊局' },
      { role: '海洋守護者｜承辦', name: '小屋家文創空間' },
      { role: '海籽藝術派對｜主辦', name: '漁業署 × 好合文創' },
      { role: '海籽藝術派對｜創作', name: '魚刺客團隊' },
    ],
    sources: ['農業部漁業署新聞', 'Facebook 蘇珊日常susunfilm', 'Vimeo', 'raphsu.studio'],
  },
]

/** 首頁「最近正在看的事」只放三件 */
export const featured = [projects[1], projects[0], projects[2]]
