export type BTSLine = "sukhumvit" | "silom" | "gold";

export interface Station {
  id: string;
  code: string;
  nameEn: string;
  nameTh: string;
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
): Station => ({
  id: code.toLowerCase(),
  code,
  nameEn,
  nameTh,
  line,
  color: LINE_COLORS[line],
});

/**
 * BTS Skytrain — Green Line (Sukhumvit + Silom) and Gold Line.
 * Codes follow the official BTS scheme; stations listed in travel order.
 * Note: N6 is reserved (Sena Ruam, not built) — BTS skips the code.
 */
export const STATIONS: Station[] = [
  // Sukhumvit Line (north: Khu Khot → Siam)
  station("N24", "Khu Khot", "คูคต", "sukhumvit"),
  station("N23", "Yaek Kor Por Aor", "แยก คปอ.", "sukhumvit"),
  station("N22", "Royal Thai Air Force Museum", "พิพิธภัณฑ์กองทัพอากาศ", "sukhumvit"),
  station("N21", "Bhumibol Adulyadej Hospital", "โรงพยาบาลภูมิพลอดุลยเดช", "sukhumvit"),
  station("N20", "Saphan Mai", "สะพานใหม่", "sukhumvit"),
  station("N19", "Sai Yud", "สายหยุด", "sukhumvit"),
  station("N18", "Phahon Yothin 59", "พหลโยธิน 59", "sukhumvit"),
  station("N17", "Wat Phra Sri Mahathat", "วัดพระศรีมหาธาตุ", "sukhumvit"),
  station("N16", "11th Infantry Regiment", "กรมทหารราบที่ 11", "sukhumvit"),
  station("N15", "Bang Bua", "บางบัว", "sukhumvit"),
  station("N14", "Royal Forest Department", "กรมป่าไม้", "sukhumvit"),
  station("N13", "Kasetsart University", "มหาวิทยาลัยเกษตรศาสตร์", "sukhumvit"),
  station("N12", "Sena Nikhom", "เสนานิคม", "sukhumvit"),
  station("N11", "Ratchayothin", "รัชโยธิน", "sukhumvit"),
  station("N10", "Phahon Yothin 24", "พหลโยธิน 24", "sukhumvit"),
  station("N9", "Ha Yaek Lat Phrao", "ห้าแยกลาดพร้าว", "sukhumvit"),
  station("N8", "Mo Chit", "หมอชิต", "sukhumvit"),
  station("N7", "Saphan Kwai", "สะพานควาย", "sukhumvit"),
  // N6 — reserved (Sena Ruam), not built
  station("N5", "Ari", "อารีย์", "sukhumvit"),
  station("N4", "Sanam Pao", "สนามเป้า", "sukhumvit"),
  station("N3", "Victory Monument", "อนุสาวรีย์ชัยสมรภูมิ", "sukhumvit"),
  station("N2", "Phaya Thai", "พญาไท", "sukhumvit"),
  station("N1", "Ratchathewi", "ราชเทวี", "sukhumvit"),
  station("CEN", "Siam", "สยาม", "sukhumvit"), // interchange with Silom Line

  // Sukhumvit Line (east: Siam → Kheha Samut Prakan)
  station("E1", "Chit Lom", "ชิดลม", "sukhumvit"),
  station("E2", "Phloen Chit", "เพลินจิต", "sukhumvit"),
  station("E3", "Nana", "นานา", "sukhumvit"),
  station("E4", "Asok", "อโศก", "sukhumvit"),
  station("E5", "Phrom Phong", "พร้อมพงษ์", "sukhumvit"),
  station("E6", "Thong Lo", "ทองหล่อ", "sukhumvit"),
  station("E7", "Ekkamai", "เอกมัย", "sukhumvit"),
  station("E8", "Phra Khanong", "พระโขนง", "sukhumvit"),
  station("E9", "On Nut", "อ่อนนุช", "sukhumvit"),
  station("E10", "Bang Chak", "บางจาก", "sukhumvit"),
  station("E11", "Punnawithi", "ปุณณวิถี", "sukhumvit"),
  station("E12", "Udom Suk", "อุดมสุข", "sukhumvit"),
  station("E13", "Bang Na", "บางนา", "sukhumvit"),
  station("E14", "Bearing", "แบริ่ง", "sukhumvit"),
  station("E15", "Samrong", "สำโรง", "sukhumvit"),
  station("E16", "Pu Chao Saming Phrai", "ปู่เจ้าสมิงพราย", "sukhumvit"),
  station("E17", "Chang Erawan", "ช้างเอราวัณ", "sukhumvit"),
  station("E18", "Royal Thai Naval Academy", "โรงเรียนนายเรือ", "sukhumvit"),
  station("E19", "Pak Nam", "ปากน้ำ", "sukhumvit"),
  station("E20", "Srinagarindra", "ศรีนครินทร์", "sukhumvit"),
  station("E21", "Phraek Sa", "แพรกษา", "sukhumvit"),
  station("E22", "Sai Luat", "สายลวด", "sukhumvit"),
  station("E23", "Kheha Samut Prakan", "เคหะฯ", "sukhumvit"),

  // Silom Line (west → south: National Stadium → Bang Wa)
  station("W1", "National Stadium", "สนามกีฬาแห่งชาติ", "silom"),
  station("CEN", "Siam", "สยาม", "silom"), // interchange with Sukhumvit Line
  station("S1", "Ratchadamri", "ราชดำริ", "silom"),
  station("S2", "Sala Daeng", "ศาลาแดง", "silom"),
  station("S3", "Chong Nonsi", "ช่องนนทรี", "silom"),
  station("S4", "Saint Louis", "เซนต์หลุยส์", "silom"),
  station("S5", "Surasak", "สุรศักดิ์", "silom"),
  station("S6", "Saphan Taksin", "สะพานตากสิน", "silom"),
  station("S7", "Krung Thon Buri", "กรุงธนบุรี", "silom"),
  station("S8", "Wongwian Yai", "วงเวียนใหญ่", "silom"),
  station("S9", "Pho Nimit", "โพธิ์นิมิตร", "silom"),
  station("S10", "Talat Phlu", "ตลาดพลู", "silom"),
  station("S11", "Wutthakat", "วุฒากาศ", "silom"),
  station("S12", "Bang Wa", "บางหว้า", "silom"),

  // Gold Line (Krung Thon Buri → Khlong San)
  station("G1", "Krung Thon Buri", "กรุงธนบุรี", "gold"), // interchange with Silom Line
  station("G2", "Charoen Nakhon", "เจริญนคร", "gold"),
  station("G3", "Khlong San", "คลองสาน", "gold"),
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
