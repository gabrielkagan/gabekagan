// Core cells: Cell (wrapper), Hero balance, WinLoss, Shadow strat, Feed health, Positions, Trades
function Cell({ span=12, shadow=false, profit=false, children, title, meta }) {
  return (
    <div style={{
      gridColumn: `span ${span}`,
      background:'var(--bg-1)', border:'1px solid var(--border-0)',
      borderRadius:8, padding:'12px 14px', position:'relative',
      display:'flex', flexDirection:'column',
      ...(shadow ? {borderLeft:'3px solid #a78bfa', opacity:.94} : {}),
      ...(profit ? {borderLeft:'2px solid #10b981', boxShadow:'inset 4px 0 12px rgba(16,185,129,.08)'} : {}),
    }}>
      {shadow && <span style={{position:'absolute', top:8, right:10, fontFamily:'var(--mono)', fontSize:8, fontWeight:700, letterSpacing:1, padding:'2px 6px', borderRadius:3, background:'rgba(99,102,241,.15)', color:'#a78bfa', border:'1px solid rgba(99,102,241,.25)'}}>SHADOW</span>}
      {title && (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
          <span style={{fontFamily:'var(--sans)', fontSize:10, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', color:'var(--text-3)'}}>{title}</span>
          {meta && <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-2)'}}>{meta}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function HeroBalance({ balance, peak, daily, dailyPct }) {
  return (
    <Cell span={6} profit={daily > 0}>
      <div style={{fontFamily:'var(--sans)', fontSize:10, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', color:'var(--text-3)', marginBottom:8}}>Current balance</div>
      <div style={{fontFamily:'var(--mono)', fontSize:44, fontWeight:700, letterSpacing:-2, color:'var(--text-0)', fontVariantNumeric:'tabular-nums', lineHeight:1}}>${balance.toFixed(2)}</div>
      <div style={{display:'flex', gap:20, marginTop:12, fontFamily:'var(--mono)', fontSize:11}}>
        <span style={{color: daily >= 0 ? '#10b981' : '#f43f5e', fontWeight:600}}>
          {daily >= 0 ? '▲' : '▼'} ${(Math.abs(daily)/100).toFixed(2)} today ({dailyPct >= 0 ? '+' : ''}{dailyPct.toFixed(2)}%)
        </span>
        <span style={{color:'var(--text-3)'}}>peak ${peak.toFixed(2)}</span>
      </div>
    </Cell>
  );
}

function WinLossCell({ wins, losses, rate, streak }) {
  const pct = (rate * 100).toFixed(1);
  return (
    <Cell span={3} title="Win rate · 15M">
      <div style={{fontFamily:'var(--mono)', fontSize:34, fontWeight:700, color:'var(--text-0)', lineHeight:1, fontVariantNumeric:'tabular-nums'}}>{pct}%</div>
      <div style={{display:'flex', gap:8, marginTop:8, fontFamily:'var(--mono)', fontSize:11}}>
        <span style={{color:'#10b981'}}>{wins}W</span>
        <span style={{color:'var(--text-3)'}}>/</span>
        <span style={{color:'#f43f5e'}}>{losses}L</span>
      </div>
      <div style={{height:6, borderRadius:3, background:'var(--bg-3)', overflow:'hidden', marginTop:12}}>
        <div style={{height:'100%', width:`${rate*100}%`, background:'linear-gradient(90deg,#059669,#10b981)'}}/>
      </div>
      {streak > 0 && <div style={{marginTop:8, fontFamily:'var(--mono)', fontSize:10, color:'#fbbf24'}}>🔥 {streak} win streak</div>}
    </Cell>
  );
}

function SpotStrip({ prices, vols }) {
  return (
    <Cell span={3} title="Spot">
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        {Object.entries(prices).map(([k, v]) => {
          const vol = vols?.[k];
          const color = { BTC:'#f7931a', ETH:'#849dff', SOL:'#b86eff', XRP:'#23c4d8' }[k];
          return (
            <div key={k} style={{display:'flex', alignItems:'center', gap:10, fontFamily:'var(--mono)', fontSize:12}}>
              <span style={{width:6, height:6, borderRadius:'50%', background:color}}/>
              <span style={{fontWeight:700, color:'var(--text-0)', width:34}}>{k}</span>
              <span style={{color:'var(--text-1)', fontVariantNumeric:'tabular-nums', flex:1}}>${v.toLocaleString(undefined, {maximumFractionDigits: v < 10 ? 2 : 0})}</span>
              {vol && <span style={{fontSize:9, color: vol.regime === 'low' ? '#10b981' : vol.regime === 'med' ? '#fbbf24' : '#f43f5e'}}>σ{(vol.sigma_15m*1000).toFixed(1)}</span>}
            </div>
          );
        })}
      </div>
    </Cell>
  );
}

function ShadowStratCell({ name, signals, wr, simPnl, status }) {
  return (
    <Cell span={3} shadow title={name}>
      <div style={{fontFamily:'var(--mono)', fontSize:26, fontWeight:700, color:'var(--text-0)', lineHeight:1, fontVariantNumeric:'tabular-nums'}}>{(wr*100).toFixed(1)}%</div>
      <div style={{marginTop:8, marginBottom:10, fontFamily:'var(--mono)', fontSize:10, color:'var(--text-2)'}}>n={signals} · sim {simPnl>=0?'+':''}${(simPnl/100).toFixed(2)}</div>
      <StatusPill status={status}/>
    </Cell>
  );
}

function FeedHealth({ feeds }) {
  return (
    <Cell span={3} title="Feed health">
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        {Object.entries(feeds).map(([name, f]) => {
          const ok = f.connected && f.last_msg_age_s < 5;
          const warn = f.connected && f.last_msg_age_s < 30;
          const color = ok ? '#10b981' : warn ? '#fbbf24' : '#f43f5e';
          return (
            <div key={name} style={{display:'flex', alignItems:'center', gap:10, fontFamily:'var(--mono)', fontSize:11}}>
              <span style={{width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 6px ${color}`}}/>
              <span style={{flex:1, color:'var(--text-1)'}}>{name}</span>
              <span style={{color:'var(--text-3)', fontSize:10}}>{f.last_msg_age_s.toFixed(1)}s</span>
            </div>
          );
        })}
      </div>
    </Cell>
  );
}

function PositionsCell({ positions, title='Active positions', span=6, filter }) {
  const rows = filter ? positions.filter(filter) : positions;
  return (
    <Cell span={span} title={title} meta={`${rows.length} open`}>
      <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'var(--mono)', fontSize:12}}>
        <thead>
          <tr>
            {['Ticker','Asset','Side','Qty','Avg','Status'].map(h => (
              <th key={h} style={{textAlign:'left', fontFamily:'var(--sans)', fontSize:10, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-2)', padding:'8px', borderBottom:'1px solid var(--border-1)'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan="6" style={{padding:'16px 8px', color:'var(--text-3)', fontSize:11, fontStyle:'italic', textAlign:'center'}}>no open positions</td></tr>
          ) : rows.map((p, i) => (
            <tr key={i} style={{borderBottom:'1px solid var(--border-0)'}}>
              <td style={{padding:'8px', color:'var(--text-1)', fontSize:10}}>{p.ticker}</td>
              <td style={{padding:'8px', color:'var(--text-0)', fontWeight:600}}>{p.asset}</td>
              <td style={{padding:'8px'}}><SideChip side={p.side}/></td>
              <td style={{padding:'8px', color:'var(--text-0)', fontVariantNumeric:'tabular-nums'}}>{p.count}</td>
              <td style={{padding:'8px', color:'var(--text-0)', fontVariantNumeric:'tabular-nums'}}>{p.avg_price_cents}¢</td>
              <td style={{padding:'8px', color:'var(--text-2)'}}>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Cell>
  );
}

function RecentTrades({ trades }) {
  return (
    <Cell span={12} title="Recent trades" meta={`${trades.length} settled · scroll for more`}>
      <div style={{maxHeight:420, overflowY:'auto'}}>
      <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'var(--mono)', fontSize:12}}>
        <thead style={{position:'sticky', top:0, background:'var(--bg-1)', zIndex:1}}>
          <tr>
            {['Time','Ticker','Asset','Side','Qty','Entry','Edge','Prob','PnL','Result'].map(h => (
              <th key={h} style={{textAlign:'left', fontFamily:'var(--sans)', fontSize:10, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-2)', padding:'9px 10px', borderBottom:'1px solid var(--border-1)'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr key={i} style={{background: i%2 ? 'rgba(255,255,255,.025)' : 'transparent', borderBottom:'1px solid var(--border-0)'}}>
              <td style={{padding:'9px 10px', color:'var(--text-2)', fontSize:11}}>{new Date(t.settled_at).toISOString().slice(11,19)}</td>
              <td style={{padding:'9px 10px', color:'var(--text-1)', fontSize:11}}>{t.ticker}</td>
              <td style={{padding:'9px 10px', color:'var(--text-0)', fontWeight:600}}>{t.asset}</td>
              <td style={{padding:'9px 10px'}}><SideChip side={t.side}/></td>
              <td style={{padding:'9px 10px', color:'var(--text-0)', fontVariantNumeric:'tabular-nums'}}>{t.count}</td>
              <td style={{padding:'9px 10px', color:'var(--text-0)', fontVariantNumeric:'tabular-nums'}}>{t.entry_price_cents}¢</td>
              <td style={{padding:'9px 10px', color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>{(t.edge*100).toFixed(2)}%</td>
              <td style={{padding:'9px 10px', color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>{t.calibrated_prob.toFixed(3)}</td>
              <td style={{padding:'9px 10px', color: t.pnl_cents>=0?'#34d399':'#fb7185', fontWeight:700, fontVariantNumeric:'tabular-nums'}}>{t.pnl_cents>=0?'+':''}${(t.pnl_cents/100).toFixed(2)}</td>
              <td style={{padding:'9px 10px'}}><ResultChip result={t.pnl_cents >= 0 ? 'win' : 'loss'}/></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </Cell>
  );
}

function AllTimePerformance({ balance, deposit, peak, wins, losses, sharpe, profitFactor, maxDD }) {
  const lifetime = balance - deposit;
  const lifetimePct = (lifetime/deposit)*100;
  const roi = lifetimePct;
  const totalTrades = wins + losses;
  const wr = totalTrades > 0 ? (wins/totalTrades)*100 : 0;
  return (
    <Cell span={6} title="All-time performance" meta="lifetime">
      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:10, alignItems:'stretch'}}>
        {/* hero ROI */}
        <div style={{padding:'14px 16px', background:'linear-gradient(135deg, rgba(16,185,129,.08), rgba(16,185,129,.02))', border:'1px solid rgba(16,185,129,.2)', borderRadius:6, display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{fontFamily:'var(--sans)', fontSize:9, fontWeight:600, letterSpacing:1, textTransform:'uppercase', color:'var(--text-3)', marginBottom:4}}>ROI</div>
          <div style={{fontFamily:'var(--mono)', fontSize:30, fontWeight:700, color:'#34d399', lineHeight:1, fontVariantNumeric:'tabular-nums'}}>{roi>=0?'+':''}{roi.toFixed(1)}%</div>
          <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--text-2)', marginTop:6, fontVariantNumeric:'tabular-nums'}}>{lifetime>=0?'+':''}${lifetime.toFixed(2)} · since ${deposit.toFixed(0)}</div>
        </div>
        {/* metric stack */}
        <div style={{display:'flex', flexDirection:'column', gap:6}}>
          <Metric label="Sharpe 30d" value={sharpe.toFixed(2)}/>
          <Metric label="Profit factor" value={profitFactor.toFixed(1)+'×'}/>
          <Metric label="Max DD" value={maxDD.toFixed(1)+'%'} color="#fb7185"/>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:6}}>
          <Metric label="Trades" value={totalTrades}/>
          <Metric label="Win rate" value={wr.toFixed(1)+'%'} color="#34d399"/>
          <Metric label="Peak" value={'$'+peak.toFixed(0)}/>
        </div>
      </div>
    </Cell>
  );
}

function Metric({ label, value, color }) {
  return (
    <div style={{padding:'8px 10px', background:'var(--bg-2)', border:'1px solid var(--border-0)', borderRadius:5}}>
      <div style={{fontFamily:'var(--sans)', fontSize:9, fontWeight:600, letterSpacing:.8, textTransform:'uppercase', color:'var(--text-3)'}}>{label}</div>
      <div style={{fontFamily:'var(--mono)', fontSize:15, fontWeight:700, color: color || 'var(--text-0)', marginTop:2, fontVariantNumeric:'tabular-nums'}}>{value}</div>
    </div>
  );
}

function CalibrationCell({ cal }) {
  return (
    <Cell span={4} title="Calibration health">
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6}}>
        {Object.entries(cal).map(([k, v]) => (
          <div key={k} style={{padding:'10px 12px', background:'var(--bg-2)', border:'1px solid var(--border-0)', borderRadius:6}}>
            <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:6}}>{k}</div>
            <div style={{fontFamily:'var(--mono)', fontSize:14, fontWeight:700, color:'var(--text-0)', fontVariantNumeric:'tabular-nums'}}>B{v.brier.toFixed(3)}</div>
            <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--text-3)', marginTop:4, fontVariantNumeric:'tabular-nums'}}>ECE {v.ece.toFixed(3)} · n={v.n_samples}</div>
            <div style={{marginTop:6}}><StatusPill status={v.status} size='xs'/></div>
          </div>
        ))}
      </div>
    </Cell>
  );
}

function FunnelCell({ funnel }) {
  const max = Math.max(...Object.values(funnel));
  const colors = { scanned:'#5a6b82', edge_too_low:'#f43f5e', price_floor:'#fbbf24', stc_gate:'#fbbf24', cooldown:'#a78bfa', candidate:'#10b981', observation_trade:'#10b981' };
  return (
    <Cell span={4} title="Scanner funnel">
      <div style={{display:'flex', flexDirection:'column', gap:6}}>
        {Object.entries(funnel).map(([k, v]) => (
          <div key={k} style={{display:'flex', alignItems:'center', gap:8, fontFamily:'var(--mono)', fontSize:10}}>
            <span style={{width:100, color:'var(--text-2)'}}>{k}</span>
            <div style={{flex:1, height:12, borderRadius:2, background:'var(--bg-3)', overflow:'hidden'}}>
              <div style={{height:'100%', width:`${(v/max)*100}%`, background:colors[k]||'var(--text-3)'}}/>
            </div>
            <span style={{width:36, textAlign:'right', color:'var(--text-1)', fontWeight:600, fontVariantNumeric:'tabular-nums'}}>{v}</span>
          </div>
        ))}
      </div>
    </Cell>
  );
}

function ExecEngineCell({ exec }) {
  return (
    <Cell span={4} title="Execution engine">
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
        {[
          {l:'Maker fill', v: (exec.maker_fill_rate*100).toFixed(1)+'%'},
          {l:'Taker fill', v: (exec.taker_fill_rate*100).toFixed(1)+'%'},
          {l:'Avg latency', v: exec.avg_fill_latency_s.toFixed(2)+'s'},
          {l:'IOC 24h', v: `${exec.ioc_fills_24h}/${exec.ioc_attempts_24h}`},
        ].map((m, i) => (
          <div key={i} style={{padding:'8px 10px', background:'var(--bg-2)', border:'1px solid var(--border-0)', borderRadius:6}}>
            <div style={{fontFamily:'var(--sans)', fontSize:9, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.5px'}}>{m.l}</div>
            <div style={{fontFamily:'var(--mono)', fontSize:14, fontWeight:600, color:'var(--text-0)', marginTop:2, fontVariantNumeric:'tabular-nums'}}>{m.v}</div>
          </div>
        ))}
      </div>
    </Cell>
  );
}

Object.assign(window, { Cell, HeroBalance, WinLossCell, SpotStrip, ShadowStratCell, FeedHealth, PositionsCell, RecentTrades, CalibrationCell, FunnelCell, ExecEngineCell, AllTimePerformance, Metric, LiveTradeTape });

function LiveTradeTape({ fills }) {
  const relTime = (s) => {
    if (s < 1) return 'now';
    if (s < 60) return `${s}s`;
    const m = Math.floor(s/60), rem = s%60;
    return rem ? `${m}m ${rem}s` : `${m}m`;
  };
  const eventColor = (e) => ({
    FILL:    {bg:'rgba(16,185,129,.12)', fg:'#34d399', bd:'rgba(16,185,129,.3)'},
    PARTIAL: {bg:'rgba(251,191,36,.12)', fg:'#fbbf24', bd:'rgba(251,191,36,.3)'},
    ACK:     {bg:'rgba(132,157,255,.12)', fg:'#849dff', bd:'rgba(132,157,255,.3)'},
    CANCEL:  {bg:'rgba(251,113,133,.1)', fg:'#fb7185', bd:'rgba(251,113,133,.25)'},
  }[e] || {bg:'transparent', fg:'var(--text-2)', bd:'var(--border-1)'});
  const totalFills = fills.filter(f => f.event === 'FILL' || f.event === 'PARTIAL').length;
  const totalQty = fills.filter(f => f.event === 'FILL' || f.event === 'PARTIAL').reduce((a,f)=>a+f.qty, 0);
  return (
    <Cell span={12} title="Live fills · tape" meta={`${totalFills} fills · ${totalQty} contracts · last 5m`}>
      <div style={{position:'relative', maxHeight:280, overflowY:'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'var(--mono)', fontSize:12, tableLayout:'fixed'}}>
          <colgroup>
            <col style={{width:'8%'}}/>
            <col style={{width:'28%'}}/>
            <col style={{width:'8%'}}/>
            <col style={{width:'7%'}}/>
            <col style={{width:'9%'}}/>
            <col style={{width:'9%'}}/>
            <col style={{width:'9%'}}/>
            <col style={{width:'auto'}}/>
          </colgroup>
          <thead style={{position:'sticky', top:0, background:'var(--bg-1)', zIndex:1}}>
            <tr>
              {['Age','Ticker','Asset','Side','Qty','Px','Edge','Event'].map(h => (
                <th key={h} style={{textAlign:'left', fontFamily:'var(--sans)', fontSize:10, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-2)', padding:'8px 10px', borderBottom:'1px solid var(--border-1)'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fills.map((f, i) => {
              const ec = eventColor(f.event);
              const isNew = i === 0;
              return (
                <tr key={i} style={{background: isNew ? 'rgba(16,185,129,.05)' : (i%2 ? 'rgba(255,255,255,.02)' : 'transparent'), borderBottom:'1px solid var(--border-0)'}}>
                  <td style={{padding:'8px 10px', color:'var(--text-2)', fontSize:11, display:'flex', alignItems:'center', gap:6}}>
                    {isNew && <span style={{width:5, height:5, borderRadius:'50%', background:'#34d399', display:'inline-block', animation:'kbBlink 1.2s infinite'}}/>}
                    {relTime(f.t)}
                  </td>
                  <td style={{padding:'8px 10px', color:'var(--text-1)', fontSize:11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{f.ticker}</td>
                  <td style={{padding:'8px 10px', color:'var(--text-0)', fontWeight:600}}>{f.asset}</td>
                  <td style={{padding:'8px 10px'}}><SideChip side={f.side}/></td>
                  <td style={{padding:'8px 10px', color:'var(--text-0)', fontVariantNumeric:'tabular-nums'}}>{f.qty}</td>
                  <td style={{padding:'8px 10px', color:'var(--text-0)', fontVariantNumeric:'tabular-nums'}}>{f.price}¢</td>
                  <td style={{padding:'8px 10px', color:'var(--text-2)', fontVariantNumeric:'tabular-nums'}}>{f.edge != null ? `${(f.edge*100).toFixed(2)}%` : '—'}</td>
                  <td style={{padding:'8px 10px'}}>
                    <span style={{
                      display:'inline-block', padding:'2px 8px', borderRadius:3,
                      background:ec.bg, color:ec.fg, border:`1px solid ${ec.bd}`,
                      fontFamily:'var(--mono)', fontSize:10, fontWeight:700, letterSpacing:.8
                    }}>{f.event}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Cell>
  );
}

Object.assign(window, { LiveTradeTape });
