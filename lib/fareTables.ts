import * as bts2025 from "@/data/fares/bts/2025-11-01";
import type { OperatorId } from "@/data/transit";
import type { FareSource } from "@/lib/fareModel";

export type FareTable = typeof bts2025;

const TABLES: Partial<Record<OperatorId, readonly FareTable[]>> = {
  bts: [bts2025],
};

function calendarDate(date: Date | string): string {
  if (date instanceof Date) {
    if (Number.isNaN(date.getTime())) throw new RangeError("Invalid fare date");
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
    throw new RangeError(`Invalid fare date: ${date}; expected YYYY-MM-DD`);
  }
  return date;
}

/** Select the latest registered table already in effect on the requested day. */
export function getFareTable(operator: OperatorId, date: Date | string): FareTable {
  const day = calendarDate(date);
  const tables = TABLES[operator];
  if (!tables?.length) throw new RangeError(`No fare tables registered for ${operator}`);
  const selected = tables
    .filter((table) => table.effectiveFrom <= day)
    .sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0];
  if (!selected) throw new RangeError(`No ${operator} fare table for ${day}; earliest is ${tables.map((table) => table.effectiveFrom).sort()[0]}`);
  return selected;
}

export function getAllFareTables(): FareTable[] {
  return Object.values(TABLES).flat();
}

/** Collect source records from every registered version, without duplicate entries. */
export function getAllFareSources(): FareSource[] {
  const sources = getAllFareTables().flatMap((table) => table.sources);
  return [...new Map(sources.map((source) => [`${source.id}|${source.url ?? ""}|${source.document ?? ""}`, source])).values()];
}
