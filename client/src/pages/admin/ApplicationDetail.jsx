import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiMail, HiDocumentDownload } from 'react-icons/hi';
import api from '../../api';

const statusColors = { pending: 'bg-yellow-100 text-yellow-700', under_review: 'bg-purple-100 text-purple-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
const statusOptions = ['pending', 'under_review', 'approved', 'rejected'];

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [approved, setApproved] = useState({ approvedAmount: '', interestRate: '', tenure: '', monthlyEmi: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setApp(res.data);
        setNewStatus(res.data.status);
        setNotes(res.data.adminNotes || '');
        if (res.data.approvedDetails) setApproved(res.data.approvedDetails);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    setMessage('');
    try {
      const body = { status: newStatus, adminNotes: notes };
      if (newStatus === 'approved') body.approvedDetails = approved;
      const res = await api.put(`/applications/${id}/status`, body);
      setApp(res.data.application);
      setMessage('Status updated successfully! Email sent to applicant.');
    } catch (err) {
      setMessage('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 skeleton rounded-xl" />)}</div>;
  if (!app) return <p className="text-muted">Application not found.</p>;

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="font-heading font-semibold text-dark mb-4 pb-3 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  );

  const Field = ({ label, value }) => (
    <div><p className="text-xs text-muted uppercase tracking-wider mb-1">{label}</p><p className="font-medium text-dark text-sm">{value || '—'}</p></div>
  );

  return (
    <div>
      <button onClick={() => navigate('/admin/applications')} className="flex items-center gap-2 text-sm text-muted hover:text-primary mb-6"><HiArrowLeft className="w-4 h-4" /> Back to Applications</button>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-dark">{app.applicationId}</h2>
          <p className="text-sm text-muted">Submitted on {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[app.status]}`}>{app.status.replace('_', ' ').toUpperCase()}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Section title="Personal Information">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={`${app.personalInfo.firstName} ${app.personalInfo.lastName}`} />
              <Field label="Email" value={app.personalInfo.email} />
              <Field label="Phone" value={app.personalInfo.phone} />
              <Field label="Date of Birth" value={app.personalInfo.dob} />
              <Field label="SSN (Last 4)" value={`****${app.personalInfo.ssnLast4}`} />
              <Field label="Address" value={`${app.personalInfo.address}, ${app.personalInfo.city}, ${app.personalInfo.state} ${app.personalInfo.zip}`} />
            </div>
          </Section>

          <Section title="Loan Details">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Loan Type" value={app.loanDetails.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
              <Field label="Amount Requested" value={`$${Number(app.loanDetails.amount).toLocaleString()}`} />
              <Field label="Purpose" value={app.loanDetails.purpose} />
              <Field label="Tenure" value={`${app.loanDetails.tenure} months`} />
            </div>
          </Section>

          <Section title="Financial Information">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Employment Status" value={app.financialInfo.employmentStatus.replace(/\b\w/g, l => l.toUpperCase())} />
              <Field label="Employer" value={app.financialInfo.employerName} />
              <Field label="Monthly Income" value={`$${Number(app.financialInfo.monthlyIncome).toLocaleString()}`} />
              <Field label="Credit Score" value={app.financialInfo.creditScore.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} />
              <Field label="Existing Debt" value={`$${Number(app.financialInfo.existingDebt || 0).toLocaleString()}/mo`} />
            </div>
          </Section>

          <Section title="Uploaded Documents">
            <div className="grid sm:grid-cols-2 gap-4">
              {['governmentIdFront', 'governmentIdBack', 'paystub', 'bankStatement'].map(doc => (
                <div key={doc} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm capitalize">{doc.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {app.documents?.[doc] ? (
                    <a href={`/uploads/${app.documents[doc]}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary text-sm hover:underline">
                      <HiDocumentDownload className="w-4 h-4" /> View
                    </a>
                  ) : (
                    <span className="text-xs text-muted">Not uploaded</span>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Email History */}
          {app.emailHistory?.length > 0 && (
            <Section title="Email History">
              <div className="space-y-2">
                {app.emailHistory.map((e, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2"><HiMail className="w-4 h-4 text-primary" /><span className="text-sm capitalize">{e.type.replace('_', ' ')}</span></div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{e.status}</span>
                      <span className="text-xs text-muted">{new Date(e.sentAt).toLocaleString('en-US')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-heading font-semibold text-dark mb-4">Update Status</h3>
            {message && <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-lg text-accent text-sm">{message}</div>}
            
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm mb-4">
              {statusOptions.map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>

            {newStatus === 'approved' && (
              <div className="space-y-3 mb-4 p-4 bg-green-50 rounded-lg">
                <p className="text-xs font-semibold text-green-700 uppercase">Approved Details</p>
                <input type="number" placeholder="Approved Amount" value={approved.approvedAmount} onChange={e => setApproved(a => ({ ...a, approvedAmount: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                <input type="number" step="0.1" placeholder="Interest Rate (%)" value={approved.interestRate} onChange={e => setApproved(a => ({ ...a, interestRate: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                <input type="number" placeholder="Tenure (months)" value={approved.tenure} onChange={e => setApproved(a => ({ ...a, tenure: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                <input type="number" step="0.01" placeholder="Monthly EMI" value={approved.monthlyEmi} onChange={e => setApproved(a => ({ ...a, monthlyEmi: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-dark mb-2">Admin Notes</label>
              <textarea rows="4" value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Internal notes..." />
            </div>

            <button onClick={handleUpdate} disabled={updating} className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
              {updating ? 'Updating...' : 'Update & Send Email'}
            </button>

            {/* Status Timeline */}
            {app.statusHistory?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-muted uppercase mb-3">Status Timeline</p>
                <div className="space-y-3">
                  {app.statusHistory.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div><p className="text-sm font-medium capitalize">{s.status.replace('_', ' ')}</p><p className="text-xs text-muted">{new Date(s.changedAt).toLocaleString('en-US')} • {s.changedBy}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
