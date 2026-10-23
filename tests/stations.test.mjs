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
