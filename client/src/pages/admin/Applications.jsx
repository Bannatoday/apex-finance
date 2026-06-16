import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiSearch, HiFilter, HiDownload, HiEye } from 'react-icons/hi';
import api from '../../api';

const statusColors = { pending: 'bg-yellow-100 text-yellow-700', under_review: 'bg-purple-100 text-purple-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', loanType: '', search: '', page: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, limit: 20 };
      if (filters.status) params.status = filters.status;
      if (filters.loanType) params.loanType = filters.loanType;
      if (filters.search) params.search = filters.search;
      const res = await api.get('/applications', { params });
      setApps(res.data.applications);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, [filters.page, filters.status, filters.loanType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, page: 1 }));
    fetchApps();
  };

  const exportCSV = async () => {
    try {
      const res = await api.get('/applications/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-heading font-bold text-dark">Loan Applications</h2>
        <div className="flex gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-dark hover:bg-gray-50">
            <HiFilter className="w-4 h-4" /> Filters
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
            <HiDownload className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Search by name or ID..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
          </div>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Search</button>
        </form>
        {showFilters && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm" value={filters.loanType} onChange={e => setFilters(f => ({ ...f, loanType: e.target.value, page: 1 }))}>
              <option value="">All Loan Types</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="mortgage">Mortgage</option>
              <option value="auto">Auto</option>
              <option value="student">Student</option>
              <option value="debt-consolidation">Debt Consolidation</option>
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-muted">App ID</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Applicant</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Loan Type</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Amount</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Date</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-6 py-3 text-left font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(7)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 skeleton w-20" /></td>)}
                  </tr>
                ))
              ) : apps.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-muted">No applications found.</td></tr>
              ) : (
                apps.map(app => (
                  <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-primary">{app.applicationId}</td>
                    <td className="px-6 py-4">{app.personalInfo.firstName} {app.personalInfo.lastName}</td>
                    <td className="px-6 py-4 capitalize">{app.loanDetails.type.replace('-', ' ')}</td>
                    <td className="px-6 py-4 font-medium">${Number(app.loanDetails.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-muted">{new Date(app.createdAt).toLocaleDateString('en-US')}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>{app.status.replace('_', ' ')}</span></td>
                    <td className="px-6 py-4">
                      <Link to={`/admin/applications/${app._id}`} className="inline-flex items-center gap-1 text-primary hover:underline text-sm">
                        <HiEye className="w-4 h-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-muted">Showing {apps.length} of {pagination.total}</p>
            <div className="flex gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))} className={`w-8 h-8 rounded-lg text-xs font-medium ${pagination.page === i + 1 ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-gray-200'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
