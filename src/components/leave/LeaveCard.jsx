import { Calendar, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

const LeaveCard = ({ leave, onApprove, onReject, showActions }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{leave.employeeName}</h3>
          <p className="text-sm text-gray-600">ID: #{leave.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[leave.status]}`}>
          {leave.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={18} />
          <span className="text-sm">
            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
          </span>
        </div>
        
        {leave.managerName && (
          <div className="flex items-center gap-2 text-gray-700">
            <User size={18} />
            <span className="text-sm">Reviewed by: {leave.managerName}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={18} />
          <span className="text-sm">Submitted: {formatDate(leave.submittedAt)}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
        <p className="text-sm text-gray-600">{leave.reason}</p>
      </div>

      {showActions && leave.status === 'PENDING' && (
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={() => onApprove(leave.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(leave.id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveCard;
