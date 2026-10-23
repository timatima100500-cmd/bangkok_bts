export type OperatorType = "bts" | "mrt" | "monorail" | "airport-rail" | "commuter-rail";
export type OperatorId = "bts" | "bem" | "ebm" | "nbm" | "arl" | "srt-red";
export type MetroLineId = "sukhumvit" | "silom" | "gold" | "mrt-blue" | "mrt-purple" | "mrt-yellow" | "mrt-pink" | "airport-rail-link" | "red-dark" | "red-light";
export type FareSystem = "bts-green" | "bts-gold" | "mrt-bem" | "mrt-yellow" | "mrt-pink" | "arl" | "srt-red";

export interface MetroStation {
  id: string;
  code: string;
  nameEn: string;
  nameRu: string;
  line: MetroLineId;
  operator: OperatorId;
  operatorType: OperatorType;
  fareSystem: FareSystem;
  lat?: number;
  lng?: number;
  coordinateStatus: "unverified" | "verified" | "missing";
  color: string;
}

export interface MetroLine {
  id: MetroLineId;
  nameEn: string;
  nameRu: string;
  color: string;
  operator: OperatorId;
  operatorType: OperatorType;
  fareSystem: FareSystem;
  /** Scaffold describes our dataset, not whether the railway is operational. */
  dataStatus: "bts-legacy" | "scaffold";
  referenceUrl: string;
}

export const METRO_LINES: MetroLine[] = [
  { id: "sukhumvit", nameEn: "BTS Sukhumvit", nameRu: "BTS Сукхумвит", color: "#45B26B", operator: "bts", operatorType: "bts", fareSystem: "bts-green", dataStatus: "bts-legacy", referenceUrl: "https://www.bts.co.th/eng/" },
  { id: "silom", nameEn: "BTS Silom", nameRu: "BTS Силом", color: "#0E9F6E", operator: "bts", operatorType: "bts", fareSystem: "bts-green", dataStatus: "bts-legacy", referenceUrl: "https://www.bts.co.th/eng/" },
  { id: "gold", nameEn: "BTS Gold", nameRu: "Золотая линия", color: "#C9A227", operator: "bts", operatorType: "bts", fareSystem: "bts-gold", dataStatus: "bts-legacy", referenceUrl: "https://www.bts.co.th/eng/info/GoldLine-info-history.html" },
  { id: "mrt-blue", nameEn: "MRT Blue", nameRu: "Синяя линия MRT", color: "#2358B5", operator: "bem", operatorType: "mrt", fareSystem: "mrt-bem", dataStatus: "scaffold", referenceUrl: "https://metro.bemplc.co.th/" },
  { id: "mrt-purple", nameEn: "MRT Purple", nameRu: "Фиолетовая линия MRT", color: "#823C97", operator: "bem", operatorType: "mrt", fareSystem: "mrt-bem", dataStatus: "scaffold", referenceUrl: "https://metro.bemplc.co.th/" },
  { id: "mrt-yellow", nameEn: "MRT Yellow", nameRu: "Жёлтая линия MRT", color: "#BD9100", operator: "ebm", operatorType: "monorail", fareSystem: "mrt-yellow", dataStatus: "scaffold", referenceUrl: "https://www.ebm.co.th/" },
  { id: "mrt-pink", nameEn: "MRT Pink", nameRu: "Розовая линия MRT", color: "#C54783", operator: "nbm", operatorType: "monorail", fareSystem: "mrt-pink", dataStatus: "scaffold", referenceUrl: "https://www.nbm.co.th/" },
  { id: "airport-rail-link", nameEn: "Airport Rail Link", nameRu: "Аэропортовая линия ARL", color: "#A52938", operator: "arl", operatorType: "airport-rail", fareSystem: "arl", dataStatus: "scaffold", referenceUrl: "https://www.eeco.or.th/en/high-speed-rail-linking-three-airports/" },
  { id: "red-dark", nameEn: "SRT Dark Red", nameRu: "Тёмно-красная линия SRT", color: "#A12532", operator: "srt-red", operatorType: "commuter-rail", fareSystem: "srt-red", dataStatus: "scaffold", referenceUrl: "https://www.srtet.co.th/" },
  { id: "red-light", nameEn: "SRT Light Red", nameRu: "Светло-красная линия SRT", color: "#CF5460", operator: "srt-red", operatorType: "commuter-rail", fareSystem: "srt-red", dataStatus: "scaffold", referenceUrl: "https://www.srtet.co.th/" },
];
