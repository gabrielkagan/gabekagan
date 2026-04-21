// Performance breakdown for 15-min crypto markets — per-asset detail.
// Shows: asset, signals seen, trades taken, win rate, total PnL, avg edge, best tier, equity strip.

function FifteenMinPerformance({ data }) {
  const assets = Object.keys(data);
  const totalPnl = assets.reduce((s,k) => s + data[k].pnl_cents, 0);
  const totalTrades = assets.reduce((s,k) => s + data[k].trades, 0);
  const totalWins = assets.reduce((s,k) => s + data[k].wins, 0);
  const totalSignals = assets.reduce((s,k) => s + data[k].signals, 0);
  const overallWr = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0;

  const assetColor = { BTC:'#f7931a', ETH:'#849dff', SOL:'#b86eff', XRP:'#23c4d8' };

  return (
    <Cell span={12} title="15-minute crypto · performance by asset" meta={`${totalTrades} trades · ${totalSignals.toLocaleString()} signals`}>

      {/* Totals strip */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, marginBottom:14, padding:'10px 12px', background:'var(--bg-2)', border:'1px solid var(--border-0)', borderRadius:6}}>
        <StripStat label="Total PnL" value={`${totalPnl>=0?'+':''}$${(totalPnl/100).toFixed(2)}`} color={totalPnl>=0?'#34d399':'#fb7185'}/>
        <StripStat label="Win rate" value={`${overallWr.toFixed(1)}%`}/>
        <StripStat label="Trades" value={totalTrades.toLocaleString()}/>
        <StripStat label="Signals scanned" value={totalSignals.toLocaleString()}/>
        <StripStat label="Convert" value={`${((totalTrades/totalSignals)*100).toFixed(1)}%`}/>
      </div>

      <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'var(--mono)', fontSize:12}}>
        <thead>
          <tr>
            {['Asset','Signals','Trades','Win rate','Avg edge','Avg hold','Best tier','PnL','Share','Equity'].map(h => (
              <th key={h} style={{textAlign:'left', fontFamily:'var(--sans)', fontSize:10, fontWeight:600, letterSpacing:.8, textTransform:'uppercase', color:'var(--text-2)', padding:'9px 10px', borderBottom:'1px solid var(--border-1)'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((k,i) => {
            const d = data[k];
            const wr = d.trades > 0 ? (d.wins/d.trades)*100 : 0;
            const share = Math.abs(totalPnl) > 0 ? (d.pnl_cents/totalPnl)*100 : 0;
            return (
              <tr key={k} style={{borderBottom:'1px solid var(--border-0)', background: i%2 ? 'rgba(255,255,255,.02)' : 'transparent'}}>
                <td style={{padding:'11px 10px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <span style={{width:8, height:8, borderRadius:'50%', background:assetColor[k]}}/>
                    <span style={{color:'var(--text-0)', fontWeight:700, fontSize:13}}>{k}</span>
                  </div>
                </td>
                <td style={{padding:'11px 10px', color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>{d.signals.toLocaleString()}</td>
                <td style={{padding:'11px 10px', color:'var(--text-0)', fontVariantNumeric:'tabular-nums', fontWeight:600}}>{d.trades}</td>
                <td style={{padding:'11px 10px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <span style={{color: wr>=95 ? '#34d399' : wr>=90 ? 'var(--text-0)' : '#fbbf24', fontWeight:600, fontVariantNumeric:'tabular-nums', minWidth:40}}>{wr.toFixed(1)}%</span>
                    <span style={{fontFamily:'var(--sans)', fontSize:10, color:'var(--text-3)', fontVariantNumeric:'tabular-nums'}}>{d.wins}W / {d.trades-d.wins}L</span>
                  </div>
                </td>
                <td style={{padding:'11px 10px', color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>{(d.avg_edge*100).toFixed(2)}%</td>
                <td style={{padding:'11px 10px', color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>{d.avg_hold_s}s</td>
                <td style={{padding:'11px 10px'}}>
                  <span style={{padding:'3px 8px', background:'rgba(197,168,85,.1)', border:'1px solid rgba(197,168,85,.3)', color:'var(--gold-0)', borderRadius:3, fontFamily:'var(--mono)', fontSize:10, fontWeight:600}}>{d.best_tier}</span>
                </td>
                <td style={{padding:'11px 10px', color: d.pnl_cents>=0?'#34d399':'#fb7185', fontWeight:700, fontVariantNumeric:'tabular-nums', fontSize:13}}>
                  {d.pnl_cents>=0?'+':''}${(d.pnl_cents/100).toFixed(2)}
                </td>
                <td style={{padding:'11px 10px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <div style={{flex:1, height:6, borderRadius:3, background:'var(--bg-3)', overflow:'hidden', minWidth:60}}>
                      <div style={{height:'100%', width:`${Math.abs(share)}%`, background: share>=0?assetColor[k]:'#f43f5e'}}/>
                    </div>
                    <span style={{color:'var(--text-2)', fontSize:10, fontVariantNumeric:'tabular-nums', minWidth:36, textAlign:'right'}}>{share>=0?'+':''}{share.toFixed(0)}%</span>
                  </div>
                </td>
                <td style={{padding:'11px 10px'}}>
                  <MiniEquity points={d.equity} color={assetColor[k]}/>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Cell>
  );
}

function StripStat({ label, value, color }) {
  return (
    <div>
      <div style={{fontFamily:'var(--sans)', fontSize:9, color:'var(--text-3)', letterSpacing:.8, textTransform:'uppercase', fontWeight:600, marginBottom:3}}>{label}</div>
      <div style={{fontFamily:'var(--mono)', fontSize:16, fontWeight:700, color: color || 'var(--text-0)', fontVariantNumeric:'tabular-nums'}}>{value}</div>
    </div>
  );
}

function MiniEquity({ points, color }) {
  const w = 100, h = 24;
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  const last = points[points.length - 1];
  const first = points[0];
  const up = last >= first;
  return (
    <svg width={w} height={h} style={{display:'block'}}>
      <path d={path} stroke={up ? color : '#fb7185'} strokeWidth="1.2" fill="none"/>
    </svg>
  );
}

Object.assign(window, { FifteenMinPerformance, StripStat, MiniEquity });
