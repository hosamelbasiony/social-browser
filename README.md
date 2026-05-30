# 🚀 Social Browser

<div align="center">
  <img src="https://img.shields.io/badge/Version-26.04.26-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/License-Proprietary-red.svg" alt="License">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20Mac-orange.svg" alt="Platform">
</div>

<p align="center">
  <strong>Automation Virtual Web Browser with Multi-Login, Virtual PC, Multi-Proxies, Ads Blocker, and Browser Fingerprinting Protection</strong>
</p>

<p align="center">
  Share any site data without email or password. Chromium-based, portable.
</p>

---

## ⚠️ Disclaimer

This project is provided for educational and legitimate purposes only. Users are responsible for complying with all applicable laws, terms of service, and copyright regulations. Do not use this tool to violate website terms, engage in unauthorized scraping, botting, or any illegal activities. The developers are not responsible for misuse.

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [⚙️ Top Options](#️-top-options)
- [🔮 Coming Soon](#-coming-soon)
- [🔧 Patching Guide (Activation Bypass)](#-patching-guide-activation-bypass)
- [🧩 Custom Extensions](#-custom-extensions)
- [🧪 Testing Pages](#-testing-pages)
- [🏗️ Architecture Notes](#️-architecture-notes)
- [📦 Installation](#-installation)
- [⬇️ Download](#️-download)

---

## 🚀 Features

Social Browser is a powerful automation tool designed for secure and efficient web browsing. Key highlights include:

- 🌐 **Chromium-based**: Multi-tabs, multi-users, auto-fill data
- 📱 **Portable Version**: Run from USB or HDD without installation
- 🚫 **Ad-Blocker**: Blocks 100% of ads, trackers, malware, spyware
- 🛡️ **Popup & Redirect Blocker**: Self and external tab blockers
- 🔒 **Safety Mode**: Blocks adult content
- 🛠️ **Script Manager**: Supports Tampermonkey, Violentmonkey, Greasemonkey
- 🌍 **Cross-Platform**: Windows, Linux, Mac

---

## ⚙️ Top Options

Enhance your browsing experience with these advanced features:

- 👥 **Multi-Profile**: Custom user-agent, proxy settings, etc.
- 🖥️ **Virtual PC Generation**: Auto-generate virtual PCs for users
- 💾 **Data Import/Export**: Passwords, sessions, and more
- 🔗 **Google Chrome Integration**: Powered by Puppeteer
- 🧩 **Custom Extensions**: Full API access
- 🔐 **Password Protection**: Secure your settings
- 🔄 **Multi-User Site Access**: Open same site with different users
- 🔑 **Passwords Manager**: Secure password storage
- 📝 **Auto Fill Forms**: Effortless form completion
- ⌨️ **Keyboard Shortcuts**: Boost productivity
- ☁️ **Cloud Sync**: Sync across devices
- 📹 **Video Downloader**: Download videos where legally permitted
- 👀 **Mini Viewer**: Preview videos
- 🌐 **Text Translation**: Google Translate selected text
- 🔍 **Zoom & Sound Control**: Adjust page zoom and audio
- 📄 **PDF Export**: Save/print pages as PDF
- ✏️ **Page Edit Mode**: Edit web pages on the fly
- 📖 **PDF Reader**: Built-in PDF viewing
- 🌐 **Proxy Manager**: Multi-proxy with auto-detection
- 🤖 **User Agent Manager**: Multi-UA with auto-detection
- ⬇️ **Download Manager**: Internal/external downloads
- 📥 **IDM Integration**: Internet Download Manager support
- ⭐ **Bookmarks Manager**: Favorite sites
- 🔍 **Inspect Elements**: Developer tools
- 🛠️ **Developer Tools**: Full debugging suite
- 🔗 **Session Sharing**: Share cookies and storages
- 🚫 **System Program Control**: Run/block programs
- 🚫 **Resource Blocker**: Block JS, CSS, videos, APIs, etc.

---

## 🔮 Coming Soon

Exciting features on the horizon:

- 🔄 **Auto Updates**: For ads blocking, white sites, etc.
- 🔑 **External Login**: Google, Facebook, etc.
- 💻 **PC Browsing**: File manager, FTP
- 🖥️ **App Integration**: Keyboard, Calc, Paint, etc.
- ⚙️ **Permissions Editor**: Edit website permissions
- 📰 **RSS Reader**: Stay updated
- 📊 **JSON Reader**: Parse JSON data
- 🧪 **API Tester**: Test APIs easily
- 📈 **Page Analyzer**: Analyze content, DOMs, images, etc.
- 📝 **Site Notes**: Add personal notes

---

## 🔧 Patching Guide (Activation Bypass)

> **Purpose**: When updating to a new version, re-apply these patches to remove online activation and profile limits.

### Overview

The original app contacts `social-browser.com` to validate an activation key and enforce a 10-profile limit for unactivated installs. The patches below make it fully activated locally with **1000 max profiles**, **zero network calls**, and **no polling**.

### 📍 Patch Locations (in order of priority)

#### 1. `browser_manager/data.js` — **Primary activation logic** ⭐

This is the **most important file**. It contains three things to patch:

| What | Lines (approx.) | Original Behavior | Patched Behavior |
|---|---|---|---|
| `onLineActivated()` | ~780–860 | POST to `social-browser.com/api/activated-by-online-key` | No-op: sets `activated=true`, `maxProfiles=1000`, calls callback immediately |
| `setInterval()` (6hr poll) | ~862–867 | Re-checks activation every 6 hours | Commented out entirely |
| `activated()` | ~869–900 | Hardware fingerprint → key check → online fallback | Force-sets `activated=true`, `maxProfiles=1000` |

**Patch template** (replace the original functions):

```javascript
// [PATCHED] onLineActivated — no-op, never contacts social-browser.com
browserManager.onLineActivated = function (obj = {}, callback = () => {}) {
    browserManager.var.core.browser.activated = true;
    browserManager.var.core.browser.message = 'Locally Activated (patched)';
    browserManager.var.core.browser.maxProfiles = 1000;
    browserManager.shareBrowserVar('core');
    callback(null, { done: true, activated: true, maxProfiles: 1000 });
};

// [PATCHED] 6-hour polling disabled
// setInterval(() => { ... }, 1000 * 60 * 60 * 6);

// [PATCHED] activated() — force-activate locally
browserManager.activated = function () {
    browserManager.var.core.browser.activated = true;
    browserManager.var.core.browser.message = 'Locally Activated (patched)';
    browserManager.var.core.browser.maxProfiles = 1000;
    browserManager.shareBrowserVar('core');
};
```

> **How to find in new versions**: Search for `social-browser.com/api/activated-by-online-key` and `onLineActivated`.

---

#### 2. `browser_files/json/core.json` — **Default config**

Change `maxProfiles` from `10` to `1000`:

```json
"browser" : {
    "activated" : true,
    "maxProfiles" : 1000,
    "maxTabs" : 20
}
```

> **Why**: This is the initial value loaded at startup before `activated()` runs. Prevents a brief window where the limit is still 10.

---

#### 3. Secondary enforcement points (read-only — no edits needed if above patches applied)

These files **read** `maxProfiles` at runtime, so they are automatically fixed when the value is set to 1000:

| File | Line (approx.) | What it does |
|---|---|---|
| `browser_app/windows.js` | ~488 | If `activated=false`, redirects non-internal URLs to `/setting` |
| `browser_manager/messages.js` | ~428 | Server-side: blocks `[add-session]` when `session_list.length >= maxProfiles` |
| `browser_files/js/preload.js` | ~1167 | Client-side: `addSession()` checks `maxProfiles` before creating profile |
| `browser_files/js/setting.js` | ~514 | Import profiles: blocks if `imported + existing > maxProfiles` |
| `browser_manager/api.js` | ~171 | Local API route `/api/activated-by-online-key` — calls `onLineActivated()` (now our no-op) |

> **Search terms for new versions**: `maxProfiles`, `browser.activated`, `activated-by-online-key`

---

### 🔍 Quick Verification After Patching

1. **Start the app**: `npx electron .`
2. **Open Settings**: Navigate to `http://127.0.0.1:60080/setting`
3. **Check activation status**: Should show **"Browser Active ✓"** and **"Max Profils: (1000)"**
4. **Check DevTools console**: No errors about `social-browser.com` connections
5. **Create profiles**: Should allow creating profiles without any limit warning

---

## 🧩 Custom Extensions

### Event Monitor (`extensions/event-monitor/`)

A cross-origin DOM event monitoring extension with HTTP API.

| Endpoint | Method | Description |
|---|---|---|
| `/extentions/event-monitor` | GET | Dashboard UI |
| `/extentions/event-monitor/notify` | POST | Send DOM change notification |
| `/extentions/event-monitor/events` | GET | Retrieve all captured events |
| `/extentions/event-monitor/clear` | POST | Clear event log |
| `/extentions/event-monitor/ping` | GET | CORS-free health check (returns 1x1 pixel) |

**Standalone test page**: `extensions/event-monitor/company_mock.html`

See `extensions/event-monitor/README.md` for full documentation.

---

## 🧪 Testing Pages

| Page | URL | Purpose |
|---|---|---|
| Event Monitor Dashboard | `http://127.0.0.1:60080/extentions/event-monitor` | View captured DOM events |
| Company Mock (in-browser) | `http://127.0.0.1:60080/company_mock.html` | Test event notifications from within the browser |
| Standalone Mock (external) | `http://localhost:8080/standalone_mock.html` | Test cross-origin notifications (`npx http-server ./extensions/event-monitor -p 8080`) |
| Settings Panel | `http://127.0.0.1:60080/setting` | Verify activation status and profile limits |

---

## 🏗️ Architecture Notes

- **Framework**: Electron (Chromium-based)
- **Chromium Version**: Bundled with Electron — update via `npm install electron@<version>`
- **Internal Server**: Express-like server on port `60080` (HTTP) / `60043` (HTTPS)
- **IPC**: WebSocket-based communication between main process and renderer windows
- **Data Storage**: JSON files in `social-data/` directory
- **Extension System**: Custom extension loader via `browserManager.addPreload()` and `browserManager.addExtension()`

---

## 📄 License

This project is proprietary software. All rights reserved. No part of this software may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the owner, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.

---

## ⬇️ Download

Download the latest version from your preferred platform:

- **🌐 Official Site**: [https://social-browser.com](https://social-browser.com)
- **🏪 Microsoft Store**: [https://aka.ms/AAzbme4](https://aka.ms/AAzbme4)
- **📦 SourceForge**: [https://sourceforge.net/projects/social-browser-app](https://sourceforge.net/projects/social-browser-app)
- **⬇️ UpToDown**: [https://social-browser-388258.en.uptodown.com/windows](https://social-browser-388258.en.uptodown.com/windows)
- **🔍 AlternativeTo**: [https://alternativeto.net/software/social-browser/about/](https://alternativeto.net/software/social-browser/about/)
- **🚀 Product Hunt**: [https://www.producthunt.com/products/social-browser](https://www.producthunt.com/products/social-browser)
- **📚 Archive**: [https://archive.org/details/social-browser](https://archive.org/details/social-browser)
- **ℹ️ Software Informer**: [https://social-browser1.software.informer.com/](https://social-browser1.software.informer.com/)

---

<div align="center">
  <p><strong>Made with ❤️ by the Social Browser Team</strong></p>
</div>

