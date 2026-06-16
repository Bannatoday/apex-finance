import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCheckCircle, HiClock, HiEye, HiXCircle, HiUpload, HiDocumentText,
  HiShieldCheck, HiLogout, HiUser, HiChevronDown, HiChevronUp
} from 'react-icons/hi';
import api from '../api';

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const statusConfig = {
  pending: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: HiClock, desc: 'Your application has been received and is in queue.' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: HiEye, desc: 'A loan advisor is reviewing your application.' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: HiCheckCircle, desc: 'Congratulations! Your loan has been approved.' },
  rejected: { label: 'Not Approved', color: 'bg-red-100 text-red-700', icon: HiXCircle, desc: 'Unfortunately, your application was not approved.' },
};

const statusSteps = ['pending', 'under_review', 'approved'];

const loanTypeLabels = {
  'personal': 'Personal Loan', 'business': 'Business Loan', 'mortgage': 'Mortgage Loan',
  'auto': 'Auto Loan', 'student': 'Student Loan', 'debt-consolidation': 'Debt Consolidation'
};

const documentFields = [
  { key: 'governmentIdFront', label: 'Government ID (Front)', desc: 'Driver\'s license or passport front' },
  { key: 'governmentIdBack', label: 'Government ID (Back)', desc: 'Driver\'s license or passport back' },
  { key: 'paystub', label: 'Recent Pay Stub', desc: 'Last 30 days pay stub' },
  { key: 'bankStatement', label: 'Bank Statement', desc: 'Last 3 months bank statement' },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);
  const [uploadFiles, setUploadFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('userToken');
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/users/applications');
      setApplications(res.data.applications);
      if (res.data.applications.length > 0) {
        setExpandedApp(res.data.applications[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFileChange = (appId, key, file) => {
    setUploadFiles(prev => ({
      ...prev,
      [appId]: { ...(prev[appId] || {}), [key]: file }
    }));
  };

  const handleUploadDocuments = async (appId) => {
    const filesToUpload = Object.entries(uploadFiles[appId] || {}).filter(([, f]) => f);
    if (filesToUpload.length === 0) return;

    setUploading(true);
    setUploadMsg({ type: '', text: '' });
    try {
      const formData = new FormData();
      filesToUpload.forEach(([key, file]) => formData.append(key, file));

      await api.post(`/users/applications/${appId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadMsg({ type: 'success', text: 'Documents uploaded successfully!' });
      setUploadFiles(prev => ({ ...prev, [appId]: {} }));
      fetchApplications();
    } catch (err) {
      setUploadMsg({ type: 'error', text: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-light flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-light">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-gray-300 text-sm mb-1">Welcome back,</p>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/apply"
                className="px-5 py-2.5 bg-gradient-to-r from-secondary to-secondary-light text-dark font-semibold rounded-lg text-sm hover:shadow-lg transition-all"
              >
                New Application
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-white/20 transition-all"
              >
                <HiLogout className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4">
          {applications.length === 0 ? (
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-border/50 p-12 text-center">
              <HiDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-bold text-dark mb-2">No Applications Yet</h2>
              <p className="text-muted mb-6">You haven't submitted any loan applications. Start your journey today!</p>
              <Link to="/apply" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
                Apply for a Loan
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-heading font-semibold text-dark">Your Applications ({applications.length})</h2>

              {applications.map(app => {
                const isExpanded = expandedApp === app._id;
                const currentStepIndex = statusSteps.indexOf(app.status);
                const isRejected = app.status === 'rejected';
                const appFiles = uploadFiles[app._id] || {};
                const hasNewFiles = Object.values(appFiles).some(f => f);

                return (
                  <motion.div key={app._id} initial="hidden" animate="visible" variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
                    {/* Collapsed Header */}
                    <button
                      onClick={() => setExpandedApp(isExpanded ? null : app._id)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-light/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <p className="text-xs text-muted mb-0.5">Application</p>
                          <p className="font-heading font-bold text-dark">{app.applicationId}</p>
                        </div>
                        <span className="text-xs text-muted">•</span>
                        <p className="text-sm text-body">{loanTypeLabels[app.loanDetails?.type]}</p>
                        <span className="text-xs text-muted">•</span>
                        <p className="text-sm font-semibold text-dark">${app.loanDetails?.amount?.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[app.status]?.color}`}>
                          {(() => { const Icon = statusConfig[app.status]?.icon; return Icon ? <Icon className="w-3.5 h-3.5" /> : null; })()}
                          {statusConfig[app.status]?.label}
                        </span>
                        {isExpanded ? <HiChevronUp className="w-5 h-5 text-muted" /> : <HiChevronDown className="w-5 h-5 text-muted" />}
                      </div>
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 border-t border-border/50">
                            {/* Status Description */}
                            <p className="text-muted py-4">{statusConfig[app.status]?.desc}</p>

                            {/* Progress Stepper */}
                            {!isRejected && (
                              <div className="relative mb-8">
                                <div className="flex items-center justify-between relative z-10">
                                  {statusSteps.map((step, idx) => {
                                    const isCompleted = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    const StepIcon = statusConfig[step]?.icon;
                                    return (
                                      <div key={step} className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                          isCompleted ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-400'
                                        } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                                          <StepIcon className="w-4 h-4" />
                                        </div>
                                        <p className={`text-xs font-medium mt-2 ${isCompleted ? 'text-primary' : 'text-muted'}`}>
                                          {statusConfig[step]?.label}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0 mx-10">
                                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
                                </div>
                              </div>
                            )}

                            {/* Approved Details */}
                            {app.status === 'approved' && app.approvedDetails && (
                              <div className="p-5 bg-green-50 border border-green-200 rounded-xl mb-6">
                                <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2"><HiCheckCircle className="w-4 h-4" /> Approved Loan Details</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  <div><p className="text-xs text-green-600">Amount</p><p className="font-bold text-green-800">${app.approvedDetails.approvedAmount?.toLocaleString()}</p></div>
                                  <div><p className="text-xs text-green-600">Rate</p><p className="font-bold text-green-800">{app.approvedDetails.interestRate}%</p></div>
                                  <div><p className="text-xs text-green-600">Tenure</p><p className="font-bold text-green-800">{app.approvedDetails.tenure} mo</p></div>
                                  <div><p className="text-xs text-green-600">Monthly EMI</p><p className="font-bold text-green-800">${app.approvedDetails.monthlyEmi?.toLocaleString()}</p></div>
                                </div>
                              </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Loan Summary */}
                              <div className="bg-light rounded-xl p-5">
                                <h3 className="font-semibold text-dark mb-3 flex items-center gap-2"><HiDocumentText className="w-4 h-4 text-primary" /> Loan Details</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between"><span className="text-muted">Type</span><span className="font-medium text-dark">{loanTypeLabels[app.loanDetails?.type]}</span></div>
                                  <div className="flex justify-between"><span className="text-muted">Amount</span><span className="font-medium text-dark">${app.loanDetails?.amount?.toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span className="text-muted">Purpose</span><span className="font-medium text-dark truncate ml-4">{app.loanDetails?.purpose}</span></div>
                                  <div className="flex justify-between"><span className="text-muted">Tenure</span><span className="font-medium text-dark">{app.loanDetails?.tenure} months</span></div>
                                  <div className="flex justify-between"><span className="text-muted">Submitted</span><span className="font-medium text-dark">{new Date(app.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span></div>
                                </div>
                              </div>

                              {/* Timeline */}
                              <div className="bg-light rounded-xl p-5">
                                <h3 className="font-semibold text-dark mb-3 flex items-center gap-2"><HiClock className="w-4 h-4 text-primary" /> Timeline</h3>
                                <div className="space-y-3">
                                  {app.statusHistory?.map((entry, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-dark">{statusConfig[entry.status]?.label || entry.status}</p>
                                        <p className="text-xs text-muted">{new Date(entry.changedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Document Upload */}
                            <div className="mt-6 bg-light rounded-xl p-5">
                              <h3 className="font-semibold text-dark mb-1 flex items-center gap-2"><HiUpload className="w-4 h-4 text-primary" /> Documents</h3>
                              <p className="text-sm text-muted mb-4">Upload supporting documents to speed up your review.</p>

                              {uploadMsg.text && (
                                <div className={`mb-4 p-3 rounded-lg text-sm ${uploadMsg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                  {uploadMsg.text}
                                </div>
                              )}

                              <div className="grid sm:grid-cols-2 gap-3">
                                {documentFields.map(({ key, label, desc }) => {
                                  const isUploaded = app.documents?.[key];
                                  const hasNewFile = appFiles[key];
                                  return (
                                    <div key={key} className={`border-2 rounded-xl p-3 transition-all ${isUploaded ? 'border-green-200 bg-green-50' : 'border-dashed border-gray-200 bg-white'}`}>
                                      <div className="flex items-start justify-between mb-1">
                                        <p className="text-sm font-medium text-dark">{label}</p>
                                        {isUploaded && <HiCheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                                      </div>
                                      <p className="text-xs text-muted mb-2">{desc}</p>
                                      {isUploaded && !hasNewFile ? (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-green-600 font-medium flex items-center gap-1"><HiShieldCheck className="w-3 h-3" /> Uploaded</span>
                                          <button type="button" onClick={() => document.getElementById(`dash-file-${app._id}-${key}`).click()} className="text-xs text-primary hover:underline">Replace</button>
                                        </div>
                                      ) : (
                                        <div onClick={() => document.getElementById(`dash-file-${app._id}-${key}`).click()} className="cursor-pointer text-center py-2 bg-white rounded-lg border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all">
                                          <p className="text-xs text-muted">{hasNewFile ? hasNewFile.name : 'Click to select'}</p>
                                        </div>
                                      )}
                                      <input
                                        id={`dash-file-${app._id}-${key}`}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={e => handleFileChange(app._id, key, e.target.files[0])}
                                        className="hidden"
                                      />
                                    </div>
                                  );
                                })}
                              </div>

                              {hasNewFiles && (
                                <button
                                  onClick={() => handleUploadDocuments(app._id)}
                                  disabled={uploading}
                                  className="mt-4 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all text-sm flex items-center gap-2"
                                >
                                  <HiUpload className="w-4 h-4" />
                                  {uploading ? 'Uploading...' : 'Upload Documents'}
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
