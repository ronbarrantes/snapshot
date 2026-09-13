function escapeYaml(value) {
  return String(value ?? "").replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("\n", " ");
}

function createMarkdownSnapshot({ title, url, capturedAt, text }) {
  const body = String(text || "").replace(/\n{3,}/g, "\n\n").trim();
  return `---\ntitle: "${escapeYaml(title)}"\nurl: "${escapeYaml(url)}"\ncaptured_at: "${capturedAt}"\n---\n\n# ${title || "Untitled page"}\n\n${body}\n`;
}

if (typeof module !== "undefined") {
  module.exports = { createMarkdownSnapshot };
}
