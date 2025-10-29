import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Save, 
  RefreshCw, 
  Database, 
  Mail, 
  Shield, 
  Clock,
  Bell,
  FileText,
  Globe
} from 'lucide-react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'Smart Workplace Management Portal',
    systemEmail: 'admin@company.com',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    
    // Leave Settings
    maxLeaveDaysPerRequest: 10,
    minLeaveNotice: 2, // days in advance
    carryForwardLeaves: true,
    autoApproveLeaves: false,
    
    // Complaint Settings
    autoAssignComplaints: false,
    complaintPriorityLevels: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    emailNotifications: true,
    
    // Security Settings
    sessionTimeout: 24, // hours
    passwordMinLength: 8,
    requireStrongPassword: true,
    twoFactorAuth: false,
    
    // Notification Settings
    emailOnLeaveRequest: true,
    emailOnLeaveApproval: true,
    emailOnComplaintAssignment: true,
    emailOnComplaintResolution: true,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Using default settings
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      fetchSettings();
      toast.success('Settings reset to default');
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system-wide parameters</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetSettings}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={20} />
            Reset
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* General Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500 p-3 rounded-full">
            <Globe size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
            <p className="text-sm text-gray-600">Basic system configuration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Name
            </label>
            <input
              type="text"
              className="input-field"
              value={settings.systemName}
              onChange={(e) => handleChange('systemName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Email
            </label>
            <input
              type="email"
              className="input-field"
              value={settings.systemEmail}
              onChange={(e) => handleChange('systemEmail', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              className="input-field"
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              className="input-field"
              value={settings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leave Management Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-500 p-3 rounded-full">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Leave Management</h2>
            <p className="text-sm text-gray-600">Configure leave request policies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Leave Days Per Request
            </label>
            <input
              type="number"
              className="input-field"
              value={settings.maxLeaveDaysPerRequest}
              onChange={(e) => handleChange('maxLeaveDaysPerRequest', parseInt(e.target.value))}
              min="1"
              max="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Notice Period (days)
            </label>
            <input
              type="number"
              className="input-field"
              value={settings.minLeaveNotice}
              onChange={(e) => handleChange('minLeaveNotice', parseInt(e.target.value))}
              min="0"
              max="30"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="carryForwardLeaves"
              checked={settings.carryForwardLeaves}
              onChange={(e) => handleChange('carryForwardLeaves', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="carryForwardLeaves" className="ml-2 text-sm text-gray-700">
              Allow Carry Forward of Unused Leaves
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoApproveLeaves"
              checked={settings.autoApproveLeaves}
              onChange={(e) => handleChange('autoApproveLeaves', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="autoApproveLeaves" className="ml-2 text-sm text-gray-700">
              Auto-approve Leaves (not recommended)
            </label>
          </div>
        </div>
      </div>

      {/* Complaint Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500 p-3 rounded-full">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complaint Management</h2>
            <p className="text-sm text-gray-600">Configure complaint handling</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoAssignComplaints"
              checked={settings.autoAssignComplaints}
              onChange={(e) => handleChange('autoAssignComplaints', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="autoAssignComplaints" className="ml-2 text-sm text-gray-700">
              Auto-assign Complaints to Available Managers
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
              Enable Email Notifications
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-500 p-3 rounded-full">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
            <p className="text-sm text-gray-600">Manage security policies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (hours)
            </label>
            <input
              type="number"
              className="input-field"
              value={settings.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
              min="1"
              max="168"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              className="input-field"
              value={settings.passwordMinLength}
              onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value))}
              min="6"
              max="20"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireStrongPassword"
              checked={settings.requireStrongPassword}
              onChange={(e) => handleChange('requireStrongPassword', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="requireStrongPassword" className="ml-2 text-sm text-gray-700">
              Require Strong Passwords (uppercase, lowercase, numbers, symbols)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700">
              Enable Two-Factor Authentication
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-500 p-3 rounded-full">
            <Bell size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
            <p className="text-sm text-gray-600">Configure email notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Leave Request Notifications</p>
              <p className="text-sm text-gray-600">Send email when employee submits leave request</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailOnLeaveRequest}
              onChange={(e) => handleChange('emailOnLeaveRequest', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Leave Approval Notifications</p>
              <p className="text-sm text-gray-600">Send email when leave is approved/rejected</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailOnLeaveApproval}
              onChange={(e) => handleChange('emailOnLeaveApproval', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Complaint Assignment Notifications</p>
              <p className="text-sm text-gray-600">Send email when complaint is assigned</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailOnComplaintAssignment}
              onChange={(e) => handleChange('emailOnComplaintAssignment', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Complaint Resolution Notifications</p>
              <p className="text-sm text-gray-600">Send email when complaint is resolved</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailOnComplaintResolution}
              onChange={(e) => handleChange('emailOnComplaintResolution', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Database Info */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-500 p-3 rounded-full">
            <Database size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Database Information</h2>
            <p className="text-sm text-gray-600">Current database status (read-only)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Database Type</p>
            <p className="text-lg font-semibold text-gray-900">PostgreSQL</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Database Name</p>
            <p className="text-lg font-semibold text-gray-900">workplace_db</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Connection Status</p>
            <p className="text-lg font-semibold text-green-600">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
