import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const EarningsChart = ({ data = [] }) => (
  <div className="chart-card">
    <div className="chart-card-header">
      <h3>Earnings trend</h3>
      <span>Last 6 months</span>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#E5DDEB" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#918898' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#918898' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: '1px solid #E5DDEB', fontSize: 13 }}
          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Earnings']}
        />
        <Line type="monotone" dataKey="value" stroke="#6B3FA0" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default EarningsChart;
