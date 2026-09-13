const form = document.querySelector("#settingsForm");
const status = document.querySelector("#status");
const discardButtons = [
  document.querySelector("#discardButton"),
  document.querySelector("#resetButton"),
].filter(Boolean);

function setStatus(message, kind = "") {
  status.textContent = message;
  status.className = `status ${kind}`;
}

function getField(name) {
  return form.elements.namedItem(name);
}

function normalizeSettings(settings) {
  return {
    prefix: String(settings.prefix || "").trim(),
    subfolder: String(settings.subfolder || "").trim(),
    includeId: Boolean(settings.includeId),
    includeDate: Boolean(settings.includeDate),
    includeTime: Boolean(settings.includeTime),
  };
}

function isValidSubfolder(value) {
  if (!value || value.startsWith("/") || value.startsWith("\\")) return false;
  return !value.split(/[\\/]+/).some((part) => part === ".." || part === ".");
}

function renderSettings(settings) {
  const normalized = normalizeSettings(settings);
  getField("prefix").value = normalized.prefix;
  getField("subfolder").value = normalized.subfolder;
  getField("includeId").checked = normalized.includeId;
  getField("includeDate").checked = normalized.includeDate;
  getField("includeTime").checked = normalized.includeTime;
}

async function loadSettings() {
  const stored = await chrome.storage.local.get(DEFAULT_SETTINGS);
  renderSettings({ ...DEFAULT_SETTINGS, ...stored });
}

function readSettings() {
  return normalizeSettings({
    prefix: getField("prefix").value,
    subfolder: getField("subfolder").value,
    includeId: getField("includeId").checked,
    includeDate: getField("includeDate").checked,
    includeTime: getField("includeTime").checked,
  });
}

async function saveSettings(event) {
  event.preventDefault();
  const settings = readSettings();

  if (!isValidSubfolder(settings.subfolder)) {
    setStatus("Choose a valid Downloads subfolder.", "error");
    getField("subfolder").focus();
    return;
  }

  await chrome.storage.local.set(settings);
  renderSettings(settings);
  setStatus("Settings saved.", "success");
}

async function discardChanges() {
  await loadSettings();
  setStatus("Changes discarded.");
}

form.addEventListener("submit", saveSettings);
discardButtons.forEach((button) => button.addEventListener("click", discardChanges));
loadSettings().catch(() => setStatus("Could not load settings.", "error"));

if (typeof module !== "undefined") {
  module.exports = { isValidSubfolder, normalizeSettings };
}
