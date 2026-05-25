import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/services';
import toast from 'react-hot-toast';
import { User, Lock, Mail, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  
  const [profileData, setProfileData] = useState({ name: user?.name || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await authAPI.updateProfile(profileData);
      if (res.data.success) {
        setUser(res.data.data.user);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setUpdatingPassword(true);
    try {
      const res = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.data.success) {
        toast.success('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-slate-400">Manage your account details and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Account Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card text-center p-8">
            <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-4xl text-sky-400 font-bold mb-4 shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
            <p className="text-slate-400 text-sm mb-4">{user?.email}</p>
            
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 py-1.5 px-3 rounded-full inline-flex">
              <Shield size={14} /> {user?.role}
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-display font-bold text-white mb-6">Personal Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    className="input pl-11"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ name: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="label">Email Address (Cannot be changed)</label>
                <div className="relative opacity-60">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    disabled
                    className="input pl-11 bg-slate-800/50 cursor-not-allowed"
                    value={user?.email || ''}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-primary" disabled={updatingProfile}>
                  {updatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="card border-red-500/10">
            <h2 className="text-xl font-display font-bold text-white mb-6">Security</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="input pl-11"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="input pl-11"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      className="input pl-11"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-secondary" disabled={updatingPassword}>
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;
