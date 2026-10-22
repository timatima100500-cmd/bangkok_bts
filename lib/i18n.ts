export type Lang = "en" | "th";

export const translations = {
  en: {
    appTitle: "BTS Fare Calculator",
    from: "From",
    to: "To",
    calculate: "Calculate Fare",
    swap: "Swap stations",
    selectStation: "Select station…",
    searchStation: "Search station…",
    noResults: "No stations found",
    errorSelectBoth: "Select both origin and destination",
    errorSame: "Origin and destination are the same station",
    errorNoRoute: "No route found between these stations",
    fare: "Fare",
    travelTime: "Time",
    minutes: "min",
    stops: "stops",
    transfers: "transfers",
    transfer: "transfer",
    lineSukhumvit: "Sukhumvit Line",
    lineSilom: "Silom Line",
    lineGold: "Gold Line",
    estimate: "Approximate fare — 2025/26 rates, extension part estimated",
  },
  th: {
    appTitle: "คิดค่าโดยสาร รถไฟฟ้า BTS",
    from: "ต้นทาง",
    to: "ปลายทาง",
    calculate: "คำนวณค่าโดยสาร",
    swap: "สลับสถานี",
    selectStation: "เลือกสถานี…",
    searchStation: "ค้นหาสถานี…",
    noResults: "ไม่พบสถานี",
    errorSelectBoth: "กรุณาเลือกสถานีต้นทางและปลายทาง",
    errorSame: "ต้นทางและปลายทางเป็นสถานีเดียวกัน",
    errorNoRoute: "ไม่พบเส้นทางระหว่างสถานี",
    fare: "ค่าโดยสาร",
    travelTime: "เวลาเดินทาง",
    minutes: "นาที",
    stops: "สถานี",
    transfers: "เปลี่ยนสาย",
    transfer: "เปลี่ยนสาย",
    lineSukhumvit: "สายสุขุมวิท",
    lineSilom: "สายสีลม",
    lineGold: "สายสีทอง",
    estimate: "ค่าโดยสารโดยประมาณ — อัตรา 2568/69 ส่วนต่อขยายประมาณการ",
  },
} as const;

export type TKey = keyof typeof translations.en;

export const LINE_LABEL_KEYS = {
  sukhumvit: "lineSukhumvit",
  silom: "lineSilom",
  gold: "lineGold",
} as const satisfies Record<"sukhumvit" | "silom" | "gold", TKey>;
