import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Users, Calendar, MessageSquare, TrendingUp, Settings, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployees: 0,
    totalManagers: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    totalComplaints: 0,
    openComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const [usersRes, leavesRes, complaintsRes] = await Promise.all([
        api.get('/admin/users/count'),
        api.get('/admin/leaves/statistics'),
        api.get('/admin/complaints/statistics'),
      ]);

      setStats({
        totalUsers: usersRes.data.total || 0,
        totalEmployees: usersRes.data.employees || 0,
        totalManagers: usersRes.data.managers || 0,
        totalLeaves: leavesRes.data.total || 0,
        pendingLeaves: leavesRes.data.pending || 0,
        totalComplaints: complaintsRes.data.total || 0,
        openComplaints: complaintsRes.data.open || 0,
      });
    } catch (error) {
      toast.error('Failed to load admin statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-green-500',
      link: '/admin/users',
    },
    {
      title: 'Managers',
      value: stats.totalManagers,
      icon: Shield,
      color: 'bg-purple-500',
      link: '/admin/users',
    },
    {
      title: 'Total Leaves',
      value: stats.totalLeaves,
      icon: Calendar,
      color: 'bg-orange-500',
      link: '/leaves/all',
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Calendar,
      color: 'bg-yellow-500',
      link: '/leaves/all',
    },
    {
      title: 'Total Complaints',
      value: stats.totalComplaints,
      icon: MessageSquare,
      color: 'bg-red-500',
      link: '/complaints/all',
    },
    {
      title: 'Open Complaints',
      value: stats.openComplaints,
      icon: MessageSquare,
      color: 'bg-pink-500',
      link: '/complaints/all',
    },
    {
      title: 'Analytics',
      value: 'View',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      link: '/admin/analytics',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="card hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-full`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-600">View, activate, deactivate users</p>
                </div>
              </div>
            </Link>
            <Link
              to="/admin/analytics"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">View Analytics</p>
                  <p className="text-sm text-gray-600">System usage and trends</p>
                </div>
              </div>
            </Link>
            <Link
              to="/admin/settings"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">System Settings</p>
                  <p className="text-sm text-gray-600">Configure system parameters</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium">New leave request</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="text-purple-600" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium">New complaint filed</p>
                <p className="text-xs text-gray-600">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="text-green-600" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
