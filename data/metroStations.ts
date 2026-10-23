import { STATIONS } from "@/data/stations";
import { METRO_LINES, type MetroLineId, type MetroStation } from "@/data/transit";

type StationRow = readonly [code: string, nameEn: string, nameRu: string, nameTh: string];

// BEM Blue Line map and timetable, accessed 2026-10-23:
// https://metro.bemplc.co.th/Line-Maps?Line=1&lang=en
// https://metro.bemplc.co.th/fare-calculation/Search?q=2026
const MRT_BLUE: StationRow[] = [
  ["BL01", "Tha Phra", "Тха Пхра", "ท่าพระ"],
  ["BL02", "Charan 13", "Чаран 13", "จรัญฯ 13"],
  ["BL03", "Fai Chai", "Фай Чай", "ไฟฉาย"],
  ["BL04", "Bang Khun Non", "Банг Кхун Нон", "บางขุนนนท์"],
  ["BL05", "Bang Yi Khan", "Банг Йи Кхан", "บางยี่ขัน"],
  ["BL06", "Sirindhorn", "Сиринтхон", "สิรินธร"],
  ["BL07", "Bang Phlat", "Банг Пхлат", "บางพลัด"],
  ["BL08", "Bang O", "Банг О", "บางอ้อ"],
  ["BL09", "Bang Pho", "Банг Пхо", "บางโพ"],
  ["BL10", "Tao Poon", "Тао Пун", "เตาปูน"],
  ["BL11", "Bang Sue", "Банг Сы", "บางซื่อ"],
  ["BL12", "Kamphaeng Phet", "Кампхэнг Пхет", "กำแพงเพชร"],
  ["BL13", "Chatuchak Park", "Парк Чатучак", "สวนจตุจักร"],
  ["BL14", "Phahon Yothin", "Пхахон Йотхин", "พหลโยธิน"],
  ["BL15", "Lat Phrao", "Лат Пхрао", "ลาดพร้าว"],
  ["BL16", "Ratchadaphisek", "Ратчадапхисек", "รัชดาภิเษก"],
  ["BL17", "Sutthisan", "Суттхисан", "สุทธิสาร"],
  ["BL18", "Huai Khwang", "Хуай Кхванг", "ห้วยขวาง"],
  ["BL19", "Thailand Cultural Centre", "Культурный центр Таиланда", "ศูนย์วัฒนธรรมแห่งประเทศไทย"],
  ["BL20", "Phra Ram 9", "Пхра Рам 9", "พระราม 9"],
  ["BL21", "Phetchaburi", "Пхетчабури", "เพชรบุรี"],
  ["BL22", "Sukhumvit", "Сукхумвит", "สุขุมวิท"],
  ["BL23", "Queen Sirikit National Convention Centre", "Национальный конференц-центр королевы Сирикит", "ศูนย์การประชุมแห่งชาติสิริกิติ์"],
  ["BL24", "Khlong Toei", "Кхлонг Тоэй", "คลองเตย"],
  ["BL25", "Lumphini", "Лумпхини", "ลุมพินี"],
  ["BL26", "Si Lom", "Си Лом", "สีลม"],
  ["BL27", "Sam Yan", "Сам Ян", "สามย่าน"],
  ["BL28", "Hua Lamphong", "Хуа Лампхонг", "หัวลำโพง"],
  ["BL29", "Wat Mangkon", "Ват Мангкон", "วัดมังกร"],
  ["BL30", "Sam Yot", "Сам Йот", "สามยอด"],
  ["BL31", "Sanam Chai", "Санам Чай", "สนามไชย"],
  ["BL32", "Itsaraphap", "Итсарапхап", "อิสรภาพ"],
  ["BL33", "Bang Phai", "Банг Пхай", "บางไผ่"],
  ["BL34", "Bang Wa", "Банг Ва", "บางหว้า"],
  ["BL35", "Phetkasem 48", "Пхеткасем 48", "เพชรเกษม 48"],
  ["BL36", "Phasi Charoen", "Пхаси Чароен", "ภาษีเจริญ"],
  ["BL37", "Bang Khae", "Банг Кхэ", "บางแค"],
  ["BL38", "Lak Song", "Лак Сонг", "หลักสอง"],
];

// Airports of Thailand route list, SRTET signage, and JICA-coded route map, accessed 2026-10-23:
// https://suvarnabhumi.airportthai.co.th/service/way-to-airport/detail/90
// https://www.srtet.co.th/upload_fm/procurement/ab207954c50abf8989d9f3075a40dbc8.pdf
// https://openjicareport.jica.go.jp/pdf/12386371.pdf
const AIRPORT_RAIL_LINK: StationRow[] = [
  ["A1", "Suvarnabhumi", "Суварнабхуми", "สุวรรณภูมิ"],
  ["A2", "Lat Krabang", "Лат Крабанг", "ลาดกระบัง"],
  ["A3", "Ban Thap Chang", "Бан Тхап Чанг", "บ้านทับช้าง"],
  ["A4", "Hua Mak", "Хуа Мак", "หัวหมาก"],
  ["A5", "Ramkhamhaeng", "Рамкхамхэнг", "รามคำแหง"],
  ["A6", "Makkasan", "Маккасан", "มักกะสัน"],
  ["A7", "Ratchaprarop", "Ратчапрароп", "ราชปรารภ"],
  ["A8", "Phaya Thai", "Пхая Тхай", "พญาไท"],
];

// SRTET station and fare list, accessed 2026-10-23. RN codes: JICA map:
// https://www.srtet.co.th/en/fare-information
// https://openjicareport.jica.go.jp/pdf/12386389.pdf
const RED_DARK: StationRow[] = [
  ["RN01", "Krung Thep Aphiwat", "Крунг Тхеп Апхиват", "กรุงเทพอภิวัฒน์"],
  ["RN02", "Chatuchak", "Чатучак", "จตุจักร"],
  ["RN03", "Wat Samian Nari", "Ват Самиан Нари", "วัดเสมียนนารี"],
  ["RN04", "Bang Khen", "Банг Кхен", "บางเขน"],
  ["RN05", "Thung Song Hong", "Тхунг Сонг Хонг", "ทุ่งสองห้อง"],
  ["RN06", "Lak Si", "Лак Си", "หลักสี่"],
  ["RN07", "Kan Kheha", "Кан Кхеха", "การเคหะ"],
  ["RN08", "Don Mueang", "Дон Мыанг", "ดอนเมือง"],
];

function buildStations(lineId: MetroLineId, rows: StationRow[]): MetroStation[] {
  const line = METRO_LINES.find((item) => item.id === lineId)!;
  return rows.map(([code, nameEn, nameRu, nameTh]) => ({
    id: code.toLowerCase(), code, nameEn, nameRu, nameTh,
    line: lineId, operator: line.operator, operatorType: line.operatorType,
    fareSystem: line.fareSystem, color: line.color,
    // TODO(verify): source station coordinates before using them for navigation.
    coordinateStatus: "missing",
  }));
}

export const ADDITIONAL_STATIONS: Record<Exclude<MetroLineId, "sukhumvit" | "silom" | "gold">, MetroStation[]> = {
  "mrt-blue": buildStations("mrt-blue", MRT_BLUE),
  "airport-rail-link": buildStations("airport-rail-link", AIRPORT_RAIL_LINK),
  "red-dark": buildStations("red-dark", RED_DARK),
};

export const METRO_STATIONS: MetroStation[] = [...STATIONS, ...Object.values(ADDITIONAL_STATIONS).flat()];
export const METRO_STATIONS_BY_LINE = Object.fromEntries(
  METRO_LINES.map((line) => [line.id, METRO_STATIONS.filter((station) => station.line === line.id)]),
) as Record<MetroLineId, MetroStation[]>;

export function getMetroStationByCode(code: string) {
  return METRO_STATIONS.find((station) => station.code === code.toUpperCase());
}
