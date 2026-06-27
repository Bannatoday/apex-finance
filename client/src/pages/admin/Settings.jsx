import { useState } from 'react';
import api from '../../api';

export default function Settings() {
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold text-dark mb-6">Settings</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-semibold text-dark mb-4">Company Information</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-dark mb-2">Company Name</label><input className={inputClass} defaultValue="Apex Finance" /></div>
            <div><label className="block text-sm font-medium text-dark mb-2">Phone</label><input className={inputClass} defaultValue="(845) 241-2429" /></div>
            <div><label className="block text-sm font-medium text-dark mb-2">Email</label><input className={inputClass} defaultValue="info@apexfinance.com" /></div>
            <div><label className="block text-sm font-medium text-dark mb-2">Address</label><textarea rows="2" className={inputClass} defaultValue="1900 N. Akard Street, 5th Floor, Dallas, TX 75201" /></div>
            <button className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark text-sm">Save Changes</button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-semibold text-dark mb-4">Change Password</h3>
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div><label className="block text-sm font-medium text-dark mb-2">Current Password</label><input type="password" required className={inputClass} value={passwordForm.currentPassword} onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))} /></div>
            <div><label className="block text-sm font-medium text-dark mb-2">New Password</label><input type="password" required className={inputClass} value={passwordForm.newPassword} onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} /></div>
            <div><label className="block text-sm font-medium text-dark mb-2">Confirm New Password</label><input type="password" required className={inputClass} value={passwordForm.confirmPassword} onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))} /></div>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark text-sm disabled:opacity-50">
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
