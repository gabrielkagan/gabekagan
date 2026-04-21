// Status pill components — matches current_dashboard.html conventions
const STATUS_STYLES = {
  READY:      { bg: 'rgba(16,185,129,.07)',  fg: '#10b981', bd: 'rgba(16,185,129,.15)' },
  COLLECTING: { bg: 'rgba(56,189,248,.07)',  fg: '#38bdf8', bd: 'rgba(56,189,248,.15)' },
  TRAINING:   { bg: 'rgba(251,191,36,.07)',  fg: '#fbbf24', bd: 'rgba(251,191,36,.15)' },
  HEALTHY:    { bg: 'rgba(16,185,129,.07)',  fg: '#10b981', bd: 'rgba(16,185,129,.15)' },
  KILLED:     { bg: 'rgba(244,63,94,.07)',   fg: '#f43f5e', bd: 'rgba(244,63,94,.15)' },
  SHADOW:     { bg: 'rgba(99,102,241,.15)',  fg: '#a78bfa', bd: 'rgba(99,102,241,.25)' },
  LIVE:       { bg: 'rgba(16,185,129,.07)',  fg: '#10b981', bd: 'rgba(16,185,129,.15)' },
  OFF:        { bg: 'rgba(244,63,94,.07)',   fg: '#f43f5e', bd: 'rgba(244,63,94,.15)' },
  STALE:      { bg: 'rgba(251,191,36,.07)',  fg: '#fbbf24', bd: 'rgba(251,191,36,.15)' },
  WIN:        { bg: 'rgba(16,185,129,.07)',  fg: '#10b981', bd: 'rgba(16,185,129,.15)' },
  LOSS:       { bg: 'rgba(244,63,94,.07)',   fg: '#f43f5e', bd: 'rgba(244,63,94,.15)' },
};

function StatusPill({ status, dot=false, size='sm' }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.READY;
  const pad = size === 'lg' ? '4px 10px' : size === 'xs' ? '1px 5px' : '2px 7px';
  const fs  = size === 'lg' ? 11 : size === 'xs' ? 8 : 9;
  return (
    <span style={{
      fontFamily:'var(--mono)', fontSize:fs, fontWeight:700, letterSpacing:'.8px',
      padding:pad, borderRadius:4, background:s.bg, color:s.fg, border:`1px solid ${s.bd}`,
      display:'inline-flex', alignItems:'center', gap:5, whiteSpace:'nowrap'
    }}>
      {dot && <span style={{width:5, height:5, borderRadius:'50%', background:'currentColor', animation:'kbBlink 2s ease-in-out infinite'}}/>}
      {status}
    </span>
  );
}

function SideChip({ side }) {
  const isYes = side === 'yes' || side === 'YES';
  return <span style={{fontFamily:'var(--mono)', fontWeight:600, color: isYes ? '#10b981' : '#f43f5e'}}>{side.toUpperCase()}</span>;
}

function ResultChip({ result }) {
  return <StatusPill status={result === 'win' ? 'WIN' : 'LOSS'} size='xs'/>;
}

Object.assign(window, { StatusPill, SideChip, ResultChip });
