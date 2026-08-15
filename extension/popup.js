const DASHBOARD_URL = "https://you-tabbed.netlify.app/";
const status = document.querySelector("#status");
const result = document.querySelector("#result");

function showResult(message, isError = false) {
  result.textContent = message;
  result.className = `result ${isError ? "error" : "success"}`;
}

async function sync() {
  status.textContent = "Syncing…";
  const response = await chrome.runtime.sendMessage({ type: "tabs:sync-request" });
  if (response?.ok) {
    status.textContent = `${response.count} tabs ready in You Tabbed`;
    showResult("Sync complete.");
  } else {
    status.textContent = "Dashboard not connected";
    showResult(response?.reason || "Open the dashboard first.", true);
  }
}

document.querySelector("#sync").addEventListener("click", sync);
document.querySelector("#open").addEventListener("click", () => {
  chrome.tabs.create({ url: DASHBOARD_URL });
});

chrome.storage.local.get(["lastSync", "tabCount"], ({ lastSync, tabCount }) => {
  if (lastSync && tabCount) status.textContent = `${tabCount} tabs · synced ${new Date(lastSync).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  else status.textContent = "Ready to connect";
});
