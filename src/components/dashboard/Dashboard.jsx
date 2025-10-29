import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';  
import { Calendar, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    totalComplaints: 0,
    openComplaints: 0,
    resolvedComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [leavesRes, complaintsRes] = await Promise.all([
        api.get('/leave/my-requests'),
        api.get('/complaints/my'),
      ]);

      const leaves = leavesRes.data;
      const complaints = complaintsRes.data;

      setStats({
        totalLeaves: leaves.length,
        pendingLeaves: leaves.filter(l => l.status === 'PENDING').length,
        approvedLeaves: leaves.filter(l => l.status === 'APPROVED').length,
        totalComplaints: complaints.length,
        openComplaints: complaints.filter(c => c.status === 'OPEN').length,
        resolvedComplaints: complaints.filter(c => c.status === 'RESOLVED').length,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Leaves',
      value: stats.totalLeaves,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Approved Leaves',
      value: stats.approvedLeaves,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Total Complaints',
      value: stats.totalComplaints,
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
    {
      title: 'Open Complaints',
      value: stats.openComplaints,
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: 'Resolved Complaints',
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      color: 'bg-teal-500',
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
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-600 mt-1">Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-full`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/leaves/new"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Request Leave</p>
                  <p className="text-sm text-gray-600">Submit a new leave application</p>
                </div>
              </div>
            </Link>
            <Link
              to="/complaints/new"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">File Complaint</p>
                  <p className="text-sm text-gray-600">Report an issue or concern</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{user?.fullName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
