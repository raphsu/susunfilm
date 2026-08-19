/**
 * COLLABORATION =「人的頁面」，不是作品的第二份清單。
 * 使用者 2026-08-19 同意：列一起做事的單位與人，每個一行字，連到對應的 project。
 * 全部來自已確認的來源；沒有出處的一律不列。
 */
export type Partner = { name: string; role: string; project?: string }
export type PartnerGroup = { zh: string; en: string; items: Partner[] }

export const collaborationIntro =
  '有些作品，是一個人完成的；有些故事，需要很多人一起留下來。'

export const collaborations: PartnerGroup[] = [
  {
    zh: '地方創作',
    en: 'LOCAL',
    items: [
      { name: '橋仔頭白屋', role: '咧咧相走讀的集合點、成果放映與展覽場域', project: 'lele-siong' },
      { name: '有田咖啡', role: '橋仔頭白屋內，每一場走讀的起點', project: 'lele-siong' },
      { name: '橋仔頭青聚點', role: 'Dream Idea 績優點子計畫，《家》的生活筆記由此開始', project: 'home-notes' },
    ],
  },
  {
    zh: '公共藝術',
    en: 'PUBLIC ART',
    items: [
      { name: '橋仔頭糖廠藝術村 KAT', role: '2023 共振、2024 鐵支路、2025 初始，連續三年的國際藝術進駐紀錄', project: 'art-life' },
      { name: 'Jakob Wldoarczyk', role: '《Davis’ Granary 戴維斯的穀倉》作品紀錄', project: 'art-life' },
      { name: 'Ariel Ruby', role: '《Feast for the Eyes, Food for the Gods 視覺的饗宴，神靈的食物》作品紀錄', project: 'art-life' },
      { name: '紀建廷', role: '《內部整修 Sometimes Love Just Ain’t Enough》作品紀錄', project: 'art-life' },
      { name: '孫佳暄', role: '《家族氣味的初始》作品紀錄', project: 'art-life' },
      { name: '賴新龍', role: '《出彩》個展紀錄', project: 'art-life' },
      { name: '張惠蘭', role: '《朦朧的慾望》創作展紀錄', project: 'art-life' },
      { name: '胡嘉豪 × 衛武營', role: '《與你相愛》首演高空表演紀錄', project: 'art-life' },
    ],
  },
  {
    zh: '影像製作',
    en: 'FILM',
    items: [
      { name: '衛武營國家藝術文化中心', role: '場館友善計劃 手語情境影片', project: 'cross-field' },
      { name: '美濃區公所', role: '一日美濃慢旅行、美濃色彩、花海成果紀錄、農林漁牧業普查宣導', project: 'cross-field' },
      { name: '雙流國家森林遊樂區', role: '森林小泰山', project: 'cross-field' },
      { name: '清景麟教育基金會', role: '出發~種樹去', project: 'cross-field' },
    ],
  },
  {
    zh: '教育｜工作坊',
    en: 'EDUCATION',
    items: [
      { name: '橋頭咧咧相 攝影走讀工作坊', role: '2025 秋季首辦，2026 秋季五場。三小時，練習停下來', project: 'lele-siong' },
      { name: '30 分鐘的城市探險術', role: '路上觀察學 × 沈浸式探索 × 動態明信片', project: 'lele-siong' },
    ],
  },
  {
    zh: '參與｜以參與者身分',
    en: 'AS PARTICIPANT',
    items: [
      {
        name: '大募集！海洋守護者',
        role: '113 年度臺南市海洋保育教育推廣計畫。海保署補助、臺南市觀旅局主辦、小屋家文創空間承辦。我們是去玩的，但相機還是帶了',
        project: 'cross-field',
      },
    ],
  },
]
