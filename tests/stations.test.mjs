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
const { ADDITIONAL_STATIONS, METRO_STATIONS } = await import("../data/metroStations.ts");
const { sumFareLegs } = await import("../lib/fareModel.ts");
const fares = await import("../data/fares.ts");
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

test("selector exposes all three lines and every W/S station", () => {
  const groups = getStationGroups("");
  assert.deepEqual(groups.map((group) => group.line), ["sukhumvit", "silom", "gold"]);
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

test("every new network has a scaffold, without fabricated routing stations", () => {
  for (const id of ["mrt-blue", "airport-rail-link", "red-dark"]) {
    const line = METRO_LINES.find((candidate) => candidate.id === id);
    assert.equal(line.dataStatus, "scaffold");
    assert.ok(line.operator && line.operatorType && line.fareSystem);
    assert.deepEqual(ADDITIONAL_STATIONS[id], []);
  }
  assert.deepEqual(METRO_LINES.map((line) => line.id), ["sukhumvit", "silom", "gold", "mrt-blue", "airport-rail-link", "red-dark"]);
  for (const station of METRO_STATIONS) {
    assert.ok(station.code && station.nameEn && station.nameRu && station.operator && station.operatorType && station.fareSystem);
    assert.equal(station.coordinateStatus, "unverified");
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

test("content URLs provide equivalent EN/RU paths", () => {
  assert.equal(sitePath("en", "/stations/W1"), "/stations/W1");
  assert.equal(sitePath("ru", "/stations/W1"), "/ru/stations/W1");
  assert.equal(sitePath("ru"), "/ru");
  assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.ru).sort());
  assert.equal(pageMetadata("ru", "/stations/W1", "test", "test", true).robots.index, false);
});

test("sitemap contains only indexable pages", () => {
  const listed = sitemap().map(({ url }) => url);
  assert.deepEqual(listed, ["https://btsguide.com/", "https://btsguide.com/ru/"]);
  for (const [lang, path] of [["en", "/about"], ["ru", "/sources"], ["en", "/stations/W1"], ["ru", "/guides/terminal-21"]]) {
    const metadata = pageMetadata(lang, path, "Draft", "Draft", true);
    assert.equal(metadata.robots.index, false);
    assert.ok(!listed.includes(metadata.alternates.canonical));
  }
});
