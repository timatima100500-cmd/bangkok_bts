import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const output = path.resolve("out");
const readHtml = (pathname) => readFileSync(path.join(output, pathname, "index.html"), "utf8");

test("every sitemap URL has exported, indexable HTML and a matching canonical", () => {
  const xml = readFileSync(path.join(output, "sitemap.xml"), "utf8");
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.ok(urls.length >= 250, `Expected at least 250 URLs; got ${urls.length}`);
  assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URLs");
  for (const url of urls) {
    const html = readHtml(new URL(url).pathname);
    assert.match(html, /<meta name="robots" content="index, follow"\s*\/>/, url);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"\s*\/>/)?.[1];
    assert.equal(canonical, url, `Canonical for ${url}`);
  }
});

test("home titles are not duplicated; error pages and technical examples stay noindex", () => {
  assert.equal(readHtml("/").match(/<title>(.*?)<\/title>/)?.[1], "Bangkok Metro Guide");
  assert.equal(readHtml("/ru/").match(/<title>(.*?)<\/title>/)?.[1], "Метро Бангкока");
  for (const pathname of ["/404/", "/ru/404/", "/airport/_template/", "/ru/airport/_template/", "/guides/_template/", "/ru/guides/_template/", "/get-to/_template/", "/ru/get-to/_template/"]) {
    const robots = readHtml(pathname).match(/<meta name="robots" content="([^"]+)"\s*\/>/)?.[1];
    assert.match(robots ?? "", /(?:^|,\s*)noindex(?:,|$)/, pathname);
  }
});
