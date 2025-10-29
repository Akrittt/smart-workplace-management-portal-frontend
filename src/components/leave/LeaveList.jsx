import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LeaveCard from './LeaveCard';
import { useAuth } from '../../context/AuthContext';

const LeaveList = ({ showAll = false }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaves();
  }, [showAll]);

  const fetchLeaves = async () => {
    try {
      const endpoint = showAll ? '/leave/all' : '/leave/my-requests';
      const response = await api.get(endpoint);
      setLeaves(response.data);
    } catch (error) {
      toast.error('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/leave/${id}/approve`);
      toast.success('Leave approved successfully!');
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/leave/${id}/reject`);
      toast.success('Leave rejected successfully!');
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject leave');
    }
  };

  const filteredLeaves = leaves.filter(leave => 
    filter === 'ALL' || leave.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {showAll ? 'All Leave Requests' : 'My Leave Requests'}
          </h1>
          <p className="text-gray-600 mt-1">{filteredLeaves.length} requests found</p>
        </div>
        
        {!showAll && (
          <button
            onClick={() => navigate('/leaves/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Request
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaves Grid */}
      {filteredLeaves.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No leave requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaves.map((leave) => (
            <LeaveCard
              key={leave.id}
              leave={leave}
              onApprove={handleApprove}
              onReject={handleReject}
              showActions={showAll && (user?.role === 'MANAGER' || user?.role === 'ADMIN')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveList;
