import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

registerHooks({
  resolve(specifier, context, nextResolve) {
    const target = specifier.startsWith("@/")
      ? new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href
      : specifier;
    return nextResolve(target, context);
  },
});

const { parseContent, getAllContent, getIndexableContent, getContentParams } = await import("../lib/contentLoader.ts");
const { default: sitemap } = await import("../app/sitemap.ts");
const { default: AffiliateDisclosure } = await import("../components/AffiliateDisclosure.ts");
const { affiliateHref, affiliates, AFFILIATE_ID_PENDING } = await import("../lib/affiliates.ts");

const valid = `---
title: "Draft"
description: "Draft description"
slug: "draft"
lang: en
verified: false
verified_on: null
sources: []
affiliates: []
noindex: false
---
Draft text.`;

test("frontmatter is validated and errors name the file", () => {
  const entry = parseContent(valid, "content/en/airport/draft.md", "en", "airport");
  assert.equal(entry.noindex, true);
  assert.match(entry.html, /Draft text/);
  for (const [raw, field] of [
    [valid.replace("description: \"Draft description\"", "description: \"\""), "description"],
    [valid.replace("lang: en", "lang: ru"), "lang"],
    [valid.replace("sources: []", "sources: [{url: nope, title: Bad, accessed: 2026-10-23}]"), "sources"],
    [valid.replace("affiliates: []", "affiliates: [unknown]"), "affiliates"],
    [valid.replace("verified: false", "verified: maybe"), "verified"],
  ]) assert.throws(() => parseContent(raw, "content/en/airport/draft.md", "en", "airport"), new RegExp(`draft\\.md:.*${field}`));
  const sourced = parseContent(valid.replace("sources: []", "sources: [{url: https://example.com, title: Example, accessed: 2026-10-23}]"), "content/en/airport/draft.md", "en", "airport");
  assert.equal(sourced.sources[0].accessed, "2026-10-23");
  assert.throws(() => parseContent(valid.replace("Draft text.", "<script>alert(1)</script>"), "content/en/airport/draft.md", "en", "airport"), /draft\.md:.*raw HTML/);
});

test("owner-approved content keeps technical examples out of sitemap", () => {
  const example = getAllContent().find((entry) => entry.slug === "_example");
  assert.ok(example);
  assert.equal(example.verified, true);
  assert.equal(example.noindex, false);
  assert.ok(getAllContent().every((entry) => entry.verified && !entry.noindex && entry.verified_on));
  assert.ok(!getIndexableContent().some((entry) => entry.slug.startsWith("_")));
  assert.ok(getContentParams("en", "airport").some((entry) => entry.slug === "_template"));
  assert.ok(!sitemap().some((entry) => entry.url.includes("_example")));
});

test("affiliate disclosure renders only when a partner is listed", () => {
  assert.equal(renderToStaticMarkup(createElement(AffiliateDisclosure, { lang: "en", affiliates: [] })), "");
  assert.match(renderToStaticMarkup(createElement(AffiliateDisclosure, { lang: "ru", affiliates: ["klook"] })), /партнёрские ссылки/);
});

test("pending affiliate links preserve ordinary URLs", () => {
  const url = "https://www.klook.com/activity/example";
  assert.deepEqual(Object.keys(affiliates), ["klook", "12go", "airalo", "agoda", "travelpayouts"]);
  assert.ok(Object.values(affiliates).every((partner) => partner.id === AFFILIATE_ID_PENDING));
  assert.equal(affiliateHref("klook", url), url);
});
