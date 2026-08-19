import type { Status } from './site'

/**
 * ⚠️ intro 是把 Notion《橋仔頭青聚點 三味》裡小夫的第一人稱自介，
 * 改寫成「我們」的口吻（使用者 2026-08-19 決定 ABOUT 用「我們」、共同語氣不分人）。
 * 這是全站唯一一處改寫既有文案的地方，標 review，等使用者確認後改 verified。
 * 原文保留在 introSource，逐句對照用。
 */
export const about = {
  eyebrow: 'ABOUT',
  title: '關於蘇珊',

  intro: [
    '我們是蘇珊日常。一個拿相機的，一個做平面設計的，都是在地的橋頭人。',
    '我們習慣用鏡頭觀察生活，也希望透過影像和文字，讓更多人看見地方的溫度。',
  ],
  introStatus: 'review' as Status,

  story: [
    '會從橋頭開始，是因為那種「熟悉卻陌生」的感覺。',
    '小時候阿嬤家就在橋頭糖廠的宿舍群裡，下了課就走到阿嬤家寫作業、玩耍，那時候跟糖廠的生活圈關係算是緊密的。後來就學要不在市區、要不外地往返，阿嬤家也因為捷運工程拆離，跟糖廠生活圈的連結就這樣斷了。',
    '再後來因為工作，我們又回到橋頭糖廠裡。也希望可以藉此補回那段斷離的空缺記憶，以及對「橋頭」的熟悉感與認同感。',
  ],
  storyStatus: 'review' as Status,

  /** 原文照錄，供對照。不上線。 */
  introSource:
    '大家好，我是蘇珊日常的攝影師，同時也是平面設計者，一名在地的橋頭人。我習慣用鏡頭觀察生活，也希望透過影像和文字，讓更多人看見地方的溫度。',

  timelineTitle: '一路走到現在',

  /**
   * 只放有出處的年份。沒有日期的事不硬填，標 '—'。
   * 出處：Notion 青聚點 / 咧咧相官方站 / FB 專頁 / 官網圖片內文字 / Vimeo
   */
  timeline: [
    { year: '童年',      text: '阿嬤家在橋頭糖廠的宿舍群裡，下課就往糖廠跑', status: 'verified' as Status },
    { year: '—',        text: '阿嬤家因捷運工程拆遷，與糖廠生活圈的連結中斷', status: 'verified' as Status },
    { year: '—',        text: '因為工作，再度回到橋頭糖廠', status: 'verified' as Status },
    { year: '2020.12',  text: '旗津海邊的公共藝術', status: 'review' as Status },
    { year: '2023',     text: '共振 RESONANCES｜橋仔頭糖廠藝術村國際藝術交流進駐成果展', status: 'verified' as Status },
    { year: '2024.03',  text: '麻豆柚花季・春日裡的柚花物語｜總爺藝文中心', status: 'verified' as Status },
    { year: '2024',     text: '大募集！海洋守護者｜113 年度臺南市海洋保育教育推廣計畫，以參與者身分', status: 'verified' as Status },
    { year: '2024.11',  text: '鐵支路：茁・空・光｜橋仔頭糖廠藝術村，展期 11.09–01.05', status: 'verified' as Status },
    { year: '2025.06',  text: '解謎橋仔頭—小店仔的前世今生', status: 'verified' as Status },
    { year: '2025.07',  text: '來去橋仔頭—環境教育與藝術生活；提出青聚點 Dream Idea 績優點子計畫書', status: 'verified' as Status },
    { year: '2025.08',  text: '來去橋仔頭—解謎社區盤撋（puânn-nuá）行動；委員訪視', status: 'verified' as Status },
    { year: '2025.09',  text: '「看見青春」共創成果展；橋頭咧咧相 2025 秋季場（9/27）', status: 'verified' as Status },
    { year: '2025.11',  text: '《橋仔頭咧咧相・好好生活》企劃提案 v1.0；初始｜2025 橋仔頭糖廠藝術村成果展', status: 'verified' as Status },
    { year: '2026.08',  text: '橋頭咧咧相 2026 秋季五場開始', status: 'verified' as Status },
  ],

  portrait: '/images/LINE_ALBUM_2021.9.26_260819_2.jpg',
  portraitWide: '/images/LINE_ALBUM_2021.9.26_260819_3.jpg',
}
