"use client";

import { useEffect, useMemo, useState } from "react";

type TabItem = {
  id: number;
  title: string;
  detail: string;
  browser: "Chrome" | "Edge";
  age: string;
  icon: string;
  color: string;
  action?: boolean;
};

type TabGroup = {
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  tabs: TabItem[];
};

type TeamFavorite = {
  id: number;
  title: string;
  url: string;
  project: string;
  note: string;
  person: string;
  color: string;
};

const groups: TabGroup[] = [
  {
    name: "Marblism",
    subtitle: "AI workforce & projects",
    icon: "M",
    color: "#635bff",
    tabs: [
      { id: 1, title: "AI Employees Dashboard", detail: "Overview of agents, performance & tasks", browser: "Chrome", age: "12 min", icon: "M", color: "#14213d", action: true },
      { id: 2, title: "Rachel — Voice Agent Setup", detail: "Voice, scripts & integrations", browser: "Chrome", age: "28 min", icon: "R", color: "#7434db" },
      { id: 3, title: "Partner Program", detail: "Program details, tiers & benefits", browser: "Edge", age: "2 hr", icon: "P", color: "#ff6262", action: true },
      { id: 4, title: "Agent Blueprint Instructions", detail: "How to build & deploy agents", browser: "Chrome", age: "1 day", icon: "A", color: "#42b993" },
      { id: 5, title: "Account Settings", detail: "Billing, team & preferences", browser: "Edge", age: "3 days", icon: "S", color: "#1267e8" },
    ],
  },
  {
    name: "Facebook",
    subtitle: "Publishing & communities",
    icon: "f",
    color: "#1877f2",
    tabs: [
      { id: 6, title: "Create post", detail: "Unpublished Marblism partner draft", browser: "Chrome", age: "34 min", icon: "f", color: "#1877f2", action: true },
      { id: 7, title: "Marblism AI Community", detail: "Recent community discussion", browser: "Chrome", age: "1 hr", icon: "f", color: "#1877f2" },
      { id: 8, title: "Business Suite", detail: "Post scheduling and insights", browser: "Edge", age: "4 hr", icon: "f", color: "#1877f2" },
      { id: 9, title: "Partner announcement", detail: "Campaign reference post", browser: "Edge", age: "1 day", icon: "f", color: "#1877f2" },
    ],
  },
  {
    name: "Canva",
    subtitle: "Designs & graphics",
    icon: "C",
    color: "#00a9a5",
    tabs: [
      { id: 10, title: "Marblism partner graphic", detail: "Announcement design in progress", browser: "Chrome", age: "48 min", icon: "C", color: "#00a9a5", action: true },
      { id: 11, title: "Brand templates", detail: "Saved social templates", browser: "Chrome", age: "5 hr", icon: "C", color: "#00a9a5" },
      { id: 12, title: "Export settings", detail: "Social image export", browser: "Edge", age: "5 hr", icon: "C", color: "#00a9a5" },
    ],
  },
  {
    name: "Chico State",
    subtitle: "Coursework & resources",
    icon: "C",
    color: "#a6192e",
    tabs: Array.from({ length: 7 }, (_, i) => ({
      id: 13 + i,
      title: ["Course dashboard", "Module 2 resources", "Accessibility standards", "Discussion board", "Assignment prompt", "Research library", "Certificate program"][i],
      detail: "Course page open for review",
      browser: i % 2 ? "Edge" : "Chrome",
      age: i < 2 ? "2 hr" : "2 days",
      icon: "C",
      color: "#a6192e",
      action: i === 4,
    } as TabItem)),
  },
];

const seedFavorites: TeamFavorite[] = [
  { id: 101, title: "Marblism AI Employees", url: "marblism.com/ai-employees", project: "Marblism Growth", note: "Main workforce dashboard and agent reference", person: "EF", color: "#1768ef" },
  { id: 102, title: "Partner Announcement Design", url: "canva.com/design/partner-announcement", project: "Marblism Growth", note: "Current team-approved social graphic", person: "AS", color: "#00a9a5" },
  { id: 103, title: "Nonprofit Marketing Plan", url: "docs.google.com/nonprofit-marketing", project: "Nonprofit Outreach", note: "Working plan for marketing and fundraising", person: "EF", color: "#7139d9" },
  { id: 104, title: "Inclusive Pathways App Library", url: "friendlyfernspublishing.com/apps", project: "Inclusive Pathways", note: "Shared app and partner reference", person: "AS", color: "#ff5e62" },
];

const navItems = ["My Tabs", "By Website", "By Topic", "By Browser", "Needs Action", "Team Space"];

function AppIcon({ label, color, small = false }: { label: string; color: string; small?: boolean }) {
  return <span className={`appIcon ${small ? "small" : ""}`} style={{ background: color }}>{label}</span>;
}

function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      // Hydrate once after mount to avoid server/client markup mismatches.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch {
      // Corrupt or unavailable local storage should never prevent the app from opening.
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The dashboard remains usable in private browsing or restricted storage modes.
    }
  }, [hydrated, key, value]);

  return [value, setValue] as const;
}

export default function Home() {
  const [activeView, setActiveView] = usePersistentState("youTabbed.activeView", "By Website");
  const [openGroups, setOpenGroups] = usePersistentState<string[]>("youTabbed.openGroups", ["Marblism"]);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [closed, setClosed] = usePersistentState<number[]>("youTabbed.closedTabs", []);
  const [saved, setSaved] = usePersistentState<number[]>("youTabbed.savedTabs", []);
  const [taskTab, setTaskTab] = useState<TabItem | null>(null);
  const [teamFavorites, setTeamFavorites] = usePersistentState<TeamFavorite[]>("youTabbed.teamFavorites", seedFavorites);
  const [projectFilter, setProjectFilter] = usePersistentState("youTabbed.projectFilter", "All projects");
  const [favoriteModal, setFavoriteModal] = useState(false);
  const [favoriteDraft, setFavoriteDraft] = useState({ title: "", url: "", project: "Marblism Growth", note: "" });

  const visibleGroups = useMemo(() => {
    const lower = query.toLowerCase();
    return groups.map((group) => ({
      ...group,
      tabs: group.tabs.filter((tab) => {
        if (closed.includes(tab.id)) return false;
        const matchesSearch = !lower || `${group.name} ${tab.title} ${tab.detail}`.toLowerCase().includes(lower);
        const matchesView = activeView !== "Needs Action" || tab.action;
        const matchesBrowser = activeView !== "By Browser" || tab.browser === "Chrome";
        return matchesSearch && matchesView && matchesBrowser;
      }),
    })).filter((group) => group.tabs.length > 0);
  }, [query, activeView, closed]);

  const totalVisible = visibleGroups.reduce((sum, group) => sum + group.tabs.length, 0);

  function announce(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function toggleGroup(name: string) {
    setOpenGroups((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  }

  function openTab(tab: TabItem) {
    announce(`Switching to “${tab.title}” in ${tab.browser}`);
  }

  function saveTab(tab: TabItem) {
    setSaved((current) => current.includes(tab.id) ? current.filter((id) => id !== tab.id) : [...current, tab.id]);
    announce(saved.includes(tab.id) ? "Removed from saved references" : "Saved as a reference");
  }

  function closeTab(tab: TabItem) {
    setClosed((current) => [...current, tab.id]);
    announce(`Closed “${tab.title}” — Undo available`);
  }

  function addTeamFavorite() {
    if (!favoriteDraft.title.trim() || !favoriteDraft.url.trim()) return announce("Add a name and web address first");
    setTeamFavorites((current) => [{ id: Date.now(), ...favoriteDraft, person: "EF", color: "#1768ef" }, ...current]);
    setFavoriteDraft({ title: "", url: "", project: "Marblism Growth", note: "" });
    setFavoriteModal(false);
    announce("Favorite saved locally to this workspace");
  }

  function resetWorkspace() {
    setActiveView("By Website");
    setOpenGroups(["Marblism"]);
    setClosed([]);
    setSaved([]);
    setTeamFavorites(seedFavorites);
    setProjectFilter("All projects");
    announce("Workspace restored to its starter state");
  }

  return (
    <main className="appShell">
      <aside className="sideRail" aria-label="Utility navigation">
        <button className="brandMark" aria-label="YouTabbed home"><span /><span /><span /><span /></button>
        <div className="railNav">
          <button className="railButton active" aria-label="Tab groups">▰</button>
          <button className="railButton" aria-label="Tasks">✓</button>
          <button className="railButton" aria-label="Saved">☆</button>
          <button className="railButton" aria-label="History">◷</button>
        </div>
        <button className="railButton settings" aria-label="Reset workspace" onClick={resetWorkspace}>⚙</button>
      </aside>

      <section className="workspace">
        <header className="topHeader">
          <a className="wordmark" href="#" aria-label="YouTabbed home">You<span>Tabbed</span></a>
          <label className="searchBox">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tabs, sites, or work…" aria-label="Search open tabs" />
            {query && <button onClick={() => setQuery("")} aria-label="Clear search">×</button>}
          </label>
          <button className="teamChooser" onClick={() => setActiveView("Team Space")}><span><i>EF</i><i>AS</i></span>Dr. Disruptor Team</button>
          <button className="connectionPill" onClick={() => announce("Browser extension is connected and syncing tabs")}>
            <span className="liveDot" /> <strong>{42 - closed.length}</strong> tabs open
          </button>
        </header>

        <nav className="viewTabs" aria-label="Tab organization views" role="tablist">
          {navItems.map((item) => (
            <button key={item} role="tab" aria-selected={activeView === item} className={activeView === item ? "selected" : ""} onClick={() => setActiveView(item)}>{item}</button>
          ))}
        </nav>

        <div className={`syncStrip ${activeView === "Team Space" ? "purpleStrip" : ""}`}>
          <span className="extensionIcon">⊕</span>
          <div><strong>{activeView === "Team Space" ? "Team workspace is live" : "Browser extension connected"}</strong><small>{activeView === "Team Space" ? "Shared favorites sync through Supabase. Private tabs stay on each member’s computer." : "Chrome and Edge tabs stay on this computer and appear in your private dashboard."}</small></div>
          <button onClick={() => announce("Tabs refreshed just now")}>↻ Sync now</button>
        </div>

        {activeView !== "Team Space" && <section className="statsGrid" aria-label="Tab summary">
          <article><span className="statIcon blue">▣</span><div><strong>{42 - closed.length}</strong><small>Open Tabs</small></div></article>
          <article><span className="statIcon purple">◎</span><div><strong>12</strong><small>Websites</small></div></article>
          <article><span className="statIcon coral">!</span><div><strong>6</strong><small>Need Action</small></div></article>
          <article><span className="statIcon mint">▢</span><div><strong>4</strong><small>Duplicates</small></div></article>
        </section>}

        {activeView !== "Team Space" ? <div className="mainGrid">
          <section className="groupsPanel" aria-label="Grouped browser tabs">
            <div className="panelHeading">
              <div><p>{activeView}</p><h1>Your open tabs</h1></div>
              <span>{totalVisible} shown</span>
            </div>

            {visibleGroups.length === 0 && <div className="emptyState"><strong>No matching tabs</strong><span>Try another search or view.</span></div>}

            {visibleGroups.map((group) => {
              const expanded = openGroups.includes(group.name) || Boolean(query) || activeView === "Needs Action";
              return (
                <article className={`tabGroup ${group.name === "Marblism" ? "featured" : ""}`} key={group.name}>
                  <button className="groupHeader" onClick={() => toggleGroup(group.name)} aria-expanded={expanded}>
                    <AppIcon label={group.icon} color={group.color} />
                    <span className="groupName"><strong>{group.name}</strong><small>{group.subtitle}</small></span>
                    <span className="tabCount">{group.tabs.length} {group.tabs.length === 1 ? "tab" : "tabs"}</span>
                    <span className={`chevron ${expanded ? "up" : ""}`}>⌄</span>
                  </button>
                  {expanded && (
                    <div className="tabList">
                      {group.tabs.map((tab) => (
                        <div className="tabRow" key={tab.id}>
                          <AppIcon small label={tab.icon} color={tab.color} />
                          <button className="tabIdentity" onClick={() => openTab(tab)}>
                            <strong>{tab.title}</strong><small>{tab.detail}</small>
                          </button>
                          <span className="tabMeta"><i className={tab.browser.toLowerCase()} />{tab.browser} · {tab.age}</span>
                          <div className="rowActions">
                            <button className="openAction" onClick={() => openTab(tab)}>Open ↗</button>
                            <button className={saved.includes(tab.id) ? "saved" : ""} onClick={() => saveTab(tab)}>{saved.includes(tab.id) ? "Saved" : "Save"}</button>
                            <button className="taskAction" onClick={() => setTaskTab(tab)}>Create task</button>
                            <button className="closeAction" onClick={() => closeTab(tab)} aria-label={`Close ${tab.title}`}>×</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          <aside className="suggestionCard">
            <div className="suggestionLabel"><span>✦</span> Suggested unfinished action</div>
            <div className="abstractLogo" aria-hidden="true"><i /><i /><i /><i /></div>
            <h2>Finish the Marblism partner announcement</h2>
            <p>You have the partner details, design, and publishing pages open.</p>
            <div className="relatedTabs"><span>4 related tabs</span><span>About 15 min</span></div>
            <button onClick={() => { setOpenGroups((current) => current.includes("Marblism") ? current : [...current, "Marblism"]); announce("Marblism work group is ready"); }}>Continue task <span>→</span></button>
            <small>You stay in control. YouTabbed never sends or closes anything without your action.</small>
          </aside>
        </div> : <section className="teamSpace">
          <header className="teamHero"><div><p>Shared browser workspace</p><h1>Dr. Disruptor Team Space</h1><span>Share useful pages by project without sharing passwords, cookies, or private tabs.</span></div><button onClick={() => setFavoriteModal(true)}>＋ Add team favorite</button></header>

          <div className="privacyBand">
            <article><b className="localIcon">⌁</b><span><strong>Stays on each computer</strong><small>Open tabs, history, cookies, passwords, page contents and signed-in sessions</small></span></article>
            <em>→</em>
            <article><b className="sharedIcon">↗</b><span><strong>Shared through Supabase</strong><small>Favorites you approve, project, note, contributor and date</small></span></article>
          </div>

          <div className="teamStats"><article><strong>{teamFavorites.length}</strong><small>Shared favorites</small></article><article><strong>3</strong><small>Active projects</small></article><article><strong>5</strong><small>Team members</small></article><article><strong><i className="liveDot" /> Live</strong><small>Realtime sync</small></article></div>

          <div className="teamGrid">
            <section className="favoritesCard">
              <header><div><p>Team knowledge</p><h2>Shared favorites</h2></div><select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} aria-label="Filter favorites by project"><option>All projects</option><option>Marblism Growth</option><option>Nonprofit Outreach</option><option>Inclusive Pathways</option></select></header>
              <div>{teamFavorites.filter((item) => projectFilter === "All projects" || item.project === projectFilter).map((item) => <article className="favoriteItem" key={item.id}><b style={{ background: item.color }}>{item.title[0]}</b><span><strong>{item.title}</strong><small>{item.url}</small><p>{item.note}</p></span><label>{item.project}</label><i style={{ background: item.color }}>{item.person}</i><button onClick={() => announce(`Opening ${item.title} with your own browser sign-in`)}>Open ↗</button></article>)}</div>
            </section>
            <aside className="teamAside">
              <section><h3>Team members</h3><div className="person"><i>EF</i><span><strong>Eric Fishon</strong><small>Owner · active now</small></span></div><div className="person"><i>AS</i><span><strong>Ashley</strong><small>Editor · 8 min ago</small></span></div><div className="person"><i>+3</i><span><strong>Other members</strong><small>Workspace access</small></span></div></section>
              <section><h3>Your private browsers</h3><div className="browserLine"><b className="chromeDot" /><span><strong>Chrome · Windows</strong><small>28 tabs · connected</small></span></div><div className="browserLine"><b className="edgeDot" /><span><strong>Edge · Windows</strong><small>14 tabs · connected</small></span></div><button onClick={() => announce("Secure extension connection ready")}>＋ Connect another browser</button></section>
            </aside>
          </div>
        </section>}
      </section>

      {taskTab && (
        <div className="modalBackdrop" role="presentation" onMouseDown={() => setTaskTab(null)}>
          <section className="taskModal" role="dialog" aria-modal="true" aria-labelledby="task-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modalClose" onClick={() => setTaskTab(null)} aria-label="Close dialog">×</button>
            <p>New task from browser tab</p>
            <h2 id="task-title">What needs to happen next?</h2>
            <label>Task name<input defaultValue={`Finish: ${taskTab.title}`} /></label>
            <label>Related page<input value={taskTab.title} readOnly /></label>
            <div className="modalActions"><button onClick={() => setTaskTab(null)}>Cancel</button><button onClick={() => { announce("Task added to your YouTabbed queue"); setTaskTab(null); }}>Create task</button></div>
          </section>
        </div>
      )}

      {favoriteModal && <div className="modalBackdrop" role="presentation" onMouseDown={() => setFavoriteModal(false)}><section className="taskModal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}><button className="modalClose" onClick={() => setFavoriteModal(false)}>×</button><p>Share with your team</p><h2>Add a team favorite</h2><div className="safeShare"><b>✓</b><span><strong>Only this favorite is shared.</strong><small>No password, cookie, history, or other tab leaves your computer.</small></span></div><label>Name<input value={favoriteDraft.title} onChange={(e) => setFavoriteDraft({ ...favoriteDraft, title: e.target.value })} placeholder="Marblism Partner Program" /></label><label>Web address<input value={favoriteDraft.url} onChange={(e) => setFavoriteDraft({ ...favoriteDraft, url: e.target.value })} placeholder="https://…" /></label><label>Project<select value={favoriteDraft.project} onChange={(e) => setFavoriteDraft({ ...favoriteDraft, project: e.target.value })}><option>Marblism Growth</option><option>Nonprofit Outreach</option><option>Inclusive Pathways</option></select></label><label>Team note<input value={favoriteDraft.note} onChange={(e) => setFavoriteDraft({ ...favoriteDraft, note: e.target.value })} placeholder="Why is this useful?" /></label><div className="modalActions"><button onClick={() => setFavoriteModal(false)}>Cancel</button><button onClick={addTeamFavorite}>Share favorite</button></div></section></div>}

      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </main>
  );
}
