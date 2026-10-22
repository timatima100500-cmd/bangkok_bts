export type AttractionType = "Market" | "Shopping" | "Temple" | "Historical" | "Park";

export interface Attraction {
  id: string;
  name: Record<"en" | "th" | "zh" | "ru", string>;
  type: AttractionType;
  /** Approximate distance in km, copied from the legacy project; unverified. */
  distance: number;
  /** BTS station code (uppercase), rather than the lowercase Station.id. */
  stationId: string;
}

/** Imported legacy POIs; distances and station associations need review before navigation use. */

export const attractions: Attraction[] = [
  {
    id: 'chatuchak_market',
    name: {
      en: 'Chatuchak Weekend Market',
      th: 'ตลาดนัดจตุจักร',
      zh: '恰图恰周末市场',
      ru: 'Рынок выходного дня Чатучак'
    },
    type: 'Market',
    distance: 0.2,
    stationId: 'N8' // Mo Chit
  },
  {
    id: 'central_world',
    name: {
      en: 'CentralWorld Shopping Center',
      th: 'ศูนย์การค้าเซ็นทรัลเวิลด์',
      zh: '中央世界购物中心',
      ru: 'Торговый центр ЦентрМир'
    },
    type: 'Shopping',
    distance: 0.1,
    stationId: 'E1' // Chit Lom
  },
  {
    id: 'siam_paragon',
    name: {
      en: 'Siam Paragon',
      th: 'สยามพารากอน',
      zh: '暹罗百丽宫',
      ru: 'Сиам Парагон'
    },
    type: 'Shopping',
    distance: 0.05,
    stationId: 'CEN' // Siam
  },
  {
    id: 'mbk_center',
    name: {
      en: 'MBK Center',
      th: 'เอ็มบีเค เซ็นเตอร์',
      zh: 'MBK购物中心',
      ru: 'МБК Центр'
    },
    type: 'Shopping',
    distance: 0.15,
    stationId: 'W1' // National Stadium
  },
  {
    id: 'wat_pho',
    name: {
      en: 'Wat Pho Temple',
      th: 'วัดโพธิ์',
      zh: '卧佛寺',
      ru: 'Храм Ват По'
    },
    type: 'Temple',
    distance: 1.2,
    stationId: 'S6' // Saphan Taksin
  },
  {
    id: 'grand_palace',
    name: {
      en: 'Grand Palace',
      th: 'พระบรมมหาราชวัง',
      zh: '大皇宫',
      ru: 'Большой королевский дворец'
    },
    type: 'Historical',
    distance: 1.5,
    stationId: 'S6' // Saphan Taksin
  },
  {
    id: 'terminal_21',
    name: {
      en: 'Terminal 21 Shopping Mall',
      th: 'เทอร์มินอล 21',
      zh: '21号航站楼购物中心',
      ru: 'Торговый центр Терминал 21'
    },
    type: 'Shopping',
    distance: 0.1,
    stationId: 'E4' // Asok
  },
  {
    id: 'emporium',
    name: {
      en: 'Emporium Shopping Complex',
      th: 'เอ็มโพเรียม',
      zh: 'Emporium购物中心',
      ru: 'Торговый комплекс Эмпориум'
    },
    type: 'Shopping',
    distance: 0.2,
    stationId: 'E5' // Phrom Phong
  },
  {
    id: 'lumpini_park',
    name: {
      en: 'Lumpini Park',
      th: 'สวนลุมพินี',
      zh: '伦披尼公园',
      ru: 'Парк Люмпини'
    },
    type: 'Park',
    distance: 0.8,
    stationId: 'S2' // Sala Daeng
  },
  {
    id: 'icon_siam',
    name: {
      en: 'ICONSIAM',
      th: 'ไอคอนสยาม',
      zh: 'ICONSIAM购物中心',
      ru: 'АЙКОНСИАМ'
    },
    type: 'Shopping',
    distance: 0.5,
    stationId: 'S7' // Krung Thon Buri
  }
];

// Helper function to get attractions by station ID
export const getAttractionsByStationId = (stationId: string): Attraction[] => {
  return attractions.filter(attraction => attraction.stationId === stationId.toUpperCase());
};