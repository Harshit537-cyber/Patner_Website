import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const ConsultationChart = ({ data = [] }) => (
  <div className="chart-card">
    <div className="chart-card-header">
      <h3>Consultations this week</h3>
      <span>Calls vs chats</span>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#E5DDEB" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#918898' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#918898' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E5DDEB', fontSize: 13 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="calls" fill="#8B68B5" radius={[4, 4, 0, 0]} name="Calls" />
        <Bar dataKey="chats" fill="#D8B45A" radius={[4, 4, 0, 0]} name="Chats" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ConsultationChart;
