const DEFAULT_SETTINGS = {
  prefix: "repo",
  subfolder: "RepoSnapshot",
  includeId: true,
  includeDate: false,
  includeTime: false
};

if (typeof module !== "undefined") {
  module.exports = { DEFAULT_SETTINGS };
}
