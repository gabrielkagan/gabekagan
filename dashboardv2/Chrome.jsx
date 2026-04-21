// Header, status strip, torah banner, section divider
function Header({ balance, dailyPnl, dailyPct, running }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 24px', borderBottom:'1px solid var(--border-0)',
      background:'rgba(12,16,24,.95)', backdropFilter:'blur(10px)',
      position:'sticky', top:0, zIndex:100
    }}>
      <div style={{display:'flex', alignItems:'center', gap:14}}>
        <span style={{fontFamily:'var(--mono)', fontSize:24, color:'#10b981', lineHeight:1}}>◆</span>
        <span style={{fontFamily:'var(--mono)', fontWeight:700, letterSpacing:2, fontSize:13, color:'var(--text-2)', whiteSpace:'nowrap'}}>KALSHI BOT</span>
        <StatusPill status={running ? 'LIVE' : 'OFF'} dot/>
      </div>
      <div style={{display:'flex', alignItems:'baseline', gap:16, fontFamily:'var(--mono)'}}>
        <span style={{fontSize:11, color:'var(--text-3)', letterSpacing:'.8px', textTransform:'uppercase'}}>BAL</span>
        <span style={{fontSize:20, fontWeight:700, color:'var(--text-0)', fontVariantNumeric:'tabular-nums'}}>${balance.toFixed(2)}</span>
        <span style={{fontSize:13, fontWeight:600, color: dailyPnl >= 0 ? '#10b981' : '#f43f5e', fontVariantNumeric:'tabular-nums'}}>
          {dailyPnl >= 0 ? '+' : ''}{(dailyPnl/100).toFixed(2)} ({dailyPct >= 0 ? '+' : ''}{dailyPct.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}

function StatusStrip({ items }) {
  return (
    <div style={{
      position:'sticky', top:46, zIndex:99,
      display:'flex', alignItems:'center', justifyContent:'center', gap:20,
      padding:'5px 24px', background:'rgba(12,16,24,.95)', backdropFilter:'blur(10px)',
      borderBottom:'1px solid var(--border-0)', fontFamily:'var(--mono)', fontSize:11,
      flexWrap:'wrap'
    }}>
      {items.map((it, i) => (
        <span key={i} style={{display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap'}}>
          <span style={{color:'var(--text-3)', fontSize:9, textTransform:'uppercase', letterSpacing:'.5px'}}>{it.label}</span>
          {it.dot && <span style={{width:6, height:6, borderRadius:'50%', background:it.dotColor || '#10b981'}}/>}
          <span style={{color:'var(--text-0)', fontWeight:600}}>{it.value}</span>
        </span>
      ))}
    </div>
  );
}

function TorahBanner({ hebrew, english, source }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center', gap:14,
      padding:'10px 24px',
      background:'linear-gradient(90deg, rgba(167,139,250,.04) 0%, rgba(56,189,248,.04) 100%)',
      borderBottom:'1px solid var(--violet-border)', textAlign:'center', flexWrap:'wrap'
    }}>
      <span style={{fontFamily:'var(--hebrew)', fontSize:13, color:'#a78bfa', direction:'rtl'}}>{hebrew}</span>
      <span style={{color:'var(--border-2)', fontSize:10}}>·</span>
      <span style={{fontFamily:'var(--sans)', fontSize:11.5, fontStyle:'italic', color:'var(--text-1)'}}>{english}</span>
      <span style={{fontFamily:'var(--mono)', fontSize:9, fontWeight:600, color:'var(--text-3)', letterSpacing:'.8px', textTransform:'uppercase'}}>{source}</span>
    </div>
  );
}

function SectionDivider({ label, chapter, story, meta, hebrew, glyph }) {
  return (
    <div style={{
      padding:'0 4px 18px',
      display:'grid',
      gridTemplateColumns:'auto 1fr auto',
      columnGap:22, rowGap:4,
      alignItems:'end',
      borderBottom:'1px solid rgba(197,168,85,.22)',
      marginBottom:22
    }}>
      {/* Big Hebrew chapter letter, runs full height */}
      {chapter && (
        <div style={{
          gridRow:'1 / span 2',
          fontFamily:'var(--hebrew)',
          fontSize:56, fontWeight:700, lineHeight:.85,
          color:'var(--gold-0)', opacity:.75, letterSpacing:-1,
          alignSelf:'end', paddingBottom:0
        }}>
          {chapter}
        </div>
      )}
      {/* Title row — English label + Hebrew word */}
      <div style={{display:'flex', alignItems:'baseline', gap:14, minWidth:0, flexWrap:'wrap'}}>
        {glyph && <span style={{fontFamily:'var(--hebrew)', fontSize:22, color:'var(--gold-0)', lineHeight:1}}>{glyph}</span>}
        <span style={{fontFamily:'var(--sans)', fontSize:22, fontWeight:700, color:'var(--text-0)', letterSpacing:-.4, whiteSpace:'nowrap'}}>{label}</span>
        {hebrew && (
          <span style={{
            fontFamily:'var(--hebrew)', fontSize:17,
            color:'var(--gold-0)', opacity:.75,
            letterSpacing:0, fontWeight:500
          }}>· {hebrew}</span>
        )}
      </div>
      {meta && (
        <span style={{
          fontFamily:'var(--mono)', fontSize:10,
          color:'var(--text-3)', letterSpacing:1.4, textTransform:'uppercase',
          whiteSpace:'nowrap', alignSelf:'end'
        }}>{meta}</span>
      )}
      {/* Story lede — below title, spans to the meta column */}
      {story && (
        <div style={{
          gridColumn:'2 / 4',
          fontFamily:'var(--sans)', fontSize:13.5,
          color:'var(--text-2)', fontStyle:'italic',
          lineHeight:1.5, maxWidth:680,
          textWrap:'pretty'
        }}>
          {story}
        </div>
      )}
    </div>
  );
}

function Section({ chapter, label, story, meta, hebrew, glyph, children }) {
  return (
    <section style={{padding:'40px 0 12px', position:'relative'}}>
      <SectionDivider chapter={chapter} label={label} story={story} meta={meta} hebrew={hebrew} glyph={glyph}/>
      <div className="stack">{children}</div>
      <div style={{
        height:1, marginTop:28,
        background:'linear-gradient(90deg, rgba(197,168,85,.12), transparent 40%)'
      }}/>
    </section>
  );
}

function Row({ children }) {
  return <div className="row">{children}</div>;
}

Object.assign(window, { Header, StatusStrip, TorahBanner, SectionDivider, Section, Row });
