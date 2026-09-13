const captureButton = document.querySelector("#captureButton");
const settingsButton = document.querySelector("#settingsButton");
const destination = document.querySelector("#destination");
const status = document.querySelector("#status");

async function loadSettings() {
  const settings = { ...DEFAULT_SETTINGS, ...(await chrome.storage.local.get(DEFAULT_SETTINGS)) };
  destination.textContent = settings.subfolder
    ? `Downloads/${settings.subfolder}`
    : "Not configured";
  captureButton.disabled = !settings.subfolder;
  return settings;
}

function setStatus(message, kind = "") {
  status.textContent = message;
  status.className = `status ${kind}`;
}

function collectVisiblePage() {
  const body = document.body;
  if (!body) throw new Error("This page has no readable document body.");
  return {
    title: document.title || "Untitled page",
    url: location.href,
    text: body.innerText || ""
  };
}

async function capture() {
  const settings = await loadSettings();
  if (!settings.subfolder) {
    setStatus("Choose a Downloads subfolder in Settings.", "error");
    return;
  }

  captureButton.disabled = true;
  setStatus("Reading visible page text…");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("Could not find the active tab.");
    const [result] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: collectVisiblePage });
    const page = result?.result;
    if (!page?.text?.trim()) throw new Error("No visible text was found on this page.");

    const now = new Date();
    const markdown = createMarkdownSnapshot({
      ...page,
      capturedAt: now.toISOString(),
      text: page.text
    });
    const filename = buildFilename(settings, page.title, now);
    const url = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
    await chrome.downloads.download({
      url,
      filename: `${settings.subfolder}/${filename}`,
      conflictAction: "uniquify",
      saveAs: false
    });
    setStatus(`Saved ${filename}`, "success");
  } catch (error) {
    setStatus(error.message || "Capture failed.", "error");
  } finally {
    captureButton.disabled = false;
  }
}

settingsButton.addEventListener("click", () => chrome.runtime.openOptionsPage());
captureButton.addEventListener("click", capture);
loadSettings().catch(() => setStatus("Could not load settings.", "error"));
