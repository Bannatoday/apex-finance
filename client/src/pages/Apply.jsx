import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUser, HiCurrencyDollar, HiOfficeBuilding, HiCheckCircle, HiArrowRight, HiArrowLeft, HiClipboardCopy, HiLockClosed } from 'react-icons/hi';
import api from '../api';

const steps = [
  { title: 'Personal Info', icon: HiUser },
  { title: 'Loan Details', icon: HiCurrencyDollar },
  { title: 'Financial Info', icon: HiOfficeBuilding },
];

const usStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

export default function Apply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [appId, setAppId] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Account creation
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [accountError, setAccountError] = useState('');

  const [personal, setPersonal] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '', ssnLast4: '', address: '', city: '', state: '', zip: '' });
  const [loan, setLoan] = useState({ type: 'personal', amount: 25000, purpose: '', tenure: 36 });
  const [financial, setFinancial] = useState({ employmentStatus: 'employed', employerName: '', monthlyIncome: '', creditScore: 'good-700-749', existingDebt: 0 });

  // Pre-fill from landing page URL params
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const fn = searchParams.get('firstName');
    const ln = searchParams.get('lastName');
    const em = searchParams.get('email');
    const ph = searchParams.get('phone');
    const loanType = searchParams.get('type');
    const loanAmount = searchParams.get('amount');
    const loanPurpose = searchParams.get('purpose');
    if (fn || ln || em || ph) {
      setPersonal(p => ({
        ...p,
        ...(fn && { firstName: fn }),
        ...(ln && { lastName: ln }),
        ...(em && { email: em }),
        ...(ph && { phone: ph }),
      }));
      // Set loan type based on source landing page
      setLoan(l => ({
        ...l,
        type: loanType || 'mortgage',
        ...(loanAmount && { amount: Number(loanAmount) }),
        ...(loanPurpose && { purpose: loanPurpose }),
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updatePersonal = (k, v) => setPersonal(p => ({ ...p, [k]: v }));
  const updateLoan = (k, v) => setLoan(p => ({ ...p, [k]: v }));
  const updateFinancial = (k, v) => setFinancial(p => ({ ...p, [k]: v }));

  const validateStep = () => {
    setError('');
    if (step === 0) {
      if (!personal.firstName || !personal.lastName || !personal.email || !personal.phone || !personal.dob || !personal.ssnLast4 || !personal.address || !personal.city || !personal.state || !personal.zip) {
        setError('Please fill in all required fields.'); return false;
      }
      if (personal.ssnLast4.length !== 4) { setError('Please enter exactly 4 digits for SSN.'); return false; }
    }
    if (step === 1) {
      if (!loan.purpose) { setError('Please provide the loan purpose.'); return false; }
    }
    if (step === 2) {
      if (!financial.monthlyIncome) { setError('Please enter your monthly income.'); return false; }
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => Math.min(2, s + 1)); };
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/applications/submit', {
        personalInfo: personal,
        loanDetails: loan,
        financialInfo: financial
      });
      setAppId(res.data.applicationId);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyAppId = () => {
    navigator.clipboard.writeText(appId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setAccountError('');
    if (password.length < 6) { setAccountError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setAccountError('Passwords do not match.'); return; }

    setCreatingAccount(true);
    try {
      const res = await api.post('/users/register', {
        firstName: personal.firstName,
        lastName: personal.lastName,
        email: personal.email,
        phone: personal.phone,
        password
      });
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setAccountCreated(true);
    } catch (err) {
      setAccountError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setCreatingAccount(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen bg-light flex items-center py-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center w-full mx-4">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <HiCheckCircle className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-dark mb-2">Application Submitted!</h2>
          <p className="text-muted mb-6">Your loan application has been received and is being reviewed by our team.</p>

          {/* Application ID */}
          <div className="bg-light rounded-xl p-6 mb-6">
            <p className="text-sm text-muted mb-1">Your Application ID</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-heading font-bold text-primary">{appId}</p>
              <button onClick={copyAppId} className="p-2 rounded-lg hover:bg-primary/10 transition-colors" title="Copy">
                <HiClipboardCopy className={`w-5 h-5 ${copied ? 'text-accent' : 'text-muted'}`} />
              </button>
            </div>
            {copied && <p className="text-xs text-accent mt-1">Copied!</p>}
          </div>

          {/* Create Account Section */}
          {!accountCreated ? (
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 mb-6 text-left border border-primary/10">
              <h3 className="text-base font-heading font-bold text-dark mb-1">Create Your Account</h3>
              <p className="text-sm text-muted mb-4">Set a password to access your dashboard — track your status, upload documents, and get updates.</p>

              {accountError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{accountError}</div>
              )}

              <form onSubmit={handleCreateAccount} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">Email</label>
                  <input type="email" disabled value={personal.email} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-dark text-sm opacity-70" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">Password</label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark mb-1">Confirm Password</label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
                <button type="submit" disabled={creatingAccount} className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors text-sm">
                  {creatingAccount ? 'Creating Account...' : 'Create Account & Go to Dashboard'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <HiCheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-800 mb-1">Account Created!</p>
              <p className="text-xs text-green-600">You can now access your dashboard anytime.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {accountCreated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Go to Dashboard <HiArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-light text-muted font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                Skip for now
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-light/50 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium text-dark mb-2";

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">Apply for a Loan</h1>
          <p className="text-gray-300">Complete the form below. It takes less than 5 minutes. No documents needed upfront.</p>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            {steps.map(({ title, icon: Icon }, idx) => (
              <div key={title} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${idx <= step ? 'text-primary' : 'text-muted'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    idx < step ? 'bg-accent text-white' : idx === step ? 'bg-primary text-white' : 'bg-light text-muted'
                  }`}>
                    {idx < step ? <HiCheckCircle className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{title}</span>
                </div>
                {idx < 2 && <div className={`flex-1 h-0.5 mx-4 ${idx < step ? 'bg-accent' : 'bg-border'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8 sm:p-10">
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">{error}</div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {/* Step 1: Personal */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-dark mb-6">Personal Information</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className={labelClass}>First Name *</label><input className={inputClass} value={personal.firstName} onChange={e => updatePersonal('firstName', e.target.value)} placeholder="John" /></div>
                    <div><label className={labelClass}>Last Name *</label><input className={inputClass} value={personal.lastName} onChange={e => updatePersonal('lastName', e.target.value)} placeholder="Doe" /></div>
                    <div><label className={labelClass}>Email *</label><input type="email" className={inputClass} value={personal.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="john@example.com" /></div>
                    <div><label className={labelClass}>Phone *</label><input type="tel" className={inputClass} value={personal.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="(555) 123-4567" /></div>
                    <div><label className={labelClass}>Date of Birth *</label><input type="date" className={inputClass} value={personal.dob} onChange={e => updatePersonal('dob', e.target.value)} /></div>
                    <div><label className={labelClass}>SSN (Last 4 Digits) *</label><input maxLength="4" className={inputClass} value={personal.ssnLast4} onChange={e => updatePersonal('ssnLast4', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="1234" /></div>
                    <div className="sm:col-span-2"><label className={labelClass}>Address *</label><input className={inputClass} value={personal.address} onChange={e => updatePersonal('address', e.target.value)} placeholder="123 Main Street" /></div>
                    <div><label className={labelClass}>City *</label><input className={inputClass} value={personal.city} onChange={e => updatePersonal('city', e.target.value)} placeholder="New York" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClass}>State *</label><select className={inputClass} value={personal.state} onChange={e => updatePersonal('state', e.target.value)}><option value="">Select</option>{usStates.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div><label className={labelClass}>ZIP *</label><input className={inputClass} value={personal.zip} onChange={e => updatePersonal('zip', e.target.value)} placeholder="10001" /></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Loan Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-dark mb-6">Loan Details</h2>
                  <div className="space-y-6">
                    <div><label className={labelClass}>Loan Type *</label>
                      <select className={inputClass} value={loan.type} onChange={e => updateLoan('type', e.target.value)}>
                        <option value="personal">Personal Loan</option>
                        <option value="business">Business Loan</option>
                        <option value="mortgage">Mortgage Loan</option>
                        <option value="auto">Auto Loan</option>
                        <option value="student">Student Loan</option>
                        <option value="debt-consolidation">Debt Consolidation</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Loan Amount: ${Number(loan.amount).toLocaleString()}</label>
                      <input type="range" min="1000" max="500000" step="1000" value={loan.amount} onChange={e => updateLoan('amount', Number(e.target.value))} className="w-full accent-primary" />
                      <div className="flex justify-between text-xs text-muted mt-1"><span>$1,000</span><span>$500,000</span></div>
                    </div>
                    <div><label className={labelClass}>Loan Purpose *</label><textarea className={inputClass} rows="3" value={loan.purpose} onChange={e => updateLoan('purpose', e.target.value)} placeholder="Describe the purpose of the loan..." /></div>
                    <div>
                      <label className={labelClass}>Desired Tenure: {loan.tenure} months</label>
                      <input type="range" min="6" max="360" step="6" value={loan.tenure} onChange={e => updateLoan('tenure', Number(e.target.value))} className="w-full accent-primary" />
                      <div className="flex justify-between text-xs text-muted mt-1"><span>6 months</span><span>360 months</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Financial */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-heading font-bold text-dark mb-6">Financial Information</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div><label className={labelClass}>Employment Status *</label>
                      <select className={inputClass} value={financial.employmentStatus} onChange={e => updateFinancial('employmentStatus', e.target.value)}>
                        <option value="employed">Employed</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="retired">Retired</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>Employer Name</label><input className={inputClass} value={financial.employerName} onChange={e => updateFinancial('employerName', e.target.value)} placeholder="Company name" /></div>
                    <div><label className={labelClass}>Monthly Income *</label><input type="number" className={inputClass} value={financial.monthlyIncome} onChange={e => updateFinancial('monthlyIncome', e.target.value)} placeholder="5000" /></div>
                    <div><label className={labelClass}>Credit Score Range *</label>
                      <select className={inputClass} value={financial.creditScore} onChange={e => updateFinancial('creditScore', e.target.value)}>
                        <option value="excellent-750+">Excellent (750+)</option>
                        <option value="good-700-749">Good (700-749)</option>
                        <option value="fair-650-699">Fair (650-699)</option>
                        <option value="poor-below-650">Poor (Below 650)</option>
                        <option value="no-credit">No Credit History</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2"><label className={labelClass}>Existing Monthly Debt Payments ($)</label><input type="number" className={inputClass} value={financial.existingDebt} onChange={e => updateFinancial('existingDebt', e.target.value)} placeholder="0" /></div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border/50">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-primary hover:bg-primary/5'}`}
            >
              <HiArrowLeft className="w-4 h-4" /> Back
            </button>
            {step < 2 ? (
              <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm">
                Next <HiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
