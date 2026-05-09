import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MemberBadge from '../components/MemberBadge';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const isAdmin = user?.role === 'Admin';

  const fetchAll = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks/project/${id}`),
      ]);
      setProject(projRes.data.project);
      setTasks(taskRes.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await API.get('/auth/users');
      setAllUsers(res.data.users);
    } catch (err) {
      console.error('Could not fetch users');
    }
  };

  useEffect(() => {
    fetchAll();
    if (isAdmin) fetchAllUsers();
  }, [id]);

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await API.delete(`/projects/${id}/members`, { data: { userId } });
      fetchAll();
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return alert('Please select a user');
    try {
      await API.post(`/projects/${id}/members`, {
        userId: selectedUserId,
        role: 'Member',
      });
      setSelectedUserId('');
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchAll();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  // Filter out users already in project
  const availableUsers = allUsers.filter(
    (u) => !project?.members?.find((m) => m.id === u.id)
  );

  if (loading) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-56 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Navbar title={project?.name || 'Project'} />
        <main className="p-6">
          {/* Project Description */}
          {project?.description && (
            <p className="text-sm text-gray-500 mb-6 bg-white rounded-xl border border-gray-100 px-5 py-3">
              {project.description}
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-700">
                  Tasks ({tasks.length})
                </h2>
                <button
                  onClick={() => { setEditTask(null); setModalOpen(true); }}
                  className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-700"
                >
                  + Add Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
                  <p className="text-4xl mb-2">✅</p>
                  <p>No tasks yet. Create the first one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={(t) => { setEditTask(t); setModalOpen(true); }}
                      onDelete={handleDeleteTask}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Members Section */}
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-4">
                Members ({project?.members?.length || 0})
              </h2>
              <div className="space-y-2 mb-4">
                {project?.members?.map((member) => (
                  <MemberBadge
                    key={member.id}
                    member={member}
                    onRemove={handleRemoveMember}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>

              {/* Add Member Dropdown — Admin only */}
              {isAdmin && (
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Add Member
                  </h3>
                  {availableUsers.length === 0 ? (
                    <p className="text-xs text-gray-400">
                      No other users to add. Ask them to sign up first.
                    </p>
                  ) : (
                    <form onSubmit={handleAddMember} className="space-y-2">
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                      >
                        <option value="">Select a user...</option>
                        {availableUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700"
                      >
                        Add to Project
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchAll}
        task={editTask}
        projectId={parseInt(id)}
        projectMembers={project?.members || []}
      />
    </div>
  );
};

export default ProjectDetail;