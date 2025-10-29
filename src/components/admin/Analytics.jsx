import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { TrendingUp, Users, Calendar, MessageSquare } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState({
    userGrowth: [],
    leaveStatistics: {},
    complaintStatistics: {},
    departmentStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const [leaveStats, complaintStats, deptStats] = await Promise.all([
        api.get(`/admin/analytics/leaves?range=${timeRange}`),
        api.get(`/admin/analytics/complaints?range=${timeRange}`),
        api.get('/admin/analytics/departments'),
      ]);

      setStats({
        leaveStatistics: leaveStats.data,
        complaintStatistics: complaintStats.data,
        departmentStats: deptStats.data,
      });
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">System insights and trends</p>
        </div>
        <select
          className="input-field"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leaves</p>
              <p className="text-3xl font-bold text-gray-900">{stats.leaveStatistics.total || 0}</p>
              <p className="text-sm text-green-600 mt-1">↑ 12% from last period</p>
            </div>
            <div className="bg-blue-500 p-4 rounded-full">
              <Calendar size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-3xl font-bold text-gray-900">{stats.complaintStatistics.total || 0}</p>
              <p className="text-sm text-red-600 mt-1">↓ 8% from last period</p>
            </div>
            <div className="bg-red-500 p-4 rounded-full">
              <MessageSquare size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.leaveStatistics.activeUsers || 0}</p>
              <p className="text-sm text-green-600 mt-1">↑ 5% from last period</p>
            </div>
            <div className="bg-green-500 p-4 rounded-full">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-3xl font-bold text-gray-900">87%</p>
              <p className="text-sm text-green-600 mt-1">↑ 3% from last period</p>
            </div>
            <div className="bg-purple-500 p-4 rounded-full">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Department Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Department</th>
                <th className="text-left py-3 px-4">Employees</th>
                <th className="text-left py-3 px-4">Leaves</th>
                <th className="text-left py-3 px-4">Complaints</th>
                <th className="text-left py-3 px-4">Avg Resolution Time</th>
              </tr>
            </thead>
            <tbody>
              {stats.departmentStats.map((dept, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{dept.name}</td>
                  <td className="py-3 px-4">{dept.employeeCount}</td>
                  <td className="py-3 px-4">{dept.leaveCount}</td>
                  <td className="py-3 px-4">{dept.complaintCount}</td>
                  <td className="py-3 px-4">{dept.avgResolutionTime || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
