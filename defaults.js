const DEFAULT_SETTINGS = {
  prefix: "snapshot",
  subfolder: "Snapshot",
  includeId: true,
  includeDate: false,
  includeTime: false
};

if (typeof module !== "undefined") {
  module.exports = { DEFAULT_SETTINGS };
}
