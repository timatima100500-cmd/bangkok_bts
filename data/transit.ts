export type OperatorType = "bts" | "mrt" | "airport-rail" | "commuter-rail";
export type OperatorId = "bts" | "bem" | "arl" | "srt-red";
export type MetroLineId = "sukhumvit" | "silom" | "gold" | "mrt-blue" | "airport-rail-link" | "red-dark";
export type FareSystem = "bts-green" | "bts-gold" | "mrt-bem" | "arl" | "srt-red";

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
  { id: "airport-rail-link", nameEn: "Airport Rail Link", nameRu: "Аэропортовая линия ARL", color: "#A52938", operator: "arl", operatorType: "airport-rail", fareSystem: "arl", dataStatus: "scaffold", referenceUrl: "https://www.eeco.or.th/en/high-speed-rail-linking-three-airports/" },
  { id: "red-dark", nameEn: "SRT Dark Red", nameRu: "Тёмно-красная линия SRT", color: "#A12532", operator: "srt-red", operatorType: "commuter-rail", fareSystem: "srt-red", dataStatus: "scaffold", referenceUrl: "https://www.srtet.co.th/" },
];
