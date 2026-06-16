import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiDocumentText, HiClock, HiCheckCircle, HiXCircle, HiEye, HiCurrencyDollar } from 'react-icons/hi';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/applications/stats');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="space-y-6">{[1,2,3].map(i => <div key={i} className="h-32 skeleton rounded-xl" />)}</div>;
  if (!data) return <p className="text-muted">Failed to load dashboard data.</p>;

  const { stats, charts, recentApplications } = data;

  const statCards = [
    { label: 'Total Applications', value: stats.total, icon: HiDocumentText, color: 'bg-blue-500' },
    { label: 'Pending', value: stats.pending, icon: HiClock, color: 'bg-yellow-500' },
    { label: 'Under Review', value: stats.underReview, icon: HiEye, color: 'bg-purple-500' },
    { label: 'Approved', value: stats.approved, icon: HiCheckCircle, color: 'bg-green-500' },
    { label: 'Rejected', value: stats.rejected, icon: HiXCircle, color: 'bg-red-500' },
    { label: 'Total Amount', value: `$${Number(stats.totalAmount).toLocaleString()}`, icon: HiCurrencyDollar, color: 'bg-teal-500' },
  ];

  const lineData = {
    labels: charts.dailyApplications.map(d => new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Applications',
      data: charts.dailyApplications.map(d => d.count),
      borderColor: '#1B3A6B',
      backgroundColor: 'rgba(27, 58, 107, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#1B3A6B'
    }]
  };

  const pieData = {
    labels: charts.byLoanType.map(d => d._id?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'),
    datasets: [{ data: charts.byLoanType.map(d => d.count), backgroundColor: ['#1B3A6B', '#C9A84C', '#2ECC71', '#e74c3c', '#9b59b6', '#f39c12'], borderWidth: 0 }]
  };

  const barData = {
    labels: charts.byStatus.map(d => d._id?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'),
    datasets: [{ label: 'Count', data: charts.byStatus.map(d => d.count), backgroundColor: ['#f39c12', '#9b59b6', '#2ECC71', '#e74c3c'], borderRadius: 8, barThickness: 40 }]
  };

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', under_review: 'bg-purple-100 text-purple-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

  return (
    <div>
      {/* Stats Cards */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8" initial="hidden" animate="visible" variants={stagger}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} variants={fadeInUp} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white mb-3`}><Icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-dark">{value}</p>
            <p className="text-xs text-muted mt-1">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-semibold text-dark mb-4">Applications (Last 30 Days)</h3>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-heading font-semibold text-dark mb-4 text-sm">By Loan Type</h3>
            <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } }} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-heading font-semibold text-dark mb-4 text-sm">By Status</h3>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-heading font-semibold text-dark">Recent Applications</h3>
          <Link to="/admin/applications" className="text-sm text-primary font-medium hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted">App ID</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Applicant</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Loan Type</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Amount</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map(app => (
                <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4"><Link to={`/admin/applications/${app._id}`} className="text-primary font-medium hover:underline">{app.applicationId}</Link></td>
                  <td className="px-6 py-4">{app.personalInfo.firstName} {app.personalInfo.lastName}</td>
                  <td className="px-6 py-4 capitalize">{app.loanDetails.type.replace('-', ' ')}</td>
                  <td className="px-6 py-4 font-medium">${Number(app.loanDetails.amount).toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>{app.status.replace('_', ' ')}</span></td>
                  <td className="px-6 py-4 text-muted">{new Date(app.createdAt).toLocaleDateString('en-US')}</td>
                </tr>
              ))}
              {recentApplications.length === 0 && <tr><td colSpan="6" className="px-6 py-10 text-center text-muted">No applications yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
