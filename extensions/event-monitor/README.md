# Event Monitor Extension 🚀

The **Event Monitor Extension** is an automated background task manager for Social Browser. It scans target web pages for specific DOM changes (such as new event cards or items) and triggers real-time Telegram notifications when matching elements are detected.

---

## 📋 Table of Contents
- [Core Features](#-core-features)
- [Key URLs & Endpoints](#-key-urls--endpoints)
- [How It Works (Architecture)](#-how-it-works-architecture)
- [Testing & Verification Guide](#-testing--verification-guide)
- [Configuration Reference](#-configuration-reference)

---

## 🚀 Core Features

* **Global Preload Injection:** Automatically registers `preload.js` with the Social Browser's core engine, enabling injection into all matching target URLs, whether served internally or hosted on external domains.
* **Dual-Mode Notifications (CORS Bypass):**
  * **Same-Origin:** Uses standard `fetch()` POST requests to the local server `/notify` endpoint.
  * **Cross-Origin:** Uses an `Image().src` GET fallback to the `/ping` endpoint to bypass CORS/preflight limitations on third-party origins.
* **Rate Limiting:** Prevents notification spamming by capping dispatches to a maximum of 1 alert every 5 seconds.
* **Duplicate Detection:** Marks processed DOM nodes with a `data-notified="true"` attribute to prevent duplicate alerts.
* **State Persistence:** Real-time state management (pause, resume, target config) persisted in memory via the `/state` endpoint.

---

## 🔗 Key URLs & Endpoints

| Resource | URL | Description |
| :--- | :--- | :--- |
| **Extension Dashboard** | `http://127.0.0.1:60080/extensions/event-monitor` | Interactive UI to monitor activity, manage targets, and toggle pause/resume state. |
| **Internal Mock Page** | `http://127.0.0.1:60080/company_mock.html` | A same-origin page served internally by the browser for testing default element detection. |
| **External Mock Page** | `http://localhost:8080/standalone_mock.html` | A cross-origin page served from an external server (e.g. port 8080) to verify cross-origin/CORS bypass. |

---

## 🛠️ How It Works (Architecture)

### Preload Script (`preload.js`)
* Runs in the context of the loaded web page.
* Uses a `MutationObserver` combined with a `setInterval` scan loop (every 2 seconds) to inspect the DOM for new element cards matching `selector`.
* On match:
  * Extracts the title and date.
  * Checks if `data-notified="true"` is set.
  * Dispatches notification payloads via POST or GET (image beacon) based on origin.

### Extension Controller (`index.js`)
* Bootstraps the extension within the renderer process.
* Uses `browser.addPreload()` to register the preload script globally.
* Exposes JSON API endpoints for configuration and state changes:
  * `POST /notify` - Accepts event details and forwards to Telegram.
  * `GET /ping` - Bypasses CORS via image-query params and forwards to Telegram.
  * `GET /state` / `POST /state` - Retrieves and updates the extension's running state.
  * `POST /pause` / `POST /resume` - Suspends or resumes notification dispatches.

---

## 🧪 Testing & Verification Guide

### Step 1: Start the External Mock Server
To test the cross-origin functionality, serve the mock page on an external port:
```bash
npx -y http-server ./extensions/event-monitor -p 8080 --cors -c-1
```

### Step 2: Open the Extension Dashboard
Open the Social Browser and navigate to:
[http://127.0.0.1:60080/extensions/event-monitor](http://127.0.0.1:60080/extensions/event-monitor)
* Toggle the **Pause / Resume** state to confirm the connection works.

### Step 3: Test Same-Origin Detection
Navigate to the internal mock page:
[http://127.0.0.1:60080/company_mock.html](http://127.0.0.1:60080/company_mock.html)
* Click **"Add Event Card"** to generate a new card.
* Verify that a Telegram notification is sent.

### Step 4: Test Cross-Origin Detection
Navigate to the external mock page:
[http://localhost:8080/standalone_mock.html](http://localhost:8080/standalone_mock.html)
* Click **"Add Event Card"**.
* Verify that a Telegram notification is successfully sent using the `/ping` GET fallback.

---

## ⚙️ Configuration Reference

The extension uses the following Telegram Bot configuration:
* **Bot Token:** `8163770306:AAFDyvNo7F5iQHruBLsYmjEwamVoA7cJKC4`
* **Chat ID:** `1532415580`

> [!WARNING]
> Ensure the Telegram Bot API is accessible and that the rate limit (maximum 1 request per 5 seconds) is respected during testing to prevent API throttling.
