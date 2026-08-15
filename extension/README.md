# You Tabbed Companion Extension

This is a Chromium Manifest V3 extension that works in Google Chrome and Microsoft Edge. It reads the current browser tab list with the `tabs` permission and sends normalized tab metadata to an open You Tabbed dashboard tab.

## Load it locally

1. Start the dashboard with `npm install` and `npm run dev`, or use the deployed dashboard at `https://you-tabbed.netlify.app`.
2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this `extension/` directory.
5. Open the You Tabbed dashboard in the same browser.
6. Open the You Tabbed Companion popup and choose **Sync tabs now**.

The extension also syncs when tabs are created, removed, or finish navigating, and performs a lightweight periodic sync once per minute. The dashboard's **Sync now** control can request a manual refresh from the extension.

## Privacy and permissions

The extension needs `tabs` to read tab titles and URLs, `storage` to remember the latest sync status, and `alarms` for periodic refresh. It does not read page contents, cookies, passwords, form values, or signed-in sessions. Tab metadata is delivered to the dashboard tab through an in-browser message bridge; the extension does not use a separate server.

The manifest currently allows the deployed You Tabbed dashboard and `http://localhost:3000` for local development. If you deploy the dashboard to a different domain, add that origin to `host_permissions` and the content-script `matches` list before loading the extension.
