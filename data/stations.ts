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

export const STATIONS: Station[] = [
  // Sukhumvit Line (north → east)
  station("N8", "Mo Chit", "หมอชิต", "sukhumvit"),
  station("N7", "Saphan Kwai", "สะพานควาย", "sukhumvit"),
  station("N6", "Ari", "อารีย์", "sukhumvit"),
  station("N5", "Sanam Pao", "สนามเป้า", "sukhumvit"),
  station("N4", "Victory Monument", "อนุสาวรีย์ชัยฯ", "sukhumvit"),
  station("N2", "Phaya Thai", "พญาไท", "sukhumvit"),
  station("N1", "Ratchathewi", "ราชเทวี", "sukhumvit"),
  station("CEN", "Siam", "สยาม", "sukhumvit"), // interchange with Silom Line
  station("E1", "Chit Lom", "ชิดลม", "sukhumvit"),
  station("E2", "Phloen Chit", "เพลินจิต", "sukhumvit"),
  station("E3", "Nana", "นานา", "sukhumvit"),
  station("E4", "Asok", "อโศก", "sukhumvit"),
  station("E5", "Phrom Phong", "พร้อมพงษ์", "sukhumvit"),
  station("E6", "Thong Lo", "ทองหล่อ", "sukhumvit"),
  station("E7", "Ekkamai", "เอกมัย", "sukhumvit"),
  station("E8", "Phra Khanong", "พระโขนง", "sukhumvit"),
  station("E9", "On Nut", "อ่อนนุช", "sukhumvit"),
  station("E11", "Bang Chak", "บางจาก", "sukhumvit"),
  station("E13", "Punnawithi", "ปุณณวิถี", "sukhumvit"),
  station("E15", "Udom Suk", "อุดมสุข", "sukhumvit"),
  station("E17", "Bang Na", "บางนา", "sukhumvit"),
  station("E19", "Bearing", "เบริ่ง", "sukhumvit"),
  station("E21", "Samrong", "สำโรง", "sukhumvit"),

  // Silom Line (west → south)
  station("W1", "National Stadium", "สนามกีฬาแห่งชาติ", "silom"),
  station("S1", "Sala Daeng", "ศาลาแดง", "silom"),
  station("S2", "Chong Nonsi", "ช่องนนทรี", "silom"),
  station("S3", "Saint Louis", "เซนต์หลุยส์", "silom"),
  station("S4", "Surasak", "สุรศักดิ์", "silom"),
  station("S5", "Saphan Taksin", "สะพานตากสิน", "silom"),
  station("S6", "Krung Thonburi", "กรุงธนบุรี", "silom"),
  station("S7", "Talat Phlu", "ตลาดพลู", "silom"),
  station("S8", "Wutthakat", "วุฒากาศ", "silom"),
  station("S9", "Bang Wa", "บางหว้า", "silom"),

  // Gold Line
  station("G1", "Khlong San", "คลองสาน", "gold"),
  station("G2", "Charoen Nakhon", "เจริญนคร", "gold"),
  station("G3", "Pho Nimit", "โพธิ์นิมิตร", "gold"),
];

export function getStationById(id: string): Station | undefined {
  return STATIONS.find((s) => s.id === id);
}
