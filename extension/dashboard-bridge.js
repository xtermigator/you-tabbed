window.addEventListener("message", (event) => {
  if (event.source !== window || event.data?.source !== "youtabbed-dashboard" || event.data?.type !== "tabs:request") return;
  chrome.runtime.sendMessage({ type: "tabs:sync-request" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "tabs:sync") return;
  window.postMessage({
    source: "youtabbed-extension",
    type: "tabs:sync",
    tabs: message.tabs,
  }, "*");
});
