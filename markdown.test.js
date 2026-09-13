const test = require("node:test");
const assert = require("node:assert/strict");
const { createMarkdownSnapshot } = require("./markdown.js");

test("creates markdown front matter and visible text body", () => {
  const output = createMarkdownSnapshot({
    title: "A Page",
    url: "https://example.test/page?a=1",
    capturedAt: "2026-09-13T14:35:22.000Z",
    text: "First paragraph\n\nSecond paragraph"
  });
  assert.match(output, /title: "A Page"/);
  assert.match(output, /url: "https:\/\/example.test\/page\?a=1"/);
  assert.match(output, /# A Page/);
  assert.match(output, /Second paragraph/);
});
