const INVALID_FILENAME_CHARS = /[\\/:*?"<>|\u0000-\u001f]/g;

function sanitizeFilenamePart(value, fallback = "snapshot") {
  const cleaned = String(value || "")
    .replace(INVALID_FILENAME_CHARS, "-")
    .replace(/-+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. -]+$/g, "");
  return cleaned || fallback;
}

function createSnapshotId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

function buildFilename(settings, title, now = new Date(), id = createSnapshotId()) {
  const parts = [];
  const prefix = sanitizeFilenamePart(settings.prefix, "snapshot");
  parts.push(prefix, sanitizeFilenamePart(title, "untitled-page"));

  if (settings.includeDate) {
    parts.push(now.toISOString().slice(0, 10));
  }
  if (settings.includeTime) {
    parts.push(now.toTimeString().slice(0, 8).replaceAll(":", "-"));
  }
  if (settings.includeId !== false) {
    parts.push(`snap-${id}`);
  }

  return `${parts.join("-")}.md`;
}

if (typeof module !== "undefined") {
  module.exports = { sanitizeFilenamePart, buildFilename };
}
