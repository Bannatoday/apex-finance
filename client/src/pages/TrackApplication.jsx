import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiCheckCircle, HiClock, HiEye, HiXCircle, HiUpload, HiDocumentText, HiShieldCheck } from 'react-icons/hi';
import api from '../api';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const statusConfig = {
  pending: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: HiClock, desc: 'Your application has been received and is in queue.' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: HiEye, desc: 'A loan advisor is reviewing your application.' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: HiCheckCircle, desc: 'Congratulations! Your loan has been approved.' },
  rejected: { label: 'Not Approved', color: 'bg-red-100 text-red-700', icon: HiXCircle, desc: 'Unfortunately, your application was not approved at this time.' },
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

export default function TrackApplication() {
  const [email, setEmail] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadFiles, setUploadFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setApplication(null);
    try {
      const res = await api.post('/applications/track', { email, applicationId });
      setApplication(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to find application.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (key, file) => {
    setUploadFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleUploadDocuments = async () => {
    const filesToUpload = Object.entries(uploadFiles).filter(([, f]) => f);
    if (filesToUpload.length === 0) return;

    setUploading(true);
    setUploadSuccess('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('applicationId', applicationId);
      filesToUpload.forEach(([key, file]) => formData.append(key, file));

      const res = await api.post('/applications/upload-documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadSuccess(res.data.message);
      setUploadFiles({});
      // Refresh application data
      const trackRes = await api.post('/applications/track', { email, applicationId });
      setApplication(trackRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload documents.');
    } finally {
      setUploading(false);
    }
  };

  const currentStepIndex = statusSteps.indexOf(application?.status);
  const isRejected = application?.status === 'rejected';

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">Track Your Application</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">Enter your email and application ID to check your loan status, upload documents, and view updates.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Lookup Form */}
          <motion.form
            onSubmit={handleTrack}
            className="bg-white rounded-2xl shadow-lg border border-border/50 p-8 mb-10"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Application ID</label>
                <input
                  type="text"
                  required
                  value={applicationId}
                  onChange={e => setApplicationId(e.target.value.toUpperCase())}
                  placeholder="APF-2025-0001"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <HiSearch className="w-5 h-5" />
              {loading ? 'Searching...' : 'Track Application'}
            </button>
          </motion.form>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </motion.div>
          )}

          {uploadSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm text-center flex items-center justify-center gap-2">
              <HiCheckCircle className="w-5 h-5" /> {uploadSuccess}
            </motion.div>
          )}

          {/* Application Dashboard */}
          <AnimatePresence>
            {application && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Status Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                      <p className="text-sm text-muted mb-1">Application</p>
                      <h2 className="text-2xl font-heading font-bold text-dark">{application.applicationId}</h2>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig[application.status]?.color}`}>
                      {(() => { const Icon = statusConfig[application.status]?.icon; return Icon ? <Icon className="w-4 h-4" /> : null; })()}
                      {statusConfig[application.status]?.label}
                    </span>
                  </div>
                  <p className="text-muted mb-8">{statusConfig[application.status]?.desc}</p>

                  {/* Progress Stepper */}
                  {!isRejected && (
                    <div className="relative">
                      <div className="flex items-center justify-between relative z-10">
                        {statusSteps.map((step, idx) => {
                          const isCompleted = idx <= currentStepIndex;
                          const isCurrent = idx === currentStepIndex;
                          const StepIcon = statusConfig[step]?.icon;
                          return (
                            <div key={step} className="flex flex-col items-center flex-1">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                                isCompleted ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-400'
                              } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                                <StepIcon className="w-5 h-5" />
                              </div>
                              <p className={`text-xs font-medium mt-2 ${isCompleted ? 'text-primary' : 'text-muted'}`}>
                                {statusConfig[step]?.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-0 mx-12">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Approved Details */}
                  {application.status === 'approved' && application.approvedDetails && (
                    <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                      <h3 className="text-sm font-semibold text-green-800 mb-4 flex items-center gap-2"><HiCheckCircle className="w-5 h-5" /> Approved Loan Details</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div><p className="text-xs text-green-600">Approved Amount</p><p className="text-lg font-bold text-green-800">${application.approvedDetails.approvedAmount?.toLocaleString()}</p></div>
                        <div><p className="text-xs text-green-600">Interest Rate</p><p className="text-lg font-bold text-green-800">{application.approvedDetails.interestRate}%</p></div>
                        <div><p className="text-xs text-green-600">Tenure</p><p className="text-lg font-bold text-green-800">{application.approvedDetails.tenure} months</p></div>
                        <div><p className="text-xs text-green-600">Monthly EMI</p><p className="text-lg font-bold text-green-800">${application.approvedDetails.monthlyEmi?.toLocaleString()}</p></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Loan Summary */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-6">
                    <h3 className="font-semibold text-dark mb-4 flex items-center gap-2"><HiDocumentText className="w-4 h-4 text-primary" /> Loan Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-muted">Loan Type</span><span className="font-medium text-dark">{loanTypeLabels[application.loanDetails?.type] || application.loanDetails?.type}</span></div>
                      <div className="flex justify-between"><span className="text-muted">Amount Requested</span><span className="font-medium text-dark">${application.loanDetails?.amount?.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted">Purpose</span><span className="font-medium text-dark">{application.loanDetails?.purpose}</span></div>
                      <div className="flex justify-between"><span className="text-muted">Tenure</span><span className="font-medium text-dark">{application.loanDetails?.tenure} months</span></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-6">
                    <h3 className="font-semibold text-dark mb-4 flex items-center gap-2"><HiClock className="w-4 h-4 text-primary" /> Timeline</h3>
                    <div className="space-y-3">
                      {application.statusHistory?.map((entry, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-dark">{statusConfig[entry.status]?.label || entry.status}</p>
                            <p className="text-xs text-muted">{new Date(entry.changedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8">
                  <h3 className="text-lg font-heading font-bold text-dark mb-2 flex items-center gap-2">
                    <HiUpload className="w-5 h-5 text-primary" /> Upload Documents
                  </h3>
                  <p className="text-muted mb-6">Upload your supporting documents to speed up the review process. All files are encrypted and secure.</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {documentFields.map(({ key, label, desc }) => {
                      const isUploaded = application.documents?.[key];
                      const hasNewFile = uploadFiles[key];
                      return (
                        <div key={key} className={`relative border-2 rounded-xl p-4 transition-all ${
                          isUploaded ? 'border-green-200 bg-green-50' : 'border-dashed border-gray-200 hover:border-primary/50'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-dark">{label}</p>
                              <p className="text-xs text-muted">{desc}</p>
                            </div>
                            {isUploaded && <HiCheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                          </div>
                          {isUploaded && !hasNewFile ? (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-green-600 font-medium flex items-center gap-1"><HiShieldCheck className="w-3 h-3" /> Uploaded</span>
                              <button type="button" onClick={() => document.getElementById(`file-${key}`).click()} className="text-xs text-primary hover:underline">Replace</button>
                            </div>
                          ) : (
                            <label className="block mt-2">
                              <input
                                id={`file-${key}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => handleFileChange(key, e.target.files[0])}
                                className="hidden"
                              />
                              <div onClick={() => document.getElementById(`file-${key}`).click()} className="cursor-pointer text-center py-3 bg-light rounded-lg border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all">
                                {hasNewFile ? (
                                  <p className="text-xs text-primary font-medium">{hasNewFile.name}</p>
                                ) : (
                                  <p className="text-xs text-muted">Click to select file (PDF, JPG, PNG)</p>
                                )}
                              </div>
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {Object.values(uploadFiles).some(f => f) && (
                    <button
                      onClick={handleUploadDocuments}
                      disabled={uploading}
                      className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      <HiUpload className="w-5 h-5" />
                      {uploading ? 'Uploading...' : 'Upload Documents'}
                    </button>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
