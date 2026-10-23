import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    const target = specifier.startsWith("@/")
      ? new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href
      : specifier;
    return nextResolve(target, context);
  },
});

const { STATIONS } = await import("../data/stations.ts");
const { calculateFare } = await import("../lib/calculateFare.ts");

test("all ordered BTS journeys retain their fare", () => {
  const unique = [...new Map(STATIONS.map((station) => [station.code, station])).values()];
  const fares = [];
  for (const from of unique) for (const to of unique) {
    if (from.code !== to.code) fares.push(`${from.code}:${to.code}:${calculateFare(from, to).fare}`);
  }
  assert.equal(fares.length, 3906);
  assert.equal(createHash("sha256").update(fares.join("|"), "utf8").digest("hex"), "622f49ce6010441bfec1b8e03a43e962173d5f9c214b3d1d92cd279dc577ab33");
});
