// Mountville Motors — mobile site
// Single-component React app. Client-side routes: home | credit-denied | car-died | something-nicer | family

const { useState, useEffect, useRef, createContext, useContext } = React;

// ─── Tokens ───────────────────────────────────────────────────────
const C = {
  navy: '#0F2556',
  navyDeep: '#0A1A3F',
  silver: '#B8BCC2',
  silverLight: '#D6D9DE',
  amber: '#E8A64B',
  amberDark: '#C8871F',
  white: '#FFFFFF',
  offWhite: '#F7F5F2',
  charcoal: '#2B2F36',
  charcoal70: '#4B5058',
  line: '#E3DFD9',
};
const FONT = `'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif`;
const MONO = `'JetBrains Mono', ui-monospace, Menlo, monospace`;

const PHONE = '717-282-9188';
const PHONE_TEL = '+17172829188';
const ADDR = '806 Lancaster Ave, Columbia, PA 17512';
// Per-route SMS body for source attribution (see api/lead.js for tag mapping)
const SMS_BODY_BY_ROUTE = {
  'home':            'Hi%20Jordan%2C%20saw%20your%20site.%20Looking%20for%20info.',
  'credit-denied':   'Hi%20Jordan%2C%20got%20turned%20down%20elsewhere.%20Saw%20your%20site.',
  'car-died':        'Hi%20Jordan%2C%20car%20died.%20Need%20wheels%20fast.%20Saw%20your%20site.',
  'something-nicer': 'Hi%20Jordan%2C%20looking%20to%20upgrade.%20Saw%20your%20site.',
  'family':          'Hi%20Jordan%2C%20need%20a%20family%20car.%20Saw%20your%20site.',
  'about':           'Hi%20Jordan%2C%20saw%20your%20About%20page.%20Looking%20for%20info.',
  'contact':         'Hi%20Jordan%2C%20looking%20for%20info%20from%20your%20site.',
};
const smsHref = (route) => `sms:17172829188?&body=${SMS_BODY_BY_ROUTE[route] || SMS_BODY_BY_ROUTE.home}`;

// ─── Route context ────────────────────────────────────────────────
const RouteCtx = createContext(null);
const useRoute = () => useContext(RouteCtx);

// ─── Primitives ──────────────────────────────────────────────────

// Striped SVG placeholder for imagery — monospace caption says what goes there.
function Placeholder({ label, h = 220, tone = 'navy', ratio }) {
  const palettes = {
    navy:    { bg: '#1A3064', stripe: '#22407A', text: '#B8BCC2' },
    silver:  { bg: '#E6E2DB', stripe: '#D6D1C8', text: '#4B5058' },
    amber:   { bg: '#F2D9A8', stripe: '#E8C98A', text: '#5B3F12' },
    charcoal:{ bg: '#2B2F36', stripe: '#343943', text: '#B8BCC2' },
  };
  const p = palettes[tone] || palettes.navy;
  const style = ratio
    ? { width: '100%', aspectRatio: ratio }
    : { width: '100%', height: h };
  return (
    <div style={{ ...style, position: 'relative', overflow: 'hidden', background: p.bg }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <defs>
          <pattern id={`stripe-${tone}`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="16" height="16" fill={p.bg} />
            <rect width="1" height="16" fill={p.stripe} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#stripe-${tone})`} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, textAlign: 'center',
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', color: p.text,
          textTransform: 'uppercase', lineHeight: 1.4, maxWidth: '80%',
        }}>{label}</span>
      </div>
    </div>
  );
}

// Shield logo chip — uses the real logo PNG inside a navy rounded square
function LogoMark({ size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: C.navy,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
    }}>
      <img src="assets/logo.png" alt="Mountville Motors"
        style={{ width: size * 0.86, height: size * 0.86, objectFit: 'contain', display: 'block' }} />
    </div>
  );
}

// ─── Click-to-text top banner (sticky, biggest mobile conversion lift) ──
function TopBanner() {
  const { route } = useRoute();
  return (
    <a href={smsHref(route)} style={{
      position: 'sticky', top: 0, zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      background: C.amber, color: C.navyDeep, textDecoration: 'none',
      padding: '10px 12px', fontSize: 14, fontWeight: 700, letterSpacing: '0.01em',
      minHeight: 44, lineHeight: 1.2,
      borderBottom: `2px solid ${C.amberDark}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>$1,000 down · Text Jordan: {PHONE}</span>
    </a>
  );
}

// ─── Trust strip (above header) ───────────────────────────────────
function TrustStrip() {
  return (
    <div style={{
      background: C.offWhite, color: C.charcoal70,
      borderBottom: `1px solid ${C.line}`,
      padding: '6px 12px', textAlign: 'center',
      fontSize: 10, fontWeight: 600, letterSpacing: '0.14em',
      textTransform: 'uppercase', lineHeight: 1.3,
    }}>
      Family-owned since 2001 · <span style={{ color: C.amberDark }}>★ 4.2</span> · 338 Google reviews
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────
function Header() {
  const { go, route } = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <TopBanner />
      <TrustStrip />
      <header style={{
        position: 'sticky', top: 44, zIndex: 50,
        background: C.white, borderBottom: `1px solid ${C.line}`,
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go('home'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.charcoal }}>
          <LogoMark size={38} />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, letterSpacing: '0.02em' }}>MOUNTVILLE</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.charcoal70, letterSpacing: '0.22em' }}>MOTOR SALES · PA</div>
          </div>
        </a>
        <div style={{ flex: 1 }} />
        <a href={`tel:${PHONE_TEL}`} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, color: C.navy, textDecoration: 'none',
          padding: '8px 10px', borderRadius: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Call
        </a>
        <button onClick={() => setMenuOpen(v => !v)} aria-label="Menu"
          style={{
            width: 38, height: 38, borderRadius: 8, border: `1px solid ${C.line}`,
            background: menuOpen ? C.offWhite : C.white, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
          <span style={{ width: 16, height: 2, background: C.navy, borderRadius: 1 }} />
          <span style={{ width: 16, height: 2, background: C.navy, borderRadius: 1 }} />
          <span style={{ width: 16, height: 2, background: C.navy, borderRadius: 1 }} />
        </button>
      </header>
      {menuOpen && (
        <div style={{
          position: 'sticky', top: 102, zIndex: 49,
          background: C.white, borderBottom: `1px solid ${C.line}`,
          padding: '8px 16px 16px',
        }}>
          {[
            ['Home', 'home'],
            ['Credit denied elsewhere', 'credit-denied'],
            ['Car just died', 'car-died'],
            ['Time for something nicer', 'something-nicer'],
            ['Outgrown your car', 'family'],
            ['About', 'about'],
            ['Contact', 'contact'],
          ].map(([label, r]) => (
            <a key={r} href="#"
              onClick={(e) => { e.preventDefault(); setMenuOpen(false); go(r); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 4px', borderBottom: `1px solid ${C.line}`,
                fontSize: 15, fontWeight: 500, color: route === r ? C.navy : C.charcoal,
                textDecoration: 'none',
              }}>
              <span>{label}</span>
              <span style={{ color: C.silver, fontSize: 16 }}>›</span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Page-intro pain card (varies per landing) ────────────────────
function Hero({ eyebrow, headline, hopeLine, sub, imageLabel, imageTone = 'navy', numbers = '$1,000 down · $80–$100/week · drive this week' }) {
  return (
    <section style={{ background: C.navy, color: C.white, position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Placeholder label={imageLabel} h={200} tone={imageTone} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, rgba(15,37,86,0.25) 0%, rgba(15,37,86,0.85) 70%, ${C.navy} 100%)`,
        }} />
      </div>
      <div style={{ padding: '18px 20px 24px' }}>
        {eyebrow && (
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
            color: C.amber, textTransform: 'uppercase', marginBottom: 12,
            borderLeft: `2px solid ${C.amber}`, paddingLeft: 8,
          }}>{eyebrow}</div>
        )}
        <h1 style={{
          fontSize: 28, lineHeight: 1.15, fontWeight: 700, margin: 0,
          letterSpacing: '-0.02em', textWrap: 'pretty',
        }}>
          {headline}
          {hopeLine && <><br/><span style={{ color: C.amber, fontWeight: 600 }}>{hopeLine}</span></>}
        </h1>
        {numbers && (
          <div style={{
            marginTop: 14, fontSize: 14, fontWeight: 600, color: C.white,
            letterSpacing: '0.01em', lineHeight: 1.4,
            display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
          }}>
            {numbers.split(' · ').map((bit, i, arr) => (
              <React.Fragment key={i}>
                <span>{bit}</span>
                {i < arr.length - 1 && <span style={{ width: 3, height: 3, borderRadius: 2, background: C.amber, display: 'inline-block' }} />}
              </React.Fragment>
            ))}
          </div>
        )}
        {sub && <p style={{
          fontSize: 15, lineHeight: 1.5, color: C.silverLight, marginTop: 14, marginBottom: 0, textWrap: 'pretty',
        }}>{sub}</p>}
      </div>
    </section>
  );
}

// ─── Three-pillar band ────────────────────────────────────────────
function Pillars() {
  const items = [
    { k: '01', t: 'Income-based approval', d: 'We approve on income, not score.' },
    { k: '02', t: 'Real inspected vehicles', d: '2006–2016. Checked before they hit the lot.' },
    { k: '03', t: 'Same-day decisions', d: 'Walk in with the right paperwork, walk out with a plan.' },
  ];
  return (
    <section style={{ background: C.offWhite, padding: '24px 20px', borderTop: `1px solid ${C.line}` }}>
      {items.map((it, i) => (
        <div key={it.k} style={{
          display: 'flex', gap: 14, padding: '14px 0',
          borderBottom: i < items.length - 1 ? `1px solid ${C.line}` : 'none',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18, flexShrink: 0,
            background: C.navy, color: C.white,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
          }}>{it.k}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>{it.t}</div>
            <div style={{ fontSize: 14, color: C.charcoal70, marginTop: 2, lineHeight: 1.4 }}>{it.d}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

// ─── Proof band ───────────────────────────────────────────────────
function Proof({ quote, name, detail, operational = 'Family-owned and operating in Columbia since 2001. Hundreds of families helped and still counting.' }) {
  return (
    <section style={{ background: C.white, padding: '28px 20px', borderTop: `1px solid ${C.line}` }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: C.charcoal70,
        textTransform: 'uppercase', marginBottom: 14,
      }}>Real customers · Real stories</div>
      <div style={{
        border: `1px solid ${C.line}`, borderRadius: 12, padding: 18,
        background: C.offWhite,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22, flexShrink: 0,
            background: C.silver, color: C.navy,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700,
          }}>{name.split(' ').map(s => s[0]).join('').slice(0, 2)}</div>
          <div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: C.charcoal, textWrap: 'pretty' }}>
              &ldquo;{quote}&rdquo;
            </p>
            <div style={{ fontSize: 13, color: C.charcoal70, marginTop: 10 }}>
              <strong style={{ color: C.navy, fontWeight: 600 }}>{name}</strong> · {detail}
            </div>
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginTop: 18,
        fontSize: 13, color: C.charcoal70,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: C.amber, flexShrink: 0 }} />
        <span>{operational}</span>
      </div>
    </section>
  );
}

// ─── Offer stack ──────────────────────────────────────────────────
function OfferStack() {
  return (
    <section style={{ background: C.charcoal, color: C.white, padding: '28px 20px' }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: C.amber,
        textTransform: 'uppercase', marginBottom: 16,
      }}>The numbers, plain</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.015em' }}>
        Drive-away amount. Doc fee + interest are spelled out in your loan paperwork.
      </h2>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14,
        padding: '6px 12px', borderRadius: 9999,
        background: 'rgba(232,166,75,0.14)', border: `1px solid rgba(232,166,75,0.35)`,
        color: C.amber, fontSize: 12, fontWeight: 600, letterSpacing: '0.02em',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: C.amber, display: 'inline-block' }} />
        Inventory moves fast — new vehicles weekly
      </div>

      <div style={{ marginTop: 22, display: 'grid', gap: 14 }}>
        <StackRow label="Down payment" value="$1,000 – $3,000"
          note="Your drive-away number. Covers tax, tags, title, and plate. That's it." />
        <StackRow label="Weekly payments" value="$80 – $100 / week"
          note="Or $160 – $200 biweekly. We match the schedule you get paid on." />
        <StackRow label="Vehicle range" value="$6,999 – $11,999"
          note="2006–2016 sedans, SUVs, vans, trucks. Inspected before the lot." />
        <StackRow label="Timeline" value="Typically same-day or next-day"
          note="For qualified buyers who bring the right paperwork." />
      </div>

      <div style={{
        marginTop: 24, padding: 16,
        border: `1px solid rgba(255,255,255,0.14)`, borderRadius: 10,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.amber, marginBottom: 10, letterSpacing: '0.02em' }}>
          What to bring
        </div>
        {['PA Driver\'s License', 'Proof of income', 'Proof of address', 'Social Security card'].map((x) => (
          <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{x}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StackRow({ label, value, note }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline',
      gap: 12, paddingBottom: 14, borderBottom: `1px dashed rgba(255,255,255,0.14)`,
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.silver, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: C.silverLight, marginTop: 6, lineHeight: 1.45, maxWidth: 240 }}>{note}</div>
      </div>
      <div style={{
        fontSize: 17, fontWeight: 700, color: C.white, letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}>{value}</div>
    </div>
  );
}

// ─── Objection handler ────────────────────────────────────────────
function ObjectionHandler({ custom }) {
  const lines = custom || [
    ['What\'s the catch?', 'Nothing. We\'re in-house, so there\'s no bank involved.'],
    ['How can you approve me?', 'We approve on income, not score. Steady paycheck is what counts.'],
    ['Any hidden fees?', 'Your down is the drive-away — covers tax, tags, title, plate. Doc fee and interest are in the loan, fully disclosed in the paperwork before you sign.'],
  ];
  return (
    <section style={{ background: C.white, padding: '28px 20px', borderTop: `1px solid ${C.line}` }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: C.charcoal70,
        textTransform: 'uppercase', marginBottom: 14,
      }}>Questions we get</div>
      {lines.map(([q, a], i) => (
        <details key={i} style={{
          borderBottom: `1px solid ${C.line}`, padding: '14px 0',
        }} open={i === 0}>
          <summary style={{
            fontSize: 15, fontWeight: 600, color: C.navy, cursor: 'pointer',
            listStyle: 'none', display: 'flex', justifyContent: 'space-between', gap: 10,
          }}>
            <span>{q}</span>
            <span style={{ color: C.amber, fontSize: 18, lineHeight: 1 }}>+</span>
          </summary>
          <p style={{ margin: '10px 0 0', fontSize: 14, color: C.charcoal70, lineHeight: 1.5 }}>{a}</p>
        </details>
      ))}
    </section>
  );
}

// ─── CTA band (primary SMS — form is now inline above this on every page) ──
function CTABand({ title = 'Ready when you are.', lead = 'Jordan texts back within 60 seconds during open hours. No call center, no pressure.' }) {
  const { route } = useRoute();
  return (
    <section style={{
      background: C.amber, color: C.navyDeep,
      padding: '32px 20px',
    }}>
      <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 }}>
        {title}
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.45, margin: '10px 0 22px', color: C.charcoal, textWrap: 'pretty' }}>
        {lead}
      </p>
      <a href={smsHref(route)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        background: C.navy, color: C.white, textDecoration: 'none',
        padding: '18px 20px', borderRadius: 12, fontSize: 17, fontWeight: 700,
        boxShadow: '0 6px 16px rgba(15,37,86,0.22)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Text Jordan — {PHONE}
      </a>
    </section>
  );
}

// ─── Sticky bottom SMS CTA bar ───────────────────────────────────
function StickySMSBar() {
  const { route } = useRoute();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 60,
      background: C.navy, color: C.amber,
      display: 'flex', alignItems: 'stretch',
      borderTop: `1px solid rgba(255,255,255,0.08)`,
      boxShadow: '0 -8px 24px rgba(0,0,0,0.18)',
    }}>
      <a href={smsHref(route)} style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        color: C.amber, textDecoration: 'none', padding: '14px 16px',
        fontSize: 15, fontWeight: 700, letterSpacing: '0.01em',
        minHeight: 44,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Text Jordan: {PHONE}
      </a>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss"
        style={{
          background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.55)',
          padding: '0 16px', fontSize: 18, cursor: 'pointer', minHeight: 44, minWidth: 44,
        }}>×</button>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────
function Footer() {
  const { go } = useRoute();
  const hours = [
    ['Monday', '9 AM – 6 PM'],
    ['Tuesday', '9 AM – 5 PM'],
    ['Wednesday', '9 AM – 6 PM'],
    ['Thursday', '9 AM – 6 PM'],
    ['Friday', '9 AM – 6 PM'],
    ['Saturday', 'Closed'],
    ['Sunday', 'Closed'],
  ];
  return (
    <footer style={{ background: C.navyDeep, color: C.silverLight, padding: '28px 20px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <LogoMark size={42} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, letterSpacing: '0.02em' }}>MOUNTVILLE MOTORS</div>
          <div style={{ fontSize: 11, color: C.silver, letterSpacing: '0.16em' }}>COLUMBIA · PENNSYLVANIA</div>
        </div>
      </div>

      {/* Map */}
      <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.1)`, marginBottom: 20 }}>
        <iframe
          title="Map"
          src="https://www.google.com/maps?q=806+Lancaster+Ave+Columbia+PA+17512&output=embed"
          style={{ border: 0, width: '100%', height: 160, display: 'block', filter: 'grayscale(0.2) contrast(0.95)' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div style={{ display: 'grid', gap: 16, fontSize: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>Visit</div>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(ADDR)}`} target="_blank" rel="noreferrer"
            style={{ color: C.white, textDecoration: 'none', fontWeight: 500, lineHeight: 1.45 }}>
            806 Lancaster Ave<br/>Columbia, PA 17512
          </a>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>Talk</div>
          <a href={`tel:${PHONE_TEL}`} style={{ color: C.white, textDecoration: 'none', fontWeight: 500 }}>
            {PHONE}
          </a>
          <div style={{ fontSize: 13, color: C.silver, marginTop: 4 }}>Text or call — either works.</div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.amber, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Hours</div>
          <div style={{ display: 'grid', gap: 4 }}>
            {hours.map(([d, t]) => (
              <div key={d} style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 13,
                color: t === 'Closed' ? C.silver : C.white,
              }}>
                <span>{d}</span>
                <span style={{ fontFamily: MONO, fontSize: 12 }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.silver, marginTop: 10 }}>Closed holidays.</div>
        </div>

        {/* Social links intentionally removed — this is a paid-traffic landing page, not a brand site. */}
      </div>

      <div style={{
        marginTop: 24, paddingTop: 16, borderTop: `1px solid rgba(255,255,255,0.1)`,
        fontSize: 11, color: C.silver, lineHeight: 1.5,
      }}>
        © 2026 Mountville Motors. Independent in-house financing. Approval subject to verification of income, address, and identity. All vehicles sold as described and inspected prior to delivery. Customer first names used with permission; details may be condensed for clarity.
      </div>
    </footer>
  );
}

// ─── Lead form (2-step: name+phone → optional details) ─────────
// Design: Step 0 captures name+phone with a "just text me" skip. Step 1 is
// optional enrichment (vehicle, down, challenge). Each step = ~50% drop-off
// avoided vs. the old 5-step wizard. Marty's §5-D qualification picks up the
// rest over SMS when the user skips.
function LeadForm({ variant = 'full' }) {
  const { route } = useRoute();
  const STORAGE_KEY = 'mm_leadform_v3';
  const DEFAULTS = { name: '', phone: '', vehicle: 'Car (sedan)', down: '$1,000 – $1,500', challenge: '' };

  const [step, setStep] = useState(0);        // 0, 1, 2 (success)
  const [f, setF] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch (e) {}
    return DEFAULTS;
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(f)); } catch (e) {}
  }, [f]);

  const nameRef = useRef(null);

  useEffect(() => {
    if (step === 0 && nameRef.current) nameRef.current.focus();
  }, [step]);

  const TOTAL = 2;

  function validateStep0() {
    const e = {};
    if (!f.name.trim()) e.name = 'First name required';
    if (!f.phone.trim() || f.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid 10-digit number';
    return e;
  }

  async function doSubmit({ skipped = false } = {}) {
    const e = validateStep0();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: f.name,
          phone: f.phone,
          vehicle: f.vehicle,
          downPayment: f.down,
          biggestChallenge: f.challenge,
          sourceRoute: route,
          skippedQuickForm: skipped,
        }),
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      setStep(TOTAL);
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    } catch (err) {
      setErrors({ submit: 'Network hiccup. Tap "Text Jordan" below to reach us directly.' });
    } finally {
      setSubmitting(false);
    }
  }

  function continueToDetails() {
    const e = validateStep0();
    setErrors(e);
    if (Object.keys(e).length === 0) setStep(1);
  }
  function back() {
    setErrors({});
    if (step > 0) setStep(step - 1);
  }
  function reset() {
    setF(DEFAULTS); setErrors({}); setStep(0);
  }

  // ── Success screen ─────────────────────────────────────────────
  if (step === TOTAL) {
    return (
      <div style={{
        margin: '20px', padding: 28, background: C.offWhite,
        border: `1px solid ${C.line}`, borderRadius: 12, textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, margin: '0 auto 16px', borderRadius: 28,
          background: C.amber, color: C.navyDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, letterSpacing: '-0.01em' }}>
          Done. Watch your messages.
        </div>
        <p style={{ fontSize: 15, color: C.charcoal70, lineHeight: 1.55, margin: '12px 0 0' }}>
          Jordan will text you at <strong style={{ color: C.navy }}>{f.phone}</strong> within 60 seconds during open hours. After hours? First thing next business day.
        </p>
        <button onClick={reset} style={{
          marginTop: 22, padding: '12px 20px', background: 'transparent',
          border: `1.5px solid ${C.navy}`, color: C.navy, borderRadius: 10,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          Send another
        </button>
      </div>
    );
  }

  // ── Shared input styling ──────────────────────────────────────
  const fld = (hasErr) => ({
    width: '100%', padding: '16px 14px', fontSize: 17,  // 17px avoids iOS zoom
    border: `1.5px solid ${hasErr ? '#A63D3D' : C.line}`, borderRadius: 10, background: C.white,
    fontFamily: FONT, color: C.charcoal, boxSizing: 'border-box',
    minHeight: 52,
  });
  const lbl = { fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 8, display: 'block', letterSpacing: '0.01em' };
  const err = { fontSize: 12, color: '#A63D3D', marginTop: 6 };
  const selectChevron = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%230F2556' stroke-width='1.6' fill='none' stroke-linecap='round'/></svg>")`;

  const btnPrimary = {
    flex: 1, padding: '16px 20px', background: C.navy, color: C.white,
    border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700,
    cursor: submitting ? 'wait' : 'pointer', letterSpacing: '0.01em', minHeight: 52,
    opacity: submitting ? 0.75 : 1,
  };
  const btnGhost = {
    padding: '14px 18px', background: 'transparent', border: `1.5px solid ${C.line}`,
    color: C.navy, borderRadius: 10, fontSize: 14, fontWeight: 600,
    cursor: 'pointer', minHeight: 48, width: '100%',
  };

  return (
    <div style={{ padding: variant === 'inline' ? '20px' : '20px', background: C.offWhite }}>
      {/* Reassurance (step 0 only) */}
      {step === 0 && (
        <div style={{
          background: C.white, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 19, background: C.navy, color: C.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontSize: 13, fontWeight: 700,
          }}>J</div>
          <div style={{ fontSize: 13, color: C.charcoal, lineHeight: 1.4 }}>
            Takes about <strong style={{ color: C.navy }}>15 seconds</strong>. Jordan texts you back within <strong style={{ color: C.navy }}>60</strong>.
          </div>
        </div>
      )}

      {/* Progress dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= step ? C.navy : C.line,
            transition: 'background 160ms ease',
          }} />
        ))}
      </div>
      <div style={{
        fontSize: 11, fontWeight: 600, color: C.charcoal70, letterSpacing: '0.16em',
        textTransform: 'uppercase', marginBottom: 14,
      }}>
        {step === 0 ? 'Step 1 of 2 · Your info' : 'Step 2 of 2 · Quick details (optional)'}
      </div>

      {step === 0 && (
        <>
          {/* Name */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>First name</label>
            <input ref={nameRef} type="text" autoComplete="given-name" inputMode="text"
              enterKeyHint="next"
              style={fld(errors.name)} value={f.name}
              onChange={e => setF({ ...f, name: e.target.value })}
              placeholder="First name" />
            {errors.name && <div style={err}>{errors.name}</div>}
          </div>
          {/* Phone */}
          <div style={{ marginBottom: 8 }}>
            <label style={lbl}>Mobile number (to text you back)</label>
            <input type="tel" autoComplete="tel" inputMode="tel"
              enterKeyHint="done"
              pattern="[0-9 ()\\-]*"
              style={fld(errors.phone)} value={f.phone}
              onChange={e => setF({ ...f, phone: e.target.value })}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); continueToDetails(); } }}
              placeholder="(717) 000-0000" />
            {errors.phone && <div style={err}>{errors.phone}</div>}
            <p style={{ fontSize: 12, color: C.charcoal70, marginTop: 8, lineHeight: 1.4 }}>
              Jordan texts from this number personally. No auto-spam.
            </p>
          </div>

          {errors.submit && <div style={{ ...err, marginBottom: 10 }}>{errors.submit}</div>}

          {/* Primary: continue to details. Secondary: skip & submit. */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button type="button" onClick={continueToDetails} disabled={submitting}
              style={btnPrimary}>
              Text me back →
            </button>
          </div>
          <div style={{ marginTop: 10 }}>
            <button type="button" onClick={() => doSubmit({ skipped: true })} disabled={submitting}
              style={btnGhost}>
              {submitting ? 'Sending…' : 'Just text me — I\'ll share the rest live'}
            </button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          {/* Vehicle */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>What kind of vehicle?</label>
            <select style={{ ...fld(false), appearance: 'none', backgroundImage: selectChevron, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}
              value={f.vehicle} onChange={e => setF({ ...f, vehicle: e.target.value })}>
              <option>Car (sedan)</option>
              <option>SUV</option>
              <option>Truck</option>
              <option>Van / Minivan</option>
              <option>Haven't decided</option>
            </select>
          </div>
          {/* Down */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Down payment you can bring</label>
            <select style={{ ...fld(false), appearance: 'none', backgroundImage: selectChevron, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}
              value={f.down} onChange={e => setF({ ...f, down: e.target.value })}>
              <option>Under $1,000</option>
              <option>$1,000 – $1,500</option>
              <option>$1,500 – $2,000</option>
              <option>$2,000 – $3,000</option>
              <option>$3,000+</option>
            </select>
            <p style={{ fontSize: 12, color: C.charcoal70, marginTop: 8, lineHeight: 1.4 }}>
              Your down is the drive-away — tax, tags, title, plate. Loan terms (doc fee, interest, any late fees) are in the paperwork.
            </p>
          </div>
          {/* Challenge */}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Anything going on we should know? <span style={{ color: C.charcoal70, fontWeight: 400 }}>(optional)</span></label>
            <textarea rows="3" style={{ ...fld(false), resize: 'vertical', minHeight: 88, fontSize: 16, lineHeight: 1.45 }}
              value={f.challenge} onChange={e => setF({ ...f, challenge: e.target.value })}
              placeholder="Credit got dinged. Car died. Whatever's going on — Jordan's heard it before." />
          </div>

          {errors.submit && <div style={{ ...err, marginBottom: 10 }}>{errors.submit}</div>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={back} disabled={submitting} style={{
              padding: '16px 18px', background: 'transparent', border: `1.5px solid ${C.line}`,
              color: C.navy, borderRadius: 10, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', minHeight: 52, minWidth: 96,
            }}>
              ← Back
            </button>
            <button type="button" onClick={() => doSubmit({ skipped: false })} disabled={submitting}
              style={btnPrimary}>
              {submitting ? 'Sending…' : 'Send to Jordan'}
            </button>
          </div>
        </>
      )}

      <p style={{ fontSize: 11, color: C.charcoal70, marginTop: 14, lineHeight: 1.5, textAlign: 'center' }}>
        By sending, you agree Mountville Motors can text or call you about your inquiry. Standard rates apply.
      </p>
    </div>
  );
}

// ─── Inline form section (landing pages) ─────────────────────────
// Wraps LeadForm in an eyebrow-headed section for embed on each landing page.
// Kills the /contact nav-away click (biggest conversion leak identified in
// marketer review Tier 1 #3).
function InlineLeadFormSection({ id = 'apply' }) {
  return (
    <section id={id} style={{ background: C.offWhite, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
      <div style={{ padding: '28px 20px 8px' }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: C.amber,
          textTransform: 'uppercase', marginBottom: 10,
          borderLeft: `2px solid ${C.amber}`, paddingLeft: 8,
        }}>Pre-qualify here</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.navy, margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
          Fifteen seconds. A text back in sixty.
        </h2>
        <p style={{ fontSize: 14, color: C.charcoal70, margin: '10px 0 0', lineHeight: 1.5 }}>
          Just your name and number gets you started. Jordan takes it from there.
        </p>
      </div>
      <LeadForm variant="inline" />
    </section>
  );
}

// ─── Pages ────────────────────────────────────────────────────────
function PathCard({ r, eyebrow, title, body }) {
  const { go } = useRoute();
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); go(r); }}
      style={{
        display: 'block', textDecoration: 'none', color: C.charcoal,
        background: C.white, border: `1px solid ${C.line}`, borderRadius: 12,
        padding: 16, marginBottom: 10,
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: C.amber,
            textTransform: 'uppercase', marginBottom: 6,
          }}>{eyebrow}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, letterSpacing: '-0.01em', lineHeight: 1.25 }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: C.charcoal70, marginTop: 6, lineHeight: 1.45 }}>
            {body}
          </div>
        </div>
        <div style={{
          width: 30, height: 30, borderRadius: 15, background: C.offWhite,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          color: C.navy, fontSize: 16,
        }}>›</div>
      </div>
    </a>
  );
}

function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Family-owned in Columbia · Since 2001"
        headline="A used car that fits the paycheck you already have."
        hopeLine=""
        sub="Buy here, pay here — done the neighborly way. Income-based approval, real inspected vehicles, same-day decisions."
        imageLabel="[photo] Mountville lot on Lancaster Ave — row of inspected 2006–2016 sedans, SUVs, minivans at dusk"
        imageTone="navy"
      />

      <Pillars />

      {/* Route-to-your-story cards */}
      <section style={{ background: C.white, padding: '28px 20px', borderTop: `1px solid ${C.line}` }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: C.charcoal70,
          textTransform: 'uppercase', marginBottom: 10,
        }}>Which sounds like you?</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.navy, margin: '0 0 16px', letterSpacing: '-0.015em', lineHeight: 1.2 }}>
          Pick the closest situation. We'll show you the shortest path.
        </h2>
        <PathCard r="credit-denied"  eyebrow="Path 01" title="Turned down somewhere else"
          body="Your credit isn't the problem here. Your paycheck is the qualifier." />
        <PathCard r="car-died"       eyebrow="Path 02" title="Your car just died"
          body="You need a reliable replacement this week, not in three." />
        <PathCard r="something-nicer" eyebrow="Path 03" title="Time for something nicer"
          body="You've been driving rough. A clean, inspected car without the games." />
        <PathCard r="family"         eyebrow="Path 04" title="Outgrown your current car"
          body="Car seat math stopped working. Room for the kids without a 10-year loan." />
      </section>

      <Proof
        quote="Penny was right. Jordan didn't flinch when I told him my score — he looked at my pay stubs, we walked the lot, I drove home that evening. First place in six tries that just treated me like a regular customer."
        name="Deshawn"
        detail="York, PA · 2013 Chevy Equinox"
      />

      <OfferStack />

      <ObjectionHandler />

      <InlineLeadFormSection />

      <CTABand
        title="Come see us. Or just text."
        lead="Jordan answers texts personally during open hours. No call center, no pressure."
      />

      <Footer />
    </>
  );
}

function CreditDeniedPage() {
  return (
    <>
      <Hero
        eyebrow="Family-owned in Columbia · Since 2001"
        headline="Another dealer said no."
        hopeLine="We probably won't."
        sub="If you were turned down across town, it's almost always about your score. We don't start there. We start with your paycheck."
        imageLabel="[photo] Customer leaving another dealership — we meet them where they are"
        imageTone="charcoal"
      />
      <Pillars />
      <Proof
        quote="After six places turned us away, Mountville treated us with respect. First real yes I'd heard in a year. I brought my last four pay stubs and that was the whole conversation."
        name="Penny"
        detail="Columbia, PA · 2014 Toyota Corolla"
      />
      <OfferStack />
      <ObjectionHandler custom={[
        ['Why would you say yes when they said no?', 'Because we fund the loan ourselves. No bank in the middle means no score cutoff. Steady income is the signal we need.'],
        ['Will this hurt my credit further?', 'No surprise hits. We verify income, address, and identity. That\'s the work.'],
        ['What if my last repo was recent?', 'Tell us the story. A real one, as recent as last month, has often still worked here. Bring the pay stubs.'],
      ]} />
      <InlineLeadFormSection />

      <CTABand
        title="One more try. No lecture."
        lead="Text your name and the situation. Jordan replies in plain English."
      />
      <Footer />
    </>
  );
}

function CarDiedPage() {
  return (
    <>
      <Hero
        eyebrow="Family-owned in Columbia · Since 2001"
        headline="Engine blew. Rides running out."
        hopeLine="You can be driving again this week."
        sub="When the car dies, the week doesn't stop. Work, kids, groceries — all on you. We keep people moving without dragging it out."
        imageLabel="[photo] Family carpool — the quiet cost of a dead car"
        imageTone="silver"
      />
      <Pillars />
      <Proof
        quote="My car died Sunday night and I had to get to work Monday. Texted Jordan at 7am. He had me in a 2015 Rogue by Thursday after my shift. My boss didn't even know I'd been without a car."
        name="Brian"
        detail="Columbia, PA · 2015 Nissan Rogue"
      />
      <OfferStack />
      <ObjectionHandler custom={[
        ['Can this actually happen this week?', 'For qualified buyers with paperwork ready and a vehicle that fits, yes. Typically same-day or next-day. No theater.'],
        ['What if my current car has a trade-in value of zero?', 'No problem. We don\'t need a trade. Your down payment stands on its own.'],
        ['Do I need to borrow rides to get there?', 'Tell us where you are. If it\'s Lancaster or York County, we\'ll figure it out.'],
      ]} />
      <InlineLeadFormSection />

      <CTABand
        title="Let's get you mobile again."
        lead="Text the year/make/model that died and the paycheck schedule you\'re on."
      />
      <Footer />
    </>
  );
}

function SomethingNicerPage() {
  return (
    <>
      <Hero
        eyebrow="Family-owned in Columbia · Since 2001"
        headline="You've made it work long enough."
        hopeLine="Drive something clean."
        sub="Not a luxury car. Just something you're ready to be seen in again. Inspected, reliable, on payments that fit your pay."
        imageLabel="[photo] Customer getting keys to a clean 2014 Honda Accord — dignity, not flash"
        imageTone="navy"
      />
      <Pillars />
      <Proof
        quote="I drove a hand-me-down for six years. Door handle held on with a zip tie. Jordan put me in a 2014 Accord and my kid said, 'Mom, it even smells new.' A fresh start — that's what it felt like."
        name="Tanya"
        detail="Lancaster, PA · 2014 Honda Accord"
      />
      <OfferStack />
      <ObjectionHandler custom={[
        ['Am I reaching above my means?', 'Nope. Our whole range ($6,999–$11,999) is priced for weekly paychecks. No stretch, no trap.'],
        ['Will the payments balloon?', 'No balloon. Fixed weekly schedule from day one. (Late fees and interest are spelled out in your loan paperwork.)'],
        ['What makes a car "nicer" here?', 'Lower mileage, cleaner interior, newer model year inside our 2006–2016 range. Same approval rules.'],
      ]} />
      <InlineLeadFormSection />

      <CTABand
        title="Come see the nicer end of the lot."
        lead="Text what you drive now. We'll tell you what's an honest step up."
      />
      <Footer />
    </>
  );
}

function FamilyPage() {
  return (
    <>
      <Hero
        eyebrow="Family-owned in Columbia · Since 2001"
        headline="Three car seats don't fit in a Civic."
        hopeLine="Let's get you a third row."
        sub="SUVs, minivans, and 3-row family vehicles. Inspected, inspected again, and priced on the same honest payment terms."
        imageLabel="[photo] Dad loading groceries + stroller into a 2013 Honda Pilot"
        imageTone="amber"
      />
      <Pillars />
      <Proof
        quote="Baby number three broke the sedan math. We needed something big enough for all the kids and the stroller. Jordan walked us around three minivans, didn't push the priciest. We took the Sienna home that Saturday."
        name="Angela & Marcus"
        detail="Mountville, PA · 2013 Toyota Sienna"
      />
      <OfferStack />
      <ObjectionHandler custom={[
        ['Are family vehicles more down?', 'Same $1,000–$3,000 range. SUVs and vans land on the higher end. We tell you the number before you come in.'],
        ['What about safety?', 'Every vehicle gets a safety + drivability check — brakes, tires, belts, lights. Comfort extras (sunroof, heated seats, tire pressure sensors, etc.) are sold as-is — we\'ll show you what\'s working before you commit.'],
        ['Weekly payment on a minivan?', 'Still in the $80–$100 weekly range on most. A few higher-mileage vans come in lower.'],
      ]} />
      <InlineLeadFormSection />

      <CTABand
        title="Room for the whole crew."
        lead="Text how many car seats you're working with. We'll start there."
      />
      <Footer />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="Family-owned in Columbia · Since 2001"
        headline="Neighborly by design."
        hopeLine=""
        sub="We're an independent, family-owned dealership on Lancaster Ave — in continuous operation since July 1, 2001. Hundreds of families from Lancaster and York County have bought here. Most hear about us from a cousin."
        imageLabel="[photo] Jordan + team on the Mountville lot"
        imageTone="navy"
      />
      <section style={{ padding: '28px 20px', background: C.white }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.navy, margin: 0, letterSpacing: '-0.015em' }}>
          What we're not.
        </h2>
        <ul style={{ padding: 0, margin: '16px 0 0', listStyle: 'none' }}>
          {[
            'We\'re not a subprime chain. No quotas, no scripts.',
            'We\'re not flipping luxury cars. We sell reliable 2006–2016 daily drivers.',
            'We\'re not running a call center. Jordan answers the phone.',
            'Every fee disclosed in your loan paperwork. Your down is the drive-away.',
          ].map((l, i) => (
            <li key={i} style={{
              display: 'flex', gap: 10, padding: '10px 0', borderBottom: `1px solid ${C.line}`,
              fontSize: 15, color: C.charcoal, lineHeight: 1.45,
            }}>
              <span style={{ color: C.amber, fontWeight: 700, marginTop: 1 }}>—</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </section>
      <Proof
        quote="I've sent my brother, my cousin, and two people from work. Jordan remembers all of them by name."
        name="Keisha"
        detail="Repeat customer · 2011, 2016, 2022"
      />
      <InlineLeadFormSection />
      <CTABand />
      <Footer />
    </>
  );
}

function ContactPage() {
  return (
    <>
      <section style={{ background: C.navy, color: C.white, padding: '28px 20px' }}>
        <div style={{
          display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
          color: C.amber, textTransform: 'uppercase', marginBottom: 10,
          borderLeft: `2px solid ${C.amber}`, paddingLeft: 8,
        }}>Pre-qualify</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.15 }}>
          Fifteen seconds. A text back in sixty.
        </h1>
        <p style={{ fontSize: 15, color: C.silverLight, margin: '12px 0 0', lineHeight: 1.5 }}>
          Just your name and number to get started. No score pulled, no commitment. Jordan takes it from there.
        </p>
      </section>
      <LeadForm />
      <section style={{ background: C.white, padding: '20px', borderTop: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: C.charcoal70, textTransform: 'uppercase', marginBottom: 10 }}>
          Rather talk now?
        </div>
        <a href={`tel:${PHONE_TEL}`} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 16,
          background: C.offWhite, border: `1px solid ${C.line}`, borderRadius: 10,
          textDecoration: 'none', color: C.navy,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 20, background: C.navy, color: C.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{PHONE}</div>
            <div style={{ fontSize: 13, color: C.charcoal70 }}>Mon–Fri · We pick up.</div>
          </div>
        </a>
      </section>
      <Footer />
    </>
  );
}

// ─── App shell ────────────────────────────────────────────────────
const PAGES = {
  'home': HomePage,
  'credit-denied': CreditDeniedPage,
  'car-died': CarDiedPage,
  'something-nicer': SomethingNicerPage,
  'family': FamilyPage,
  'about': AboutPage,
  'contact': ContactPage,
};

function MMSite({ initial = 'home', scopeId }) {
  const [route, setRoute] = useState(initial);
  const scrollRef = useRef(null);

  function go(r) {
    setRoute(r);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }

  const Page = PAGES[route] || HomePage;

  return (
    <RouteCtx.Provider value={{ route, go }}>
      <div ref={scrollRef} data-mm-scope={scopeId}
        style={{
          width: '100%', height: '100%', overflow: 'auto',
          background: C.offWhite, fontFamily: FONT, color: C.charcoal,
          fontSize: 15, lineHeight: 1.45,
          WebkitOverflowScrolling: 'touch',
          display: 'flex', flexDirection: 'column',
        }}>
        <Header />
        <div style={{ flex: '1 0 auto' }}>
          <Page />
        </div>
        <StickySMSBar />
      </div>
    </RouteCtx.Provider>
  );
}

window.MMSite = MMSite;
window.MMPages = Object.keys(PAGES);
