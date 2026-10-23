import type { FareSystem, OperatorId } from "@/data/transit";

export interface FareSource {
  id: string;
  title: string;
  kind: "official" | "archive" | "model";
  url?: string;
  document?: string;
}

export interface FareValue {
  amount: number;
  currency: "THB";
  accuracy: "verified" | "historical" | "approximate";
  source: FareSource;
  effectiveFrom: string | null;
  /** Date recorded in this dataset; never implies official verification. */
  recordedAt: string;
  verifiedAt: string | null;
}

export interface FareLeg {
  operator: OperatorId;
  fareSystem: FareSystem;
  fromCode: string;
  toCode: string;
  amount: number | null;
  values: FareValue[];
}

export interface JourneyFare {
  amount: number | null;
  currency: "THB";
  approximate: boolean;
  complete: boolean;
  legs: FareLeg[];
}

/** Sum separately ticketed legs. An unknown fare must never become a free ride. */
export function sumFareLegs(legs: FareLeg[]): JourneyFare {
  for (const leg of legs) {
    if (leg.amount !== null && (!Number.isFinite(leg.amount) || leg.amount < 0 || !leg.values.length)) {
      throw new Error("A priced leg needs a nonnegative amount and sourced fare values");
    }
    for (const value of leg.values) {
      if (!Number.isFinite(value.amount) || value.amount < 0 || !value.source.id || !value.source.title || !/^\d{4}-\d{2}-\d{2}$/.test(value.recordedAt)) {
        throw new Error("Fare values need provenance, a recorded date and a nonnegative amount");
      }
      if (value.accuracy === "verified" && (!value.verifiedAt || value.source.kind !== "official")) {
        throw new Error("A verified fare requires an official source and verification date");
      }
    }
  }
  const complete = legs.length > 0 && legs.every((leg) => leg.amount !== null);
  return {
    amount: complete ? legs.reduce((sum, leg) => sum + leg.amount!, 0) : null,
    currency: "THB",
    approximate: !complete || legs.some((leg) => leg.values.some((value) => value.accuracy !== "verified")),
    complete,
    legs,
  };
}
