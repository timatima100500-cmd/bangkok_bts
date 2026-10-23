import type { MetroStation } from "@/data/transit";

export type BTSLine = "sukhumvit" | "silom" | "gold";

export interface Station extends MetroStation {
  id: string;
  code: string;
  nameEn: string;
  nameTh: string;
  nameZh: string;
  nameRu: string;
  /** Legacy coordinates are approximate and need verification before navigation use. */
  lat: number;
  lng: number;
  line: BTSLine;
  color: string;
}

export const LINE_COLORS: Record<BTSLine, string> = {
  sukhumvit: "#45B26B",
  silom: "#0E9F6E",
  gold: "#C9A227",
};

export const LINE_NAMES: Record<BTSLine, string> = {
  sukhumvit: "Sukhumvit Line",
  silom: "Silom Line",
  gold: "Gold Line",
};

const station = (
  code: string,
  nameEn: string,
  nameTh: string,
  line: BTSLine,
  nameZh: string,
  nameRu: string,
  lat: number,
  lng: number,
): Station => ({
  id: code.toLowerCase(),
  code,
  nameEn,
  nameTh,
  nameZh,
  nameRu,
  lat,
  lng,
  line,
  color: LINE_COLORS[line],
  operator: "bts",
  operatorType: "bts",
  fareSystem: line === "gold" ? "bts-gold" : "bts-green",
  coordinateStatus: "unverified",
});

/**
 * BTS Skytrain — Green Line (Sukhumvit + Silom) and Gold Line.
 * Coordinates and zh/ru names imported from reference/old-src/src/data/stations.ts.
 * Legacy coordinates are unverified (some extensions use interpolated positions).
 * Gold Line coordinates: https://www.mapofthailand.com/transit/bts/G1 (also G2, G3).
 * Gold Line translations added locally.
 * Codes follow the official BTS scheme; stations listed in travel order.
 * Note: N6 is reserved (Sena Ruam, not built) — BTS skips the code.
 */
export const STATIONS: Station[] = [
  // Sukhumvit Line (north: Khu Khot → Siam)
  station("N24", "Khu Khot", "คูคต", "sukhumvit", "库科特", "Ку Кот", 14.210833, 100.645278),
  station("N23", "Yaek Kor Por Aor", "แยก คปอ.", "sukhumvit", "军警分岔口", "Яек Кор Пор Аор", 14.201389, 100.634722),
  station("N22", "Royal Thai Air Force Museum", "พิพิธภัณฑ์กองทัพอากาศ", "sukhumvit", "皇家空军博物馆", "Музей ВВС Таиланда", 14.192778, 100.624167),
  station("N21", "Bhumibol Adulyadej Hospital", "โรงพยาบาลภูมิพลอดุลยเดช", "sukhumvit", "普密蓬·阿杜德医院", "Больница Пумипона Адульядета", 14.184167, 100.613611),
  station("N20", "Saphan Mai", "สะพานใหม่", "sukhumvit", "新桥", "Сапан Май", 14.175556, 100.603056),
  station("N19", "Sai Yud", "สายหยุด", "sukhumvit", "塞尤德", "Сай Юд", 14.166944, 100.592500),
  station("N18", "Phahon Yothin 59", "พหลโยธิน 59", "sukhumvit", "帕霍约廷59", "Пахон Йотин 59", 14.158333, 100.581944),
  station("N17", "Wat Phra Sri Mahathat", "วัดพระศรีมหาธาตุ", "sukhumvit", "帕史玛哈泰寺", "Ват Пра Си Махатат", 14.149722, 100.571389),
  station("N16", "11th Infantry Regiment", "กรมทหารราบที่ 11", "sukhumvit", "第11步兵团", "11-й пехотный полк", 14.141111, 100.560833),
  station("N15", "Bang Bua", "บางบัว", "sukhumvit", "邦布瓦", "Банг Буа", 14.132500, 100.550278),
  station("N14", "Royal Forest Department", "กรมป่าไม้", "sukhumvit", "皇家林业部", "Королевский лесной департамент", 14.123889, 100.539722),
  station("N13", "Kasetsart University", "มหาวิทยาลัยเกษตรศาสตร์", "sukhumvit", "农业大学", "Университет Касетсарт", 14.115278, 100.529167),
  station("N12", "Sena Nikhom", "เสนานิคม", "sukhumvit", "塞纳尼空", "Сена Никхом", 14.106667, 100.518611),
  station("N11", "Ratchayothin", "รัชโยธิน", "sukhumvit", "叻差约廷", "Ратчайотин", 14.098056, 100.508056),
  station("N10", "Phahon Yothin 24", "พหลโยธิน 24", "sukhumvit", "帕霍约廷24", "Пахон Йотин 24", 14.089444, 100.497500),
  station("N9", "Ha Yaek Lat Phrao", "ห้าแยกลาดพร้าว", "sukhumvit", "拉差达五岔路", "Ха Яек Лат Прао", 14.080833, 100.486944),
  station("N8", "Mo Chit", "หมอชิต", "sukhumvit", "墨吉", "Мо Чит", 13.802778, 100.553611),
  station("N7", "Saphan Kwai", "สะพานควาย", "sukhumvit", "水牛桥", "Сапан Квай", 13.797222, 100.548056),
  // N6 — reserved (Sena Ruam), not built
  station("N5", "Ari", "อารีย์", "sukhumvit", "阿里", "Ари", 13.779444, 100.537222),
  station("N4", "Sanam Pao", "สนามเป้า", "sukhumvit", "萨南炮", "Санам Пао", 13.766111, 100.534167),
  station("N3", "Victory Monument", "อนุสาวรีย์ชัยสมรภูมิ", "sukhumvit", "胜利纪念碑", "Монумент Победы", 13.762778, 100.537778),
  station("N2", "Phaya Thai", "พญาไท", "sukhumvit", "帕亚泰", "Пая Тай", 13.756944, 100.534722),
  station("N1", "Ratchathewi", "ราชเทวี", "sukhumvit", "拉差贴威", "Ратчатеви", 13.751667, 100.531944),
  station("CEN", "Siam", "สยาม", "sukhumvit", "暹罗", "Сиам", 13.745556, 100.534167), // interchange with Silom Line

  // Sukhumvit Line (east: Siam → Kheha Samut Prakan)
  station("E1", "Chit Lom", "ชิดลม", "sukhumvit", "奇隆", "Чит Лом", 13.744167, 100.546111),
  station("E2", "Phloen Chit", "เพลินจิต", "sukhumvit", "奔集", "Плен Чит", 13.742500, 100.549722),
  station("E3", "Nana", "นานา", "sukhumvit", "娜娜", "Нана", 13.740833, 100.553333),
  station("E4", "Asok", "อโศก", "sukhumvit", "阿索克", "Асок", 13.739167, 100.556944),
  station("E5", "Phrom Phong", "พร้อมพงษ์", "sukhumvit", "澎蓬", "Пром Понг", 13.737500, 100.560556),
  station("E6", "Thong Lo", "ทองหล่อ", "sukhumvit", "通罗", "Тонг Ло", 13.735833, 100.564167),
  station("E7", "Ekkamai", "เอกมัย", "sukhumvit", "伊卡迈", "Эккамай", 13.734167, 100.567778),
  station("E8", "Phra Khanong", "พระโขนง", "sukhumvit", "拍空", "Пра Канонг", 13.732500, 100.571389),
  station("E9", "On Nut", "อ่อนนุช", "sukhumvit", "翁努", "Он Нут", 13.705278, 100.599444),
  station("E10", "Bang Chak", "บางจาก", "sukhumvit", "邦扎克", "Банг Чак", 13.695556, 100.603056),
  station("E11", "Punnawithi", "ปุณณวิถี", "sukhumvit", "蓬纳维提", "Пуннавити", 13.685833, 100.606667),
  station("E12", "Udom Suk", "อุดมสุข", "sukhumvit", "乌董素", "Удом Сук", 13.676111, 100.610278),
  station("E13", "Bang Na", "บางนา", "sukhumvit", "邦纳", "Банг На", 13.666389, 100.613889),
  station("E14", "Bearing", "แบริ่ง", "sukhumvit", "贝林", "Бэринг", 13.656667, 100.617500),
  station("E15", "Samrong", "สำโรง", "sukhumvit", "三荣", "Самронг", 13.646944, 100.621111),
  station("E16", "Pu Chao Saming Phrai", "ปู่เจ้าสมิงพราย", "sukhumvit", "祖父", "Пу Чао", 13.637222, 100.624722),
  station("E17", "Chang Erawan", "ช้างเอราวัณ", "sukhumvit", "象神", "Чанг Эраван", 13.627500, 100.628333),
  station("E18", "Royal Thai Naval Academy", "โรงเรียนนายเรือ", "sukhumvit", "皇家海军学院", "Военно-морская академия", 13.617778, 100.631944),
  station("E19", "Pak Nam", "ปากน้ำ", "sukhumvit", "河口", "Пак Нам", 13.608056, 100.635556),
  station("E20", "Srinagarindra", "ศรีนครินทร์", "sukhumvit", "诗纳卡琳", "Сринагариндра", 13.598333, 100.639167),
  station("E21", "Phraek Sa", "แพรกษา", "sukhumvit", "帕雷萨", "Прэк Са", 13.588611, 100.642778),
  station("E22", "Sai Luat", "สายลวด", "sukhumvit", "塞鲁阿", "Сай Луат", 13.578889, 100.646389),
  station("E23", "Kheha Samut Prakan", "เคหะฯ", "sukhumvit", "克哈", "Кеха", 13.569167, 100.650000),

  // Silom Line (west → south: National Stadium → Bang Wa)
  station("W1", "National Stadium", "สนามกีฬาแห่งชาติ", "silom", "国家体育场", "Национальный стадион", 13.746389, 100.529167),
  station("CEN", "Siam", "สยาม", "silom", "暹罗", "Сиам", 13.745556, 100.534167), // interchange with Sukhumvit Line
  station("S1", "Ratchadamri", "ราชดำริ", "silom", "拉差丹利", "Ратчадамри", 13.738056, 100.543056),
  station("S2", "Sala Daeng", "ศาลาแดง", "silom", "萨拉当", "Сала Дэнг", 13.728611, 100.534444),
  station("S3", "Chong Nonsi", "ช่องนนทรี", "silom", "颂南茜", "Чонг Нонси", 13.719167, 100.525833),
  station("S4", "Saint Louis", "เซนต์หลุยส์", "silom", "圣路易", "Сент-Луис", 13.709722, 100.517222),
  station("S5", "Surasak", "สุรศักดิ์", "silom", "素拉萨", "Сурасак", 13.700278, 100.508611),
  station("S6", "Saphan Taksin", "สะพานตากสิน", "silom", "郑王桥", "Сапан Таксин", 13.690833, 100.500000),
  station("S7", "Krung Thon Buri", "กรุงธนบุรี", "silom", "吞武里", "Крунг Тон Бури", 13.681389, 100.491389),
  station("S8", "Wongwian Yai", "วงเวียนใหญ่", "silom", "大转盘", "Вонгвиан Яй", 13.671944, 100.482778),
  station("S9", "Pho Nimit", "โพธิ์นิมิตร", "silom", "菩提尼米", "По Нимит", 13.662500, 100.474167),
  station("S10", "Talat Phlu", "ตลาดพลู", "silom", "达拉普鲁市场", "Талат Плу", 13.653056, 100.465556),
  station("S11", "Wutthakat", "วุฒากาศ", "silom", "武塔卡", "Вуттакат", 13.643611, 100.456944),
  station("S12", "Bang Wa", "บางหว้า", "silom", "邦华", "Банг Ва", 13.634167, 100.448333),

  // Gold Line (Krung Thon Buri → Khlong San)
  station("G1", "Krung Thon Buri", "กรุงธนบุรี", "gold", "吞武里", "Крунг Тон Бури", 13.7202, 100.5022), // interchange with Silom Line
  station("G2", "Charoen Nakhon", "เจริญนคร", "gold", "乍伦那空", "Чароен Накхон", 13.7265, 100.5098),
  station("G3", "Khlong San", "คลองสาน", "gold", "空讪", "Кхлонг Сан", 13.7302, 100.5055),
];

export const STATIONS_BY_LINE: Record<BTSLine, Station[]> = {
  sukhumvit: STATIONS.filter((s) => s.line === "sukhumvit"),
  silom: STATIONS.filter((s) => s.line === "silom"),
  gold: STATIONS.filter((s) => s.line === "gold"),
};

export function getStationById(id: string): Station | undefined {
  return STATIONS.find((s) => s.id === id);
}

export function getStationByCode(code: string, line?: BTSLine): Station | undefined {
  return STATIONS.find((s) => s.code === code && (!line || s.line === line));
}
