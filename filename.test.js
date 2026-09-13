const test = require("node:test");
const assert = require("node:assert/strict");
const { sanitizeFilenamePart, buildFilename } = require("./filename.js");

test("sanitizes unsafe filename characters", () => {
  assert.equal(sanitizeFilenamePart('a:/b*?"c<>|'), "a-b-c");
});

test("builds a unique default filename", () => {
  const filename = buildFilename({ prefix: "repo", includeId: true }, "My Page", new Date("2026-09-13T14:35:22Z"), "a1b2c3d4");
  assert.equal(filename, "repo-My Page-snap-a1b2c3d4.md");
});

test("supports optional date and time", () => {
  const filename = buildFilename({ prefix: "repo", includeId: false, includeDate: true, includeTime: true }, "My Page", new Date("2026-09-13T14:35:22Z"), "ignored");
  assert.equal(filename, "repo-My Page-2026-09-13-14-35-22.md");
});
