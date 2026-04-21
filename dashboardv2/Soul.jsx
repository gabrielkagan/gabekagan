// Soul components — personal, Jewish, distinctive.
// TalmudHero, KavanahBar, HebrewDate, HebrewDayBars, SephirotMark, Gematria glow.

// Hebrew day names (Sunday=Rishon)
const HEBREW_DAYS = ['רִאשׁוֹן','שֵׁנִי','שְׁלִישִׁי','רְבִיעִי','חֲמִישִׁי','שִׁשִּׁי','שַׁבָּת'];
const HEBREW_DAYS_EN = ['Rishon','Sheni','Shlishi','Revi\'i','Chamishi','Shishi','Shabbat'];

// Chai = 18. Multiples of 18 are blessed. Pure whimsy.
function isChaiMultiple(n) { return Math.abs(n) >= 18 && Math.abs(n) % 18 === 0; }

// Small ten-node sephirot mark, rendered inline
function SephirotMark({ size=32, color='var(--gold-0)', activeTier=0 }) {
  // nodes: [col, row] — col 0=left, 1=center, 2=right; row 1..7 top to bottom
  const nodes = [
    [1,1],          // Keter
    [2,2], [0,2],   // Chochmah, Binah
    [2,3], [0,3],   // Chesed, Gevurah
    [1,4],          // Tiferet
    [2,5], [0,5],   // Netzach, Hod
    [1,6],          // Yesod
    [1,7],          // Malchut
  ];
  const W = size, H = size*1.3;
  const cx = (c) => (c/2)*(W*0.7) + W*0.15;
  const cy = (r) => ((r-1)/6)*H*0.9 + H*0.05;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{display:'block'}}>
      {/* center pillar spine */}
      <line x1={cx(1)} y1={cy(1)} x2={cx(1)} y2={cy(7)} stroke={color} strokeWidth="0.5" opacity="0.4"/>
      {nodes.map(([c,r],i)=>(
        <circle key={i} cx={cx(c)} cy={cy(r)} r={W*0.05}
          fill={i === activeTier ? color : 'transparent'}
          stroke={color} strokeWidth="0.8"/>
      ))}
    </svg>
  );
}

// Talmud-style hero: central number, four corners of marginalia
function TalmudHero({ balance, peak, deposit, daily, dailyPct, starting, uptime, drawdown }) {
  const profit = daily > 0;
  const lifetime = balance - deposit;
  const lifetimePct = (lifetime / deposit) * 100;
  return (
    <div style={{
      gridColumn:'span 9',
      background:'var(--bg-1)',
      border:'1px solid var(--border-0)',
      borderRadius:10,
      padding:'14px 20px',
      position:'relative',
      overflow:'hidden',
      ...(profit ? {borderLeft:'2px solid #10b981'} : {}),
    }}>
      {/* top row: section label + session */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <SephirotMark size={18} color="var(--gold-0)" activeTier={5}/>
          <div style={{fontFamily:'var(--sans)', fontSize:9, fontWeight:600, letterSpacing:1.4, textTransform:'uppercase', color:'var(--text-3)'}}>
            Today's standing
          </div>
        </div>
        <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)'}}>{uptime}</div>
      </div>

      {/* central balance — daf/mishnah style */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'1fr auto 1fr',
        gridTemplateRows:'auto auto auto',
        gap:'0 24px',
        alignItems:'center',
      }}>
        {/* Top-left margin: peak */}
        <div style={{textAlign:'right', fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', lineHeight:1.5, borderRight:'1px solid rgba(197,168,85,.1)', paddingRight:20}}>
          <div style={{color:'var(--gold-0)', fontSize:9, letterSpacing:1, textTransform:'uppercase', fontWeight:600, marginBottom:2}}>peak</div>
          <div style={{color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>${peak.toFixed(2)}</div>
        </div>

        {/* Central number */}
        <div style={{textAlign:'center', gridRow:'1 / span 3', padding:'2px 0'}}>
          <div style={{fontFamily:'var(--mono)', fontSize:46, fontWeight:700, letterSpacing:-2, color:'var(--text-0)', fontVariantNumeric:'tabular-nums', lineHeight:1}}>
            ${balance.toFixed(2)}
          </div>
          <div style={{marginTop:6, fontFamily:'var(--mono)', fontSize:12, color: profit ? '#10b981' : '#f43f5e', fontWeight:600}}>
            {profit ? '▲' : '▼'} ${Math.abs(daily/100).toFixed(2)} today · {dailyPct >= 0 ? '+' : ''}{dailyPct.toFixed(2)}%
            {isChaiMultiple(daily) && <span style={{marginLeft:8, color:'var(--gold-0)', fontSize:10, opacity:0.6}}>· ×{Math.abs(daily)/18} lucky</span>}
          </div>
        </div>

        {/* Top-right margin: lifetime */}
        <div style={{textAlign:'left', fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', lineHeight:1.5, borderLeft:'1px solid rgba(197,168,85,.1)', paddingLeft:20}}>
          <div style={{color:'var(--gold-0)', fontSize:9, letterSpacing:1, textTransform:'uppercase', fontWeight:600, marginBottom:2}}>lifetime</div>
          <div style={{color: lifetime>=0 ? '#10b981' : '#f43f5e', fontVariantNumeric:'tabular-nums'}}>{lifetime>=0?'+':''}${lifetime.toFixed(2)} ({lifetimePct>=0?'+':''}{lifetimePct.toFixed(1)}%)</div>
        </div>

        {/* Bottom-left margin: starting */}
        <div style={{textAlign:'right', fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', lineHeight:1.5, borderRight:'1px solid rgba(197,168,85,.1)', paddingRight:20}}>
          <div style={{color:'var(--gold-0)', fontSize:9, letterSpacing:1, textTransform:'uppercase', fontWeight:600, marginBottom:2}}>deposit</div>
          <div style={{color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>${deposit.toFixed(2)}</div>
        </div>

        {/* Bottom-right margin: drawdown */}
        <div style={{textAlign:'left', fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', lineHeight:1.5, borderLeft:'1px solid rgba(197,168,85,.1)', paddingLeft:20}}>
          <div style={{color:'var(--gold-0)', fontSize:9, letterSpacing:1, textTransform:'uppercase', fontWeight:600, marginBottom:2}}>drawdown</div>
          <div style={{color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>{drawdown.toFixed(1)}% · {starting}</div>
        </div>
      </div>

      {/* Bottom center commentary */}
      <div style={{marginTop:10, textAlign:'center', paddingTop:8, borderTop:'1px solid rgba(197,168,85,.1)'}}>
        <div style={{fontFamily:'var(--sans)', fontSize:10, color:'var(--text-3)', fontStyle:'italic', letterSpacing:.5}}>
          Count what is counted. <span style={{color:'var(--gold-0)'}}>Trade the edge.</span>
        </div>
      </div>
    </div>
  );
}

// Kavanah — daily trading intention
function KavanahBar({ intention, parsha }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:16,
      padding:'10px 24px',
      borderBottom:'1px solid var(--border-0)',
      background:'linear-gradient(90deg, rgba(197,168,85,.04), rgba(197,168,85,.02) 50%, transparent)',
    }}>
      <div style={{display:'flex', alignItems:'center', gap:14, flex:1}}>
        <span style={{fontFamily:'var(--mono)', fontSize:9, fontWeight:700, color:'var(--gold-0)', letterSpacing:1.5, textTransform:'uppercase', whiteSpace:'nowrap'}}>
          ✦ Kavanah
        </span>
        <span style={{color:'var(--border-2)', fontSize:10}}>·</span>
        <span style={{fontFamily:'var(--sans)', fontSize:12, color:'var(--text-1)', fontStyle:'italic'}}>{intention}</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:10, whiteSpace:'nowrap'}}>
        <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:1}}>Parashat</span>
        <span style={{fontFamily:'var(--hebrew)', fontSize:13, color:'var(--text-1)'}}>{parsha.hebrew}</span>
        <span style={{fontFamily:'var(--sans)', fontSize:11, color:'var(--text-2)'}}>{parsha.english}</span>
      </div>
    </div>
  );
}

// Hebrew date display (static for demo)
function HebrewDate({ hebrew, gregorian, omer }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:8, fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', whiteSpace:'nowrap'}}>
      <span style={{fontFamily:'var(--hebrew)', fontSize:12, color:'var(--text-2)'}}>{hebrew}</span>
      <span style={{color:'var(--border-2)'}}>·</span>
      <span>{gregorian}</span>
      {omer && <><span style={{color:'var(--border-2)'}}>·</span><span style={{color:'var(--gold-0)'}}>day {omer} of omer</span></>}
    </div>
  );
}

// Weekly PnL with Hebrew day labels
function HebrewDayBars({ days }) {
  const max = Math.max(...days.map(d => Math.abs(d.pnl_cents)));
  return (
    <div style={{
      gridColumn:'span 3',
      background:'var(--bg-1)', border:'1px solid var(--border-0)',
      borderRadius:8, padding:'16px 18px'
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14}}>
        <span style={{fontFamily:'var(--sans)', fontSize:10, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', color:'var(--text-3)'}}>This week · שָׁבוּעַ</span>
        <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-2)'}}>
          {days.reduce((s,d)=>s+d.pnl_cents,0) >= 0 ? '+' : ''}${(days.reduce((s,d)=>s+d.pnl_cents,0)/100).toFixed(2)}
        </span>
      </div>
      <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', height:60, gap:4}}>
        {days.map((d, i) => {
          const h = max > 0 ? (Math.abs(d.pnl_cents) / max) * 56 : 2;
          const profit = d.pnl_cents >= 0;
          const shabbat = i === 6;
          return (
            <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
              <div style={{
                width:'100%', height: Math.max(h, 2),
                background: shabbat ? 'rgba(197,168,85,.3)' : (profit ? '#10b981' : '#f43f5e'),
                borderRadius:'2px 2px 0 0',
                opacity: shabbat ? 0.5 : 1,
              }}/>
            </div>
          );
        })}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', marginTop:6, gap:4}}>
        {HEBREW_DAYS.map((d,i)=>(
          <div key={i} style={{flex:1, textAlign:'center', fontFamily:'var(--hebrew)', fontSize: i===6?11:10, color: i===6?'var(--gold-0)':'var(--text-3)', fontWeight: i===6?700:400}}>
            {d.slice(0,1)}
          </div>
        ))}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', marginTop:4, gap:4, fontFamily:'var(--mono)', fontSize:8}}>
        {days.map((d,i)=>(
          <div key={i} style={{flex:1, textAlign:'center', color: d.pnl_cents>=0?'#10b981':'#f43f5e', fontVariantNumeric:'tabular-nums'}}>
            {d.pnl_cents>=0?'+':''}{(d.pnl_cents/100).toFixed(0)}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TalmudHero, KavanahBar, HebrewDate, HebrewDayBars, SephirotMark, isChaiMultiple, HEBREW_DAYS, HEBREW_DAYS_EN });
