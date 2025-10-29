import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import ComplaintCard from './ComplaintCard';
import { useAuth } from '../../context/AuthContext';

const ComplaintList = ({ showAll = false }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchComplaints();
  }, [showAll]);

  const fetchComplaints = async () => {
    try {
      const endpoint = showAll ? '/complaints/all' : '/complaints/my';
      const response = await api.get(endpoint);
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (id) => {
    try {
      await api.put(`/complaints/${id}/assign/${user.userId}`);
      toast.success('Complaint assigned successfully!');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to assign complaint');
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, { status });
      toast.success('Complaint updated successfully!');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update complaint');
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    filter === 'ALL' || complaint.status === filter
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
            {showAll ? 'All Complaints' : 'My Complaints'}
          </h1>
          <p className="text-gray-600 mt-1">{filteredComplaints.length} complaints found</p>
        </div>
        
        {!showAll && (
          <button
            onClick={() => navigate('/complaints/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Complaint
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Complaints Grid */}
      {filteredComplaints.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No complaints found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onAssign={handleAssign}
              onUpdate={handleUpdate}
              showActions={showAll && (user?.role === 'MANAGER' || user?.role === 'ADMIN')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;
