import { Clock, User, Tag, AlertCircle } from 'lucide-react';

const ComplaintCard = ({ complaint, onAssign, onUpdate, showActions }) => {
  const statusColors = {
    OPEN: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
  };

  const priorityColors = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{complaint.title}</h3>
          <p className="text-sm text-gray-600">ID: #{complaint.id}</p>
        </div>
        <div className="flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[complaint.status]}`}>
            {complaint.status}
          </span>
          {complaint.priority && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[complaint.priority]}`}>
              {complaint.priority}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <User size={18} />
          <span className="text-sm">By: {complaint.userName}</span>
        </div>

        {complaint.category && (
          <div className="flex items-center gap-2 text-gray-700">
            <Tag size={18} />
            <span className="text-sm">Category: {complaint.category}</span>
          </div>
        )}

        {complaint.assignedToName && (
          <div className="flex items-center gap-2 text-gray-700">
            <User size={18} />
            <span className="text-sm">Assigned to: {complaint.assignedToName}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={18} />
          <span className="text-sm">Submitted: {formatDate(complaint.submittedAt)}</span>
        </div>

        {complaint.resolvedAt && (
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={18} />
            <span className="text-sm">Resolved: {formatDate(complaint.resolvedAt)}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
        <p className="text-sm text-gray-600 line-clamp-3">{complaint.description}</p>
      </div>

      {complaint.resolution && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-900 mb-1">Resolution:</p>
          <p className="text-sm text-green-800">{complaint.resolution}</p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-3 pt-4 border-t">
          {complaint.status === 'OPEN' && (
            <button
              onClick={() => onAssign(complaint.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Assign to Me
            </button>
          )}
          {complaint.status === 'IN_PROGRESS' && (
            <button
              onClick={() => onUpdate(complaint.id, 'RESOLVED')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Mark Resolved
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;
