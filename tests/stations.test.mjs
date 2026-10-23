import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

// Resolve the application's TypeScript alias in Node's native test runner.
registerHooks({
  resolve(specifier, context, nextResolve) {
    const target = specifier.startsWith("@/")
      ? new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href
      : specifier;
    return nextResolve(target, context);
  },
});

const { STATIONS_BY_LINE, LINE_COLORS } = await import("../data/stations.ts");
const { getStationGroups } = await import("../lib/stationOptions.ts");
const { calculateFare } = await import("../lib/calculateFare.ts");
const { getStationTips } = await import("../lib/stationTips.ts");
const { getStationByCode } = await import("../data/stations.ts");
const { METRO_LINES } = await import("../data/transit.ts");
const { ADDITIONAL_STATIONS, METRO_STATIONS, getMetroStationByCode } = await import("../data/metroStations.ts");
const { sumFareLegs } = await import("../lib/fareModel.ts");
const fares = await import("../data/fares.ts");
const { getFareTable, getAllFareTables, getAllFareSources } = await import("../lib/fareTables.ts");
const { sitePath, pageMetadata } = await import("../lib/site.ts");
const { default: sitemap } = await import("../app/sitemap.ts");
const { translations } = await import("../lib/i18n.ts");

const silomCodes = ["W1", "CEN", ...Array.from({ length: 12 }, (_, i) => `S${i + 1}`)];

test("Silom has every station in travel order with names and line colour", () => {
  assert.deepEqual(STATIONS_BY_LINE.silom.map((station) => station.code), silomCodes);
  for (const station of STATIONS_BY_LINE.silom) {
    for (const field of ["nameEn", "nameTh", "nameZh", "nameRu"]) {
      assert.ok(station[field], `${station.code}: ${field}`);
    }
    assert.equal(station.color, LINE_COLORS.silom);
  }
});

test("selector exposes all six lines and every W/S station", () => {
  const groups = getStationGroups("");
  assert.deepEqual(groups.map((group) => group.line), ["sukhumvit", "silom", "gold", "mrt-blue", "airport-rail-link", "red-dark"]);
  assert.deepEqual(groups[1].stations.map((station) => station.code), silomCodes.filter((code) => code !== "CEN"));
  assert.deepEqual(groups[2].stations.map((station) => station.code), ["G1", "G2", "G3"]);
  assert.equal(groups.flatMap((group) => group.stations).filter((station) => station.code === "CEN").length, 1);
  for (const line of ["sukhumvit", "silom", "gold"]) {
    assert.deepEqual(getStationGroups("", line).map((group) => group.line), [line]);
  }
});

test("Silom stations can be searched by code and all four names", () => {
  for (const query of [" W1 ", "national stadium", "สนามกีฬาแห่งชาติ", "国家体育场", "Национальный стадион"]) {
    assert.deepEqual(getStationGroups(query).flatMap((group) => group.stations).map((station) => station.code), ["W1"]);
  }
  assert.equal(getStationGroups("not-a-station").length, 0);
  assert.equal(getStationGroups("W1", "gold").length, 0);
});

test("routes from Silom to Sukhumvit transfer at Siam in both directions", () => {
  const options = getStationGroups("").flatMap((group) => group.stations);
  for (const [fromCode, toCode, stops, fare] of [["W1", "E6", 7, 43], ["S6", "E4", 10, 47]]) {
    const from = options.find((station) => station.code === fromCode);
    const to = options.find((station) => station.code === toCode);
    for (const [origin, destination] of [[from, to], [to, from]]) {
      const result = calculateFare(origin, destination);
      assert.equal(result.stops, stops);
      assert.equal(result.fare, fare);
      assert.equal(result.transfers, 1);
      assert.deepEqual(result.path.filter((station) => station.code === "CEN").map((station) => station.line), [origin.line, destination.line]);
    }
  }
});

test("Gold Line remains connected through Krung Thon Buri", () => {
  const options = getStationGroups("").flatMap((group) => group.stations);
  const result = calculateFare(options.find((station) => station.code === "G2"), options.find((station) => station.code === "E4"));
  assert.deepEqual(result.lines, ["gold", "silom", "sukhumvit"]);
  assert.equal(result.transfers, 2);
  assert.ok(result.path.some((station, i) => station.code === "G1" && result.path[i + 1]?.code === "S7"));
});

test("station tips prefer the destination and include at most two real points", () => {
  const from = getStationByCode("W1");
  const to = getStationByCode("E4");
  assert.deepEqual(getStationTips(from, to).map(({ station, attraction }) => [station.code, attraction.id]), [
    ["E4", "terminal_21"], ["W1", "mbk_center"],
  ]);
  assert.equal(getStationTips(to, from)[0].attraction.id, "mbk_center");
  assert.deepEqual(getStationTips(getStationByCode("S6"), getStationByCode("E6")).map(({ attraction }) => attraction.id), ["wat_pho", "grand_palace"]);
});

test("tips do not invent places or repeat highlights for a shared station", () => {
  assert.deepEqual(getStationTips(getStationByCode("E6"), getStationByCode("E13")), []);
  const tips = getStationTips(getStationByCode("CEN", "silom"), getStationByCode("CEN", "sukhumvit"));
  assert.deepEqual(tips.map(({ attraction }) => attraction.id), ["siam_paragon"]);
});

test("new networks have sourced stations and mark unavailable coordinates", () => {
  const counts = { "mrt-blue": 38, "airport-rail-link": 8, "red-dark": 8 };
  for (const id of ["mrt-blue", "airport-rail-link", "red-dark"]) {
    const line = METRO_LINES.find((candidate) => candidate.id === id);
    assert.equal(line.dataStatus, "sourced");
    assert.ok(line.operator && line.operatorType && line.fareSystem);
    assert.ok(line.referenceUrl && line.referenceAccessed);
    assert.equal(ADDITIONAL_STATIONS[id].length, counts[id]);
    for (const station of ADDITIONAL_STATIONS[id]) {
      assert.ok(station.code && station.nameEn && station.nameRu && station.nameTh);
      assert.equal(station.coordinateStatus, "missing");
      assert.equal(station.lat, undefined);
      assert.equal(station.lng, undefined);
    }
  }
  assert.deepEqual(METRO_LINES.map((line) => line.id), ["sukhumvit", "silom", "gold", "mrt-blue", "airport-rail-link", "red-dark"]);
  for (const station of METRO_STATIONS) {
    assert.ok(station.code && station.nameEn && station.nameRu && station.operator && station.operatorType && station.fareSystem);
    assert.ok(["unverified", "missing"].includes(station.coordinateStatus));
  }
});

test("all tariff values carry provenance and honest dates", () => {
  const values = [
    ...Object.values(fares.FARE_MATRIX).flatMap((row) => Object.values(row)),
    ...Object.values(fares.CORE_FARE_BY_STATIONS), ...Object.values(fares.EXT_FARE_BY_STATIONS),
    fares.CORE_FARE_MAX, fares.EXT_FARE_MAX, fares.COMBINED_FARE_MAX, fares.GOLD_LINE_FARE, fares.ZERO_FARE,
  ];
  for (const value of values) {
    assert.equal(value.currency, "THB");
    assert.ok(value.source.id && value.source.title);
    assert.match(value.recordedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(value.effectiveFrom === null || /^\d{4}-\d{2}-\d{2}$/.test(value.effectiveFrom));
    assert.notEqual(value.accuracy, "verified");
    assert.equal(value.verifiedAt, null);
  }
});

test("BTS fare version is selected by effective date", () => {
  const table = getFareTable("bts", "2026-12-31");
  assert.equal(table.effectiveFrom, "2025-11-01");
  assert.equal(table.approximate, true);
  assert.deepEqual(table.sources, fares.FARE_NOTES.sources);
  assert.equal(table.CORE_FARE_BY_STATIONS[1].amount, fares.CORE_FARE_BY_STATIONS[1].amount);
  assert.equal(getFareTable("bts", "2025-11-01"), table);
  assert.throws(() => getFareTable("bts", "2025-10-31"), /No bts fare table for 2025-10-31; earliest is 2025-11-01/);
  assert.throws(() => getFareTable("bts", "2026-02-30"), /Invalid fare date/);
});

test("source listing is derived from registered fare tables", () => {
  assert.deepEqual(getAllFareTables().map((table) => table.effectiveFrom), ["2025-11-01", "2026-07-03", "2026-10-23", "2026-10-22"]);
  for (const source of fares.FARE_NOTES.sources) assert.ok(getAllFareSources().some((candidate) => candidate.id === source.id));
  for (const id of ["bem-blue-2026-fares", "srt-arl-fare-chart", "srtet-red-fares-2026-10-22"]) assert.ok(getAllFareSources().some((source) => source.id === id && source.url));
});

test("legacy Green BTS prices remain, with honest approximate labels", () => {
  const result = calculateFare(getStationByCode("E6"), getStationByCode("E13"));
  assert.equal(result.fare, 47);
  assert.equal(result.exact, false);
  assert.equal(result.pricing.approximate, true);
  const historical = calculateFare(getStationByCode("E1"), getStationByCode("E2"));
  assert.equal(historical.fare, 17);
  assert.equal(historical.exact, false);
  assert.equal(historical.pricing.legs[0].values[0].accuracy, "historical");
});

test("Gold and Green tickets are added separately, without a global cap", () => {
  for (const [origin, destination, expected] of [["G2", "E4", 63], ["E4", "G2", 63], ["G3", "N24", 81]]) {
    const result = calculateFare(getStationByCode(origin), getStationByCode(destination));
    assert.equal(result.fare, expected);
    assert.equal(result.pricing.legs.length, 2);
    assert.equal(result.fare, result.pricing.legs.reduce((sum, leg) => sum + leg.amount, 0));
    assert.deepEqual(new Set(result.pricing.legs.map((leg) => leg.fareSystem)), new Set(["bts-green", "bts-gold"]));
  }
});

test("cross-operator totals add known tickets and retain unknown fares", () => {
  const known = { operator: "bts", fareSystem: "bts-green", fromCode: "E1", toCode: "E2", amount: 17, values: [fares.CORE_FARE_BY_STATIONS[1]] };
  const other = { ...known, operator: "bem", fareSystem: "mrt-bem", fromCode: "TEST1", toCode: "TEST2", amount: 17 };
  assert.equal(sumFareLegs([known, other]).amount, 34);
  const incomplete = sumFareLegs([known, { ...other, amount: null, values: [] }]);
  assert.equal(incomplete.amount, null);
  assert.equal(incomplete.complete, false);
  assert.equal(sumFareLegs([]).amount, null);
  assert.throws(() => sumFareLegs([{ ...known, amount: -1 }]));
  assert.throws(() => sumFareLegs([{ ...known, values: [] }]));
  assert.throws(() => sumFareLegs([{ ...known, values: [{ ...known.values[0], accuracy: "verified", verifiedAt: null }] }]));
});

test("cross-network transfers and separately priced journeys", () => {
  const asok = calculateFare(getStationByCode("E4"), getMetroStationByCode("BL22"));
  assert.equal(asok.stops, 0);
  assert.equal(asok.transfers, 1);
  assert.equal(asok.fare, null);

  const airport = calculateFare(getMetroStationByCode("A1"), getStationByCode("CEN"));
  assert.deepEqual(airport.pricing.legs.map((leg) => leg.fareSystem), ["arl", "bts-green"]);
  assert.equal(airport.fare, airport.pricing.legs.reduce((sum, leg) => sum + leg.amount, 0));
  assert.equal(airport.pricing.approximate, true);

  const red = calculateFare(getMetroStationByCode("RN08"), getStationByCode("CEN"));
  assert.ok(red.path.some((station) => station.code === "RN01"));
  assert.ok(red.path.some((station) => station.code === "BL11"));
  assert.deepEqual(red.pricing.legs.map((leg) => leg.fareSystem), ["srt-red", "mrt-bem", "bts-green"]);
  assert.equal(red.pricing.legs[0].amount, 33);
  assert.equal(red.fare, red.pricing.legs.reduce((sum, leg) => sum + leg.amount, 0));
});

test("Blue Line graph passes through Tha Phra between BL33 and BL34", () => {
  const route = calculateFare(getMetroStationByCode("BL33"), getMetroStationByCode("BL34"));
  assert.deepEqual(route.path.map((station) => station.code), ["BL33", "BL01", "BL34"]);
  assert.equal(route.stops, 2);
  assert.equal(route.pricing.legs[0].fareSystem, "mrt-bem");
});

test("declared transfer nodes connect the requested networks", () => {
  for (const [btsCode, otherCode] of [["E4", "BL22"], ["S2", "BL26"], ["N8", "BL13"], ["N2", "A8"], ["S12", "BL34"]]) {
    const route = calculateFare(getStationByCode(btsCode), getMetroStationByCode(otherCode));
    assert.equal(route.stops, 0, `${btsCode} → ${otherCode}`);
    assert.equal(route.transfers, 1, `${btsCode} → ${otherCode}`);
  }
  for (const [fromCode, toCode] of [["A6", "BL21"], ["BL11", "RN01"]]) {
    const route = calculateFare(getMetroStationByCode(fromCode), getMetroStationByCode(toCode));
    assert.equal(route.stops, 0, `${fromCode} → ${toCode}`);
    assert.equal(route.transfers, 1, `${fromCode} → ${toCode}`);
  }
  assert.deepEqual(calculateFare(getMetroStationByCode("BL10"), getMetroStationByCode("RN01")).path.map((station) => station.code), ["BL10", "BL11", "RN01"]);
});

test("new fare versions keep official provenance and approximate models separate", () => {
  const mrt = getFareTable("bem", "2026-12-31");
  const arl = getFareTable("arl", "2026-12-31");
  const red = getFareTable("srt-red", "2026-12-31");
  assert.equal(mrt.approximate, true);
  assert.equal(mrt.fareForStops(1).amount, 17);
  assert.equal(mrt.fareForStops(12).amount, 44);
  assert.equal(mrt.fareForStops(4).accuracy, "approximate");
  assert.equal(mrt.fareForStops(4).source.kind, "model");
  assert.equal(arl.approximate, true);
  assert.equal(arl.fareForStops(7).amount, 45);
  assert.equal(arl.fareForStops(7).source.kind, "model");
  assert.equal(red.approximate, false);
  assert.equal(red.fareForPair("RN01", "RN08").amount, 33);
  assert.equal(red.fareForPair("RN08", "RN01").accuracy, "verified");
  assert.equal(red.fareForPair("RN08", "RN01").effectiveFrom, null);
  for (const table of [mrt, arl, red]) assert.ok(table.sources[0].url);
});

test("content URLs provide equivalent EN/RU paths", () => {
  assert.equal(sitePath("en", "/stations/W1"), "/stations/W1");
  assert.equal(sitePath("ru", "/stations/W1"), "/ru/stations/W1");
  assert.equal(sitePath("ru"), "/ru");
  assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.ru).sort());
  assert.equal(pageMetadata("ru", "/stations/W1", "test", "test", true).robots.index, false);
});

test("sitemap contains only indexable pages", () => {
  const listed = sitemap().map(({ url }) => url);
  assert.ok(listed.includes("https://btsguide.com/"));
  assert.ok(listed.includes("https://btsguide.com/ru/"));
  for (const [lang, path] of [["en", "/about"], ["ru", "/sources"], ["en", "/fares"], ["ru", "/fares"], ["en", "/stations/W1"], ["ru", "/guides/terminal-21"]]) {
    const metadata = pageMetadata(lang, path, "Draft", "Draft", true);
    assert.equal(metadata.robots.index, false);
    assert.ok(!listed.includes(metadata.alternates.canonical));
  }
});
