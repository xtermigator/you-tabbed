const DASHBOARD_URLS = [
  "https://you-tabbed.netlify.app/",
  "http://localhost:3000/",
];

function isDashboardUrl(url = "") {
  return DASHBOARD_URLS.some((base) => url.startsWith(base));
}

function ageLabel(timestamp) {
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr`;
  return `${Math.round(hours / 24)} day`;
}

async function collectTabs() {
  const tabs = await chrome.tabs.query({});
  return tabs
    .filter((tab) => tab.id !== undefined && tab.url && !isDashboardUrl(tab.url) && !tab.url.startsWith("chrome://") && !tab.url.startsWith("edge://") && !tab.url.startsWith("about:"))
    .map((tab, index) => ({
      id: tab.id,
      title: tab.title || tab.url,
      detail: tab.url,
      browser: /edg\//i.test(navigator.userAgent) ? "Edge" : "Chrome",
      age: ageLabel(tab.lastAccessed || Date.now()),
      url: tab.url,
      icon: (tab.title || "T").trim().charAt(0).toUpperCase() || "T",
      color: ["#2563eb", "#7655e8", "#25b99a", "#f56c70", "#14213d"][index % 5],
      action: false,
    }));
}

async function findDashboardTab() {
  const tabs = await chrome.tabs.query({});
  return tabs.find((tab) => isDashboardUrl(tab.url));
}

async function waitForTabLoaded(tabId) {
  const current = await chrome.tabs.get(tabId);
  if (current.status === "complete") return;
  await new Promise((resolve) => {
    const listener = (updatedId, changeInfo) => {
      if (updatedId === tabId && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}

async function sendTabsToDashboard(tabId, tabs) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: "tabs:sync", tabs });
  } catch {
    // If the dashboard was already open when the extension was installed,
    // its content script may not exist yet. Inject it once, then retry.
    await chrome.scripting.executeScript({ target: { tabId }, files: ["dashboard-bridge.js"] });
    await chrome.tabs.sendMessage(tabId, { type: "tabs:sync", tabs });
  }
}

async function syncToDashboard() {
  const dashboard = await findDashboardTab();
  if (!dashboard?.id) return { ok: false, reason: "Open You Tabbed in a browser tab first." };

  const tabs = await collectTabs();
  try {
    await sendTabsToDashboard(dashboard.id, tabs);
    await chrome.storage.local.set({ lastSync: Date.now(), tabCount: tabs.length });
    return { ok: true, count: tabs.length };
  } catch {
    return { ok: false, reason: "Refresh the You Tabbed dashboard once, then sync again." };
  }
}

async function openDashboardAndSync() {
  let dashboard = await findDashboardTab();
  if (!dashboard?.id) {
    dashboard = await chrome.tabs.create({ url: DASHBOARD_URLS[0] });
    if (!dashboard.id) return { ok: false, reason: "Could not open the dashboard." };
    await waitForTabLoaded(dashboard.id);
  }
  return syncToDashboard();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "tabs:sync-request") {
    syncToDashboard().then(sendResponse);
    return true;
  }
  if (message?.type === "tabs:open-and-sync") {
    openDashboardAndSync().then(sendResponse);
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ installedAt: Date.now() });
});

chrome.alarms.create("youTabbedSync", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "youTabbedSync") syncToDashboard();
});

chrome.tabs.onCreated.addListener(() => syncToDashboard());
chrome.tabs.onRemoved.addListener(() => syncToDashboard());
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.status === "complete" || changeInfo.url) syncToDashboard();
});
