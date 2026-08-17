import Link from "next/link";

const steps = [
  ["01", "Download the companion", "Save the You Tabbed Companion ZIP to your computer and extract it somewhere easy to find."],
  ["02", "Load it into your browser", "Open chrome://extensions in Chrome or edge://extensions in Edge. Turn on Developer mode, choose Load unpacked, and select the extracted extension folder."],
  ["03", "Connect your dashboard", "Open the dashboard in the same browser, then open the You Tabbed Companion popup and choose Open dashboard or Sync tabs now."],
];

export default function SetupPage() {
  return (
    <main className="publicSite setupSite">
      <nav className="publicNav"><Link className="publicBrand" href="/welcome"><span className="publicMark"><i /><i /><i /><i /></span>You<span>Tabbed</span></Link><div><Link href="/welcome">← Back to overview</Link><Link className="navCta" href="/">Open dashboard ↗</Link></div></nav>
      <section className="setupHero"><p className="eyebrow">One-time browser setup</p><h1>Bring your real tabs into focus.</h1><p>Install the companion once. After that, You Tabbed can keep your private Chrome or Edge tab workspace fresh while your saved folders stay yours.</p><a className="primaryCta" href="/downloads/youtabbed-companion.zip" download>Download companion ZIP <span>↓</span></a><small>Manifest V3 · Chrome and Edge · 5.8 KB</small></section>
      <section className="setupSteps"><div className="sectionIntro"><p className="eyebrow">Three quick steps</p><h2>From scattered windows to one clear workspace.</h2></div><div className="stepGrid">{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="browserCards"><article><div className="browserBadge chromeBadge">C</div><div><h3>Google Chrome</h3><p>Go to <code>chrome://extensions</code>, enable Developer mode, then load the extracted <code>extension</code> folder.</p></div></article><article><div className="browserBadge edgeBadge">e</div><div><h3>Microsoft Edge</h3><p>Go to <code>edge://extensions</code>, enable Developer mode, then load the extracted <code>extension</code> folder.</p></div></article></section>
      <section className="privacyCard"><div className="privacyGlyph">⌁</div><div><p className="eyebrow">Your browser stays private</p><h2>Only tab metadata crosses the bridge.</h2><p>The companion reads tab titles, URLs, browser metadata, and timing. It does not read page contents, cookies, passwords, form data, or signed-in sessions. Saved workspace folders remain in your browser’s local storage.</p></div></section>
      <footer className="publicFooter"><span>Ready when you are.</span><div><Link href="/">Open dashboard</Link><Link href="/welcome">Product overview</Link><a href="https://github.com/xtermigator/you-tabbed">Source on GitHub</a></div></footer>
    </main>
  );
}
