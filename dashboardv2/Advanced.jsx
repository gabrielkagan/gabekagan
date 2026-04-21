// Advanced analytics cells — denser, more data, Jewish accents
function RiskMetrics({ r }) {
  const items = [
    {l:'Sharpe 30d', v:r.sharpe_30d.toFixed(2), k:'שַׁ'},
    {l:'Max DD', v:r.max_drawdown_pct.toFixed(1)+'%', k:'ד'},
    {l:'Profit factor', v:r.profit_factor.toFixed(1)+'×', k:'ר'},
    {l:'Avg win', v:'+$'+(r.avg_win_cents/100).toFixed(2), k:'ז'},
    {l:'Avg loss', v:'$'+(r.avg_loss_cents/100).toFixed(2), k:'ח'},
  ];
  return (
    <Cell span={4} title="Risk · סִכּוּן" meta="guardrails">
      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:6}}>
        {items.map((m,i)=>(
          <div key={i} style={{padding:'9px 11px', background:'var(--bg-2)', border:'1px solid var(--border-0)', borderRadius:6, position:'relative'}}>
            <span style={{position:'absolute', top:4, right:6, fontFamily:'var(--hebrew)', fontSize:10, color:'var(--gold-0)', opacity:.4}}>{m.k}</span>
            <div style={{fontFamily:'var(--sans)', fontSize:9, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.5px'}}>{m.l}</div>
            <div style={{fontFamily:'var(--mono)', fontSize:15, fontWeight:700, color:'var(--text-0)', marginTop:2, fontVariantNumeric:'tabular-nums'}}>{m.v}</div>
          </div>
        ))}
      </div>
    </Cell>
  );
}

function STCPerformance({ stc }) {
  return (
    <Cell span={6} title="STC buckets · close-to-settle">
      <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'var(--mono)', fontSize:11}}>
        <thead><tr>
          {['Window','n','WR','PnL',''].map(h=>(<th key={h} style={{textAlign:'left', fontFamily:'var(--sans)', fontSize:9, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-3)', padding:'5px 6px', borderBottom:'1px solid var(--border-0)'}}>{h}</th>))}
        </tr></thead>
        <tbody>
          {Object.entries(stc).map(([k,v])=>{
            const label = k.replace('_','–').replace('s','s');
            return (
              <tr key={k} style={{background:v.shadow_only?'rgba(167,139,250,.04)':'transparent'}}>
                <td style={{padding:'6px', color:'var(--text-1)'}}>{label}</td>
                <td style={{padding:'6px', color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>{v.n}</td>
                <td style={{padding:'6px', color:'#10b981', fontWeight:600, fontVariantNumeric:'tabular-nums'}}>{(v.wr*100).toFixed(1)}%</td>
                <td style={{padding:'6px', color: v.pnl_cents>=0?'#10b981':'#f43f5e', fontVariantNumeric:'tabular-nums'}}>{v.pnl_cents>=0?'+':''}${(v.pnl_cents/100).toFixed(0)}</td>
                <td style={{padding:'6px'}}>{v.shadow_only && <StatusPill status='SHADOW' size='xs'/>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Cell>
  );
}

function OrderFlow({ order }) {
  return (
    <Cell span={3} title={`Order · ${order.mode}`} meta={order.ticker}>
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        <div>
          <div style={{display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:10, color:'var(--text-2)', marginBottom:6}}>
            <span>BUY {order.total} @ {order.price}¢</span>
            <span style={{color:'#10b981', fontWeight:700}}>{order.total > 0 ? Math.round(order.filled/order.total*100) : 0}% filled</span>
          </div>
          <div style={{height:8, borderRadius:4, background:'var(--bg-3)', overflow:'hidden'}}>
            <div style={{height:'100%', width:`${order.total > 0 ? (order.filled/order.total*100) : 0}%`, background:'linear-gradient(90deg,#10b981,#fbbf24)'}}/>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, fontFamily:'var(--mono)'}}>
          {[
            {l:'Maker',v:order.filled,c:'#10b981'},
            {l:'Rest',v:order.total-order.filled,c:'#fbbf24'},
            {l:'TTC',v:order.ttc,c:'var(--text-0)'},
            {l:'Slip',v:order.slip+'¢',c:'var(--text-1)'},
          ].map((m,i)=>(
            <div key={i} style={{padding:'7px 8px', background:'var(--bg-2)', borderRadius:5, border:'1px solid var(--border-0)', textAlign:'center'}}>
              <div style={{color:'var(--text-3)', fontSize:9, letterSpacing:'.5px', textTransform:'uppercase', fontFamily:'var(--sans)'}}>{m.l}</div>
              <div style={{color:m.c, fontSize:13, fontWeight:700, marginTop:2, fontVariantNumeric:'tabular-nums'}}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </Cell>
  );
}

function CapitalAlloc({ alloc, util }) {
  const total = Object.values(alloc).reduce((a,b)=>a+b,0);
  const colors = { BTC:'#f7931a', ETH:'#849dff', SOL:'#b86eff', XRP:'#23c4d8', weather:'#a78bfa' };
  return (
    <Cell span={3} title="Capital · הוֹן">
      <div style={{fontFamily:'var(--mono)', fontSize:24, fontWeight:700, color:'var(--text-0)', lineHeight:1, marginBottom:10, fontVariantNumeric:'tabular-nums'}}>{(util*100).toFixed(0)}%</div>
      <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', marginBottom:12}}>utilization</div>
      <div style={{display:'flex', flexDirection:'column', gap:4}}>
        {Object.entries(alloc).map(([k,v])=>(
          <div key={k} style={{display:'flex', alignItems:'center', gap:8, fontFamily:'var(--mono)', fontSize:10}}>
            <span style={{width:6, height:6, borderRadius:'50%', background:colors[k]||'var(--text-3)'}}/>
            <span style={{flex:1, color:'var(--text-2)'}}>{k}</span>
            <span style={{color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>${v.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </Cell>
  );
}

function EquitySparkline({ history, balance }) {
  const vals = history.map(h=>h.bal);
  const min = Math.min(...vals), max = Math.max(...vals);
  const w = 280, h = 60;
  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*w},${h-((v-min)/(max-min||1))*h}`).join(' ');
  return (
    <Cell span={3} title="Equity · recent" meta={`${vals.length} ticks`}>
      <div style={{display:'flex', gap:20, alignItems:'center'}}>
        <div>
          <div style={{fontFamily:'var(--mono)', fontSize:26, fontWeight:700, color:'var(--text-0)', fontVariantNumeric:'tabular-nums', letterSpacing:-.5}}>${balance.toFixed(2)}</div>
          <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', marginTop:4}}>min ${min.toFixed(2)} · max ${max.toFixed(2)}</div>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} style={{flex:1, height:60, maxWidth:320}} preserveAspectRatio='none'>
          <defs><linearGradient id='egrad' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#10b981' stopOpacity='.35'/>
            <stop offset='100%' stopColor='#10b981' stopOpacity='0'/>
          </linearGradient></defs>
          <polygon points={`0,${h} ${pts} ${w},${h}`} fill='url(#egrad)'/>
          <polyline points={pts} fill='none' stroke='#10b981' strokeWidth='1.5'/>
        </svg>
      </div>
    </Cell>
  );
}

function DailyPnlBars({ days }) {
  const max = Math.max(...days.map(d=>Math.abs(d.pnl_cents))) || 1;
  const total = days.reduce((s,d)=>s+d.pnl_cents, 0);
  const H = 80;
  return (
    <Cell span={3} title="Daily PnL · 7d" meta={`${total>=0?'+':''}$${(total/100).toFixed(2)}`}>
      <div style={{position:'relative', height:H, marginBottom:8}}>
        {/* center zero line */}
        <div style={{position:'absolute', left:0, right:0, top:'50%', height:1, background:'var(--border-1)', opacity:.5}}/>
        <div style={{display:'flex', alignItems:'stretch', gap:5, height:'100%'}}>
          {days.map((d,i)=>{
            const pct = Math.abs(d.pnl_cents)/max;
            const up = d.pnl_cents >= 0;
            const barH = pct * (H/2 - 2);
            return (
              <div key={i} style={{flex:1, position:'relative'}}>
                <div style={{
                  position:'absolute',
                  left:0, right:0,
                  ...(up
                    ? {bottom:'50%', height:barH, background:'#10b981', borderRadius:'2px 2px 0 0'}
                    : {top:'50%', height:barH, background:'#f43f5e', borderRadius:'0 0 2px 2px'}
                  )
                }}/>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:9, color:'var(--text-3)', gap:5}}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((l,i)=>(
          <span key={l} style={{flex:1, textAlign:'center'}}>{l}</span>
        ))}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:9, gap:5, marginTop:2, fontVariantNumeric:'tabular-nums'}}>
        {days.map((d,i)=>(
          <span key={i} style={{flex:1, textAlign:'center', color: d.pnl_cents>=0?'#10b981':'#f43f5e'}}>
            {d.pnl_cents>=0?'+':''}{(d.pnl_cents/100).toFixed(0)}
          </span>
        ))}
      </div>
    </Cell>
  );
}

function Counterfactual({ cf }) {
  return (
    <Cell span={6} title="Counterfactual">
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12}}>
        <div style={{padding:'11px', borderRadius:6, background:'rgba(16,185,129,.07)', border:'1px solid rgba(16,185,129,.15)', textAlign:'center'}}>
          <div style={{fontSize:9, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-3)', marginBottom:4}}>Missed</div>
          <div style={{fontFamily:'var(--mono)', fontSize:18, fontWeight:700, color:'#10b981', fontVariantNumeric:'tabular-nums'}}>+${(cf.missed/100).toFixed(0)}</div>
        </div>
        <div style={{padding:'11px', borderRadius:6, background:'rgba(56,189,248,.07)', border:'1px solid rgba(56,189,248,.15)', textAlign:'center'}}>
          <div style={{fontSize:9, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-3)', marginBottom:4}}>Avoided</div>
          <div style={{fontFamily:'var(--mono)', fontSize:18, fontWeight:700, color:'#38bdf8', fontVariantNumeric:'tabular-nums'}}>${(cf.avoided/100).toFixed(0)}</div>
        </div>
        <div style={{padding:'11px', borderRadius:6, background:'var(--bg-2)', border:'1px solid var(--border-0)', textAlign:'center'}}>
          <div style={{fontSize:9, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-3)', marginBottom:4}}>Net</div>
          <div style={{fontFamily:'var(--mono)', fontSize:18, fontWeight:700, color: cf.net>=0?'#10b981':'#f43f5e', fontVariantNumeric:'tabular-nums'}}>{cf.net>=0?'+':''}${(cf.net/100).toFixed(0)}</div>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6}}>
        {cf.buckets.map((b,i)=>(
          <div key={i} style={{padding:'8px', background:'var(--bg-2)', border:'1px solid var(--border-0)', borderRadius:5, textAlign:'center'}}>
            <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-2)', marginBottom:4}}>{b.range}</div>
            <div style={{fontFamily:'var(--mono)', fontSize:14, fontWeight:700, color: b.wr>.9?'#10b981':b.wr>.7?'#fbbf24':'#f43f5e', fontVariantNumeric:'tabular-nums'}}>{(b.wr*100).toFixed(0)}%</div>
            <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--text-3)', marginTop:2}}>BE {(b.be*100).toFixed(0)}%</div>
          </div>
        ))}
      </div>
    </Cell>
  );
}

function DecidedContractTiers({ tiers }) {
  return (
    <Cell span={6} title="Decided contract · T1/T2 live">
      <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'var(--mono)', fontSize:11}}>
        <thead><tr>
          {['Tier','Wins','Losses','WR','PnL','Bar'].map(h=>(<th key={h} style={{textAlign:'left', fontFamily:'var(--sans)', fontSize:9, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-3)', padding:'5px 8px', borderBottom:'1px solid var(--border-0)'}}>{h}</th>))}
        </tr></thead>
        <tbody>
          {Object.entries(tiers).map(([k,v],i)=>{
            const wr = v.wins/(v.wins+v.losses);
            return (
              <tr key={k} style={{background: i%2?'rgba(255,255,255,.015)':'transparent'}}>
                <td style={{padding:'7px 8px', color:'var(--text-0)', fontWeight:600}}>{k}</td>
                <td style={{padding:'7px 8px', color:'#10b981', fontVariantNumeric:'tabular-nums'}}>{v.wins}</td>
                <td style={{padding:'7px 8px', color:'#f43f5e', fontVariantNumeric:'tabular-nums'}}>{v.losses}</td>
                <td style={{padding:'7px 8px', color:'var(--text-1)', fontVariantNumeric:'tabular-nums'}}>{(wr*100).toFixed(1)}%</td>
                <td style={{padding:'7px 8px', color: v.pnl_cents>=0?'#10b981':'#f43f5e', fontWeight:600, fontVariantNumeric:'tabular-nums'}}>+${(v.pnl_cents/100).toFixed(0)}</td>
                <td style={{padding:'7px 8px', width:100}}>
                  <div style={{height:4, background:'var(--bg-3)', borderRadius:2, overflow:'hidden'}}>
                    <div style={{height:'100%', width:`${wr*100}%`, background:'linear-gradient(90deg,#059669,#10b981)'}}/>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Cell>
  );
}

function LossClustering({ lc }) {
  return (
    <Cell span={4} title="Loss bursts · 30d">
      <div style={{fontFamily:'var(--mono)', fontSize:26, fontWeight:700, color:'var(--text-0)', lineHeight:1, fontVariantNumeric:'tabular-nums'}}>{lc.bursts_30d}</div>
      <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', marginTop:4}}>{lc.losses_in_bursts_30d} losses clustered</div>
      <div style={{marginTop:12, padding:'8px 10px', background: lc.cooldown_active?'rgba(244,63,94,.07)':'var(--bg-2)', border:`1px solid ${lc.cooldown_active?'rgba(244,63,94,.15)':'var(--border-0)'}`, borderRadius:5, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontFamily:'var(--sans)', fontSize:9, textTransform:'uppercase', letterSpacing:'.8px', color:'var(--text-3)'}}>Cooldown</span>
        <span style={{fontFamily:'var(--mono)', fontSize:11, fontWeight:700, color: lc.cooldown_active?'#f43f5e':'#10b981'}}>{lc.cooldown_active?'ACTIVE':'OFF'}</span>
      </div>
    </Cell>
  );
}

function SystemHealth({ sys, disk, rate }) {
  return (
    <Cell span={4} title="System · בָּרִיא">
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {[
          {l:'CPU', v:sys.cpu_pct.toFixed(1)+'%', pct:sys.cpu_pct, warn:80},
          {l:'MEM', v:sys.mem_pct.toFixed(1)+'%', pct:sys.mem_pct, warn:85},
          {l:'DISK', v:disk.toFixed(1)+'GB free', pct:100-(disk/50*100), warn:70},
          {l:'READS', v:rate.reads_per_sec.toFixed(1)+'/s', pct:(rate.reads_per_sec/rate.limit_reads)*100, warn:80},
        ].map((m,i)=>{
          const color = m.pct > m.warn ? '#f43f5e' : m.pct > m.warn*.7 ? '#fbbf24' : '#10b981';
          return (
            <div key={i}>
              <div style={{display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:10, marginBottom:3}}>
                <span style={{color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.5px'}}>{m.l}</span>
                <span style={{color:'var(--text-1)', fontWeight:600, fontVariantNumeric:'tabular-nums'}}>{m.v}</span>
              </div>
              <div style={{height:4, borderRadius:2, background:'var(--bg-3)', overflow:'hidden'}}>
                <div style={{height:'100%', width:`${Math.min(m.pct,100)}%`, background:color}}/>
              </div>
            </div>
          );
        })}
      </div>
    </Cell>
  );
}

function ObservationMode({ sports, weather }) {
  return (
    <Cell span={12} shadow title="Observation · תַּצְפִּית">
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
        <div>
          <div style={{fontFamily:'var(--sans)', fontSize:9, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-2)', marginBottom:8}}>Sports SPRT</div>
          {Object.entries(sports).map(([k,v])=>(
            <div key={k} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,.02)', fontFamily:'var(--mono)', fontSize:10}}>
              <span style={{color:'var(--text-1)', textTransform:'capitalize'}}>{k}</span>
              <span style={{color:'var(--text-2)', fontVariantNumeric:'tabular-nums'}}>n={v.signals}</span>
              <span style={{color:'#10b981', fontVariantNumeric:'tabular-nums'}}>{(v.wr*100).toFixed(0)}%</span>
              <StatusPill status='COLLECTING' size='xs'/>
            </div>
          ))}
        </div>
        <div>
          <div style={{fontFamily:'var(--sans)', fontSize:9, fontWeight:600, letterSpacing:'.8px', textTransform:'uppercase', color:'var(--text-2)', marginBottom:8}}>Weather ensemble</div>
          <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--text-1)', display:'flex', flexDirection:'column', gap:5}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-3)'}}>Cities active</span><span style={{fontWeight:600, fontVariantNumeric:'tabular-nums'}}>{weather.cities_active}</span></div>
            <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-3)'}}>Ensemble members</span><span style={{fontWeight:600, fontVariantNumeric:'tabular-nums'}}>{weather.ensemble_members}</span></div>
            <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-3)'}}>Rows today</span><span style={{fontWeight:600, fontVariantNumeric:'tabular-nums'}}>{weather.rows_today.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </Cell>
  );
}

function AskDistribution({ dist }) {
  return (
    <Cell span={6} title="Ask dist · 55–74¢">
      <div style={{display:'flex', flexDirection:'column', gap:5, marginBottom:10}}>
        {dist.map((b,i)=>(
          <div key={i} style={{display:'flex', alignItems:'center', gap:8, fontFamily:'var(--mono)', fontSize:10}}>
            <span style={{width:32, textAlign:'right', color:'var(--text-2)'}}>{b.range}</span>
            <div style={{flex:1, height:14, borderRadius:3, background:'var(--bg-3)', overflow:'hidden'}}>
              <div style={{height:'100%', width:`${b.pct}%`, background: b.sweet?'#10b981':'var(--text-3)', opacity: b.sweet?.7:.4}}/>
            </div>
            <span style={{width:22, color:'var(--text-1)', fontWeight:600, fontVariantNumeric:'tabular-nums'}}>{b.n}</span>
          </div>
        ))}
      </div>
    </Cell>
  );
}

Object.assign(window, { RiskMetrics, STCPerformance, OrderFlow, CapitalAlloc, EquitySparkline, DailyPnlBars, Counterfactual, DecidedContractTiers, LossClustering, SystemHealth, ObservationMode, AskDistribution });
