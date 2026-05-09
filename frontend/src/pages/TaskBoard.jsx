import { useEffect, useState } from 'react';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks/my');
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const isOverdue = (task) =>
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  const overdueTasks = tasks.filter(isOverdue);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Navbar title="My Tasks" />
        <main className="p-6">
          {loading ? (
            <div className="flex justify-center h-40 items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {/* Overdue Alert */}
              {overdueTasks.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <p className="text-sm text-red-700 font-medium">
                    You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {COLUMNS.map((status) => {
                  const columnTasks = tasks.filter((t) => t.status === status);
                  return (
                    <div key={status} className="bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">{status}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          status === 'To Do' ? 'bg-gray-100 text-gray-600' :
                          status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {columnTasks.length}
                        </span>
                      </div>
                      <div className="p-3 space-y-3 min-h-[200px]">
                        {columnTasks.length === 0 ? (
                          <p className="text-xs text-gray-300 text-center pt-8">No tasks</p>
                        ) : (
                          columnTasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              onEdit={(t) => { setEditTask(t); setModalOpen(true); }}
                              onDelete={handleDeleteTask}
                              isAdmin={user?.role === 'Admin'}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchTasks}
        task={editTask}
        projectId={editTask?.projectId}
        projectMembers={[]}
      />
    </div>
  );
};

export default TaskBoard;