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
    .filter((tab) => tab.id !== undefined && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("edge://") && !tab.url.startsWith("about:"))
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

async function syncToDashboard() {
  const dashboard = await findDashboardTab();
  if (!dashboard?.id) return { ok: false, reason: "Open You Tabbed in a browser tab first." };

  const tabs = await collectTabs();
  try {
    await chrome.tabs.sendMessage(dashboard.id, { type: "tabs:sync", tabs });
    await chrome.storage.local.set({ lastSync: Date.now(), tabCount: tabs.length });
    return { ok: true, count: tabs.length };
  } catch {
    return { ok: false, reason: "Refresh the You Tabbed dashboard and try again." };
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "tabs:sync-request") return;
  syncToDashboard().then(sendResponse);
  return true;
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
