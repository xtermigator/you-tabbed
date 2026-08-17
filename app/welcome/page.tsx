import Link from "next/link";

const highlights = [
  { number: "01", title: "See every tab", text: "Bring your Chrome or Edge windows into one calm, searchable workspace." },
  { number: "02", title: "Keep work together", text: "Save live tabs into custom folders for research, launches, clients, and repeatable projects." },
  { number: "03", title: "Stay in control", text: "You Tabbed never closes, shares, or sends anything without an action you choose." },
];

export default function WelcomePage() {
  return (
    <main className="publicSite">
      <nav className="publicNav"><Link className="publicBrand" href="/welcome"><span className="publicMark"><i /><i /><i /><i /></span>You<span>Tabbed</span></Link><div><Link href="#how-it-works">How it works</Link><Link href="/setup">Install companion</Link><Link className="navCta" href="/">Open dashboard ↗</Link></div></nav>
      <section className="heroSection">
        <div className="heroCopy"><p className="eyebrow">A calmer place for browser work</p><h1>Your tabs are trying to tell you what matters next.</h1><p className="heroLead">You Tabbed turns scattered Chrome and Edge windows into a focused, private workspace you can search, act on, and organize into custom folders.</p><div className="heroActions"><Link className="primaryCta" href="/setup">Get the browser companion <span>→</span></Link><Link className="secondaryCta" href="/">Explore the dashboard</Link></div><div className="heroNote"><span className="liveDot" /> Works locally first · No account required for the core dashboard</div></div>
        <div className="heroVisual"><div className="visualWindow"><div className="visualTop"><span className="traffic red" /><span className="traffic yellow" /><span className="traffic green" /><span className="visualUrl">you-tabbed.netlify.app</span></div><div className="visualBody"><aside><b>▰</b><b>✓</b><b>☆</b><b>◷</b></aside><div className="visualCanvas"><div className="visualSearch">⌕ Search tabs, sites, or work… <small>2 tabs open</small></div><div className="visualStats"><i><strong>42</strong><small>Open tabs</small></i><i><strong>12</strong><small>Websites</small></i><i><strong>6</strong><small>Need action</small></i></div><div className="visualRows"><div className="visualGroup"><b>Marblism <small>5 tabs</small></b><span>AI Employees Dashboard</span><span>Rachel — Voice Agent Setup</span><span>Partner Program</span></div><div className="visualGroup purple"><b>Research <small>3 saved tabs</small></b><span>OpenAI</span><span>GitHub</span></div></div></div></div></div><div className="floatCard"><span>✦</span><strong>Suggested next step</strong><small>Finish the partner announcement</small></div></div>
      </section>
      <section className="highlightSection" id="how-it-works"><div className="sectionIntro"><p className="eyebrow">Less tab chaos. More momentum.</p><h2>A dashboard that works the way your attention works.</h2></div><div className="highlightGrid">{highlights.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <section className="quoteSection"><p>“The goal is not to manage every tab. It is to make the next useful action obvious.”</p><Link href="/setup">Set up your private workspace →</Link></section>
      <footer className="publicFooter"><span>© You Tabbed</span><div><Link href="/setup">Setup guide</Link><Link href="/">Dashboard</Link><a href="https://github.com/xtermigator/you-tabbed">GitHub</a></div></footer>
    </main>
  );
}
