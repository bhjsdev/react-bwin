import { useRef, useState } from 'react'
import { Window, BUILTIN_ACTIONS } from 'react-bwin'
import 'react-bwin/react-bwin.css'

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  const isUp = trend.startsWith('+')
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-trend ${isUp ? 'up' : 'down'}`}>{trend}</div>
    </div>
  )
}

function StatsPanel() {
  return (
    <div className="stats-panel">
      <StatCard label="Revenue" value="$48,290" trend="+12.5%" />
      <StatCard label="Orders" value="1,423" trend="+8.2%" />
      <StatCard label="Users" value="9,841" trend="+23.1%" />
      <StatCard label="Bounce Rate" value="32.4%" trend="-4.3%" />
    </div>
  )
}

function BarChart() {
  const data = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 80 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 90 },
    { label: 'Fri', value: 72 },
    { label: 'Sat', value: 55 },
    { label: 'Sun', value: 40 },
  ]
  const max = Math.max(...data.map(d => d.value))

  return (
    <div className="chart-container">
      <div className="chart-title">Weekly Traffic</div>
      <div className="bar-chart">
        {data.map(d => (
          <div key={d.label} className="bar-col">
            <div className="bar" style={{ height: `${(d.value / max) * 100}%` }} />
            <div className="bar-label">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivityList() {
  const items = [
    { time: '2m ago', text: 'New user registered', type: 'user' },
    { time: '5m ago', text: 'Order #1423 completed', type: 'order' },
    { time: '12m ago', text: 'Payment received $299', type: 'payment' },
    { time: '18m ago', text: 'Server CPU spike 92%', type: 'alert' },
    { time: '25m ago', text: 'Deployment v2.4.1 live', type: 'deploy' },
    { time: '1h ago', text: 'New user registered', type: 'user' },
    { time: '1h ago', text: 'Order #1420 refunded', type: 'order' },
  ]

  const icons: Record<string, string> = {
    user: '\u{1F464}',
    order: '\u{1F4E6}',
    payment: '\u{1F4B0}',
    alert: '⚠️',
    deploy: '\u{1F680}',
  }

  return (
    <div className="activity-list">
      <div className="chart-title">Activity Feed</div>
      <ul className="activity-items">
        {items.map((item, i) => (
          <li key={i} className="activity-item">
            <span className="activity-icon">{icons[item.type]}</span>
            <span className="activity-text">{item.text}</span>
            <span className="activity-time">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DonutChart() {
  const segments = [
    { label: 'Direct', pct: 35, color: '#6366f1' },
    { label: 'Organic', pct: 28, color: '#22c55e' },
    { label: 'Referral', pct: 22, color: '#f59e0b' },
    { label: 'Social', pct: 15, color: '#ef4444' },
  ]

  let offset = 0
  const radius = 40
  const circumference = 2 * Math.PI * radius

  return (
    <div className="chart-container">
      <div className="chart-title">Traffic Sources</div>
      <div className="donut-wrapper">
        <svg viewBox="0 0 100 100" className="donut-svg">
          {segments.map(seg => {
            const dash = (seg.pct / 100) * circumference
            const gap = circumference - dash
            const currentOffset = offset
            offset += dash
            return (
              <circle
                key={seg.label}
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-currentOffset}
              />
            )
          })}
        </svg>
        <div className="donut-legend">
          {segments.map(seg => (
            <div key={seg.label} className="legend-item">
              <span className="legend-dot" style={{ background: seg.color }} />
              {seg.label} ({seg.pct}%)
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DataTable() {
  const rows = [
    { page: '/home', views: '4,231', bounce: '28%' },
    { page: '/pricing', views: '2,103', bounce: '45%' },
    { page: '/docs', views: '1,842', bounce: '12%' },
    { page: '/blog', views: '1,521', bounce: '33%' },
    { page: '/about', views: '892', bounce: '52%' },
  ]
  return (
    <div className="data-table-wrapper">
      <div className="chart-title">Top Pages</div>
      <table className="data-table">
        <thead><tr><th>Page</th><th>Views</th><th>Bounce</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.page}><td>{r.page}</td><td>{r.views}</td><td>{r.bounce}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LiveMetric() {
  return (
    <div className="live-metric">
      <div className="chart-title">Active Users</div>
      <div className="metric-value">247</div>
      <div className="metric-sub">online right now</div>
    </div>
  )
}

function ServerLog() {
  const logs = [
    '[INFO]  GET /api/users 200 12ms',
    '[INFO]  POST /api/orders 201 45ms',
    '[WARN]  GET /api/products 304 8ms',
    '[INFO]  GET /api/stats 200 23ms',
    '[ERROR] POST /api/pay 500 120ms',
    '[INFO]  GET /api/users 200 11ms',
  ]
  return (
    <div className="server-log">
      <div className="chart-title">Server Log</div>
      <pre className="log-content">{logs.join('\n')}</pre>
    </div>
  )
}

const widgetOptions = [
  { id: 'table', label: 'Data Table' },
  { id: 'metric', label: 'Live Metric' },
  { id: 'log', label: 'Server Log' },
]

const widgetComponents: Record<string, () => JSX.Element> = {
  table: DataTable,
  metric: LiveMetric,
  log: ServerLog,
}

let counter = 0

export default function App() {
  const windowRef = useRef<WindowHandle>(null)
  const [selectedWidget, setSelectedWidget] = useState('table')

  function handleAddWidget() {
    counter++
    const Widget = widgetComponents[selectedWidget]
    windowRef.current?.addPane('stats', {
      position: 'bottom',
      size: 0.4,
      title: `${widgetOptions.find(w => w.id === selectedWidget)?.label} #${counter}`,
      content: <Widget />,
      draggable: true,
      droppable: true,
    })
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Analytics Dashboard</h1>
        <div className="dashboard-actions">
          <select
            className="widget-select"
            value={selectedWidget}
            onChange={e => setSelectedWidget(e.target.value)}
          >
            {widgetOptions.map(w => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
          <button className="add-btn" onClick={handleAddWidget}>+ Add Widget</button>
        </div>
      </header>
      <div className="dashboard-body">
        <Window
          ref={windowRef}
          fitContainer
          panes={[
            {
              id: 'stats',
              position: 'top',
              size: 0.2,
              title: 'Overview',
              content: <StatsPanel />,
              actions: null,
              draggable: false,
              droppable: true,
            },
            {
              position: 'bottom',
              children: [
                {
                  id: 'chart',
                  position: 'left',
                  size: '50%',
                  title: 'Traffic',
                  content: <BarChart />,
                  actions: [...BUILTIN_ACTIONS],
                  draggable: true,
                  droppable: true,
                },
                {
                  position: 'right',
                  children: [
                    {
                      id: 'donut',
                      position: 'top',
                      size: '55%',
                      title: 'Sources',
                      content: <DonutChart />,
                      actions: [...BUILTIN_ACTIONS],
                      draggable: true,
                      droppable: true,
                    },
                    {
                      id: 'activity',
                      position: 'bottom',
                      title: 'Activity',
                      content: <ActivityList />,
                      actions: [...BUILTIN_ACTIONS],
                      draggable: true,
                      droppable: true,
                    },
                  ],
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}
