const priorityColors = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const statusColors = {
  'To Do': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Done': 'bg-green-100 text-green-700',
};

const TaskCard = ({ task, onEdit, onDelete, isAdmin }) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'Done';

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition ${
      isOverdue ? 'border-red-300' : 'border-gray-100'
    }`}>
      {/* Title */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className={`text-sm font-semibold ${task.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </h4>
        <div className="flex gap-1">
          <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-purple-500 text-xs">✏️</button>
          {isAdmin && (
            <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-500 text-xs">🗑️</button>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
          {task.status}
        </span>
        {isOverdue && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600">
            Overdue
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {task.assignee && (
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {task.assignee.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-gray-400">{task.assignee?.name || 'Unassigned'}</span>
        </div>
        {task.dueDate && (
          <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;