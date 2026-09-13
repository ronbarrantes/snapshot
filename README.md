# Snapshot

A Chrome Manifest V3 extension that captures the visible text of the current web page and downloads it as Markdown.

## Features

- Captures visible `body.innerText`, including comments and content already loaded by scrolling.
- Adds title, URL, and capture time as Markdown front matter.
- Uses a generated snapshot ID by default for unique filenames.
- Optional date and time filename components.
- Saves to a configurable subfolder inside Chrome's Downloads directory.
- Works on macOS and Linux wherever Chrome extensions are supported.

## Install locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this repository directory.
5. Open the extension's settings and choose a Downloads subfolder.

## Development

The extension has no build step. After changing files, use **Reload** on its card in `chrome://extensions`.

Run the utility test suite with:

```sh
node --test
```
