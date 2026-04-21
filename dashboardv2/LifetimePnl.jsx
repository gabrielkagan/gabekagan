// Lifetime P&L chart — cleaner, single y-axis, minimal chrome.

function LifetimePnl({ deposit = 500 }) {
  const data = React.useMemo(() => {
    const days = 56;
    const start = new Date(2026, 1, 24);
    let bal = deposit;
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const rows = [];
    for (let i = 0; i < days; i++) {
      const drift = 1.8;
      const vol = 14;
      const bigLoss = rand() < 0.08 ? -rand() * 35 : 0;
      const bigWin = rand() < 0.14 ? rand() * 28 : 0;
      const daily = drift + (rand() - 0.48) * vol + bigLoss + bigWin;
      bal += daily + (i === 30 ? -45 : 0) + (i === 31 ? -18 : 0);
      if (bal < deposit - 260) bal = deposit - 260 + rand() * 20;
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      rows.push({ date: d, bal: +bal.toFixed(2), pnl: +(bal - deposit).toFixed(2) });
    }
    return rows;
  }, [deposit]);

  const [range, setRange] = React.useState('ALL');
  const [unit, setUnit] = React.useState('$');

  const filtered = React.useMemo(() => {
    if (range === 'ALL') return data;
    const end = data[data.length - 1].date;
    const cutoff = new Date(end);
    if (range === '1M') cutoff.setDate(end.getDate() - 30);
    if (range === '1W') cutoff.setDate(end.getDate() - 7);
    if (range === '1D') cutoff.setDate(end.getDate() - 1);
    return data.filter(d => d.date >= cutoff);
  }, [data, range]);

  const total = filtered[filtered.length - 1].pnl;
  const returnPct = (total / deposit) * 100;
  const trades = 2485;
  const profit = total >= 0;
  const lineColor = profit ? '#34d399' : '#fb7185';

  // chart geometry
  const W = 1200, H = 260;
  const pad = { t: 14, r: 56, b: 22, l: 8 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const yMin = Math.min(...filtered.map(d => d.pnl), -10);
  const yMax = Math.max(...filtered.map(d => d.pnl), 10);
  const yRange = yMax - yMin;
  const yPadded = { min: yMin - yRange * 0.12, max: yMax + yRange * 0.12 };

  const x = (i) => pad.l + (i / (filtered.length - 1)) * iw;
  const y = (v) => pad.t + (1 - (v - yPadded.min) / (yPadded.max - yPadded.min)) * ih;
  const y0 = y(0);

  // step path
  const stepPath = filtered.map((d, i) => {
    if (i === 0) return `M ${x(i).toFixed(1)} ${y(d.pnl).toFixed(1)}`;
    return `H ${x(i).toFixed(1)} V ${y(d.pnl).toFixed(1)}`;
  }).join(' ');
  const areaPath = stepPath + ` V ${y0.toFixed(1)} H ${x(0).toFixed(1)} Z`;

  // ── nice round ticks instead of extremes
  const niceTicks = (min, max, count = 4) => {
    const range = max - min;
    const rough = range / count;
    const mag = Math.pow(10, Math.floor(Math.log10(rough)));
    const normalized = rough / mag;
    let step;
    if (normalized < 1.5) step = 1 * mag;
    else if (normalized < 3) step = 2 * mag;
    else if (normalized < 7) step = 5 * mag;
    else step = 10 * mag;
    const ticks = [];
    const first = Math.ceil(min / step) * step;
    for (let t = first; t <= max; t += step) ticks.push(+t.toFixed(2));
    return ticks;
  };
  const yTicks = niceTicks(yPadded.min, yPadded.max, 4);
  if (!yTicks.includes(0) && yPadded.min < 0 && yPadded.max > 0) yTicks.push(0);

  // x ticks: roughly every 7 days, aligned to weeks
  const xTickIdx = [];
  const step = Math.max(1, Math.floor(filtered.length / 6));
  for (let i = 0; i < filtered.length; i += step) xTickIdx.push(i);
  if (xTickIdx[xTickIdx.length-1] !== filtered.length-1) xTickIdx.push(filtered.length-1);

  const fmtDate = (d) => `${d.getMonth()+1}/${d.getDate()}`;
  const fmtVal = (v) => {
    if (unit === '$') return (v >= 0 ? '' : '-') + '$' + Math.abs(v).toFixed(0);
    return ((v/deposit)*100 >= 0 ? '+' : '') + ((v/deposit)*100).toFixed(1) + '%';
  };

  return (
    <Cell span={12}>
      {/* Header: single line, everything aligned */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, gap:16, flexWrap:'wrap'}}>
        <div style={{display:'flex', alignItems:'baseline', gap:20}}>
          <span style={{fontFamily:'var(--sans)', fontSize:10, fontWeight:600, letterSpacing:1.4, textTransform:'uppercase', color:'var(--text-2)'}}>Lifetime P&amp;L</span>
          <span style={{fontFamily:'var(--mono)', fontSize:22, fontWeight:700, color: lineColor, fontVariantNumeric:'tabular-nums', letterSpacing:-.5}}>
            {total>=0?'+':''}${total.toFixed(2)}
          </span>
          <span style={{fontFamily:'var(--mono)', fontSize:13, fontWeight:600, color: lineColor, fontVariantNumeric:'tabular-nums'}}>
            {returnPct>=0?'+':''}{returnPct.toFixed(2)}%
          </span>
          <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--text-3)', fontVariantNumeric:'tabular-nums'}}>
            {trades.toLocaleString()} trades
          </span>
        </div>
        <div style={{display:'flex', gap:6}}>
          <TabGroup value={unit} onChange={setUnit} options={['$','%']}/>
          <TabGroup value={range} onChange={setRange} options={['1D','1W','1M','ALL']}/>
        </div>
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{width:'100%', height:260, display:'block'}}>
        <defs>
          <linearGradient id="lpnlFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={lineColor} stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* only the zero line gets visible emphasis */}
        {yTicks.map((v,i)=>(
          <line key={i} x1={pad.l} x2={W-pad.r} y1={y(v)} y2={y(v)}
            stroke={v===0 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.035)'}
            strokeWidth={1}/>
        ))}

        {/* area + step line */}
        <path d={areaPath} fill="url(#lpnlFill)"/>
        <path d={stepPath} fill="none" stroke={lineColor} strokeWidth="1.6" strokeLinejoin="miter" strokeLinecap="butt"/>

        {/* right-edge y labels only (clean, no left duplicate) */}
        {yTicks.map((v,i)=>(
          <text key={i} x={W-pad.r+8} y={y(v)+3.5} textAnchor="start"
            fontFamily="var(--mono)" fontSize="10"
            fill={v===0 ? 'var(--text-2)' : 'var(--text-3)'}
            style={{fontVariantNumeric:'tabular-nums'}}>
            {fmtVal(v)}
          </text>
        ))}

        {/* x-axis date labels */}
        {xTickIdx.map((idx,i)=>(
          <text key={i} x={x(idx)} y={H-6} textAnchor={i===0 ? 'start' : i===xTickIdx.length-1 ? 'end' : 'middle'}
            fontFamily="var(--mono)" fontSize="10" fill="var(--text-3)">
            {fmtDate(filtered[idx].date)}
          </text>
        ))}
      </svg>
    </Cell>
  );
}

function TabGroup({ value, onChange, options }) {
  return (
    <div style={{
      display:'inline-flex', padding:2, background:'var(--bg-2)',
      border:'1px solid var(--border-0)', borderRadius:5, fontFamily:'var(--mono)'
    }}>
      {options.map(o => {
        const active = value === o;
        return (
          <button key={o} onClick={()=>onChange(o)} style={{
            padding:'4px 10px', fontSize:10, fontWeight:600, letterSpacing:.5,
            background: active ? 'var(--bg-3)' : 'transparent',
            color: active ? 'var(--text-0)' : 'var(--text-3)',
            border:'none',
            borderRadius:3, cursor:'pointer', fontFamily:'inherit',
            transition:'all .15s'
          }}>{o}</button>
        );
      })}
    </div>
  );
}

Object.assign(window, { LifetimePnl, TabGroup });
