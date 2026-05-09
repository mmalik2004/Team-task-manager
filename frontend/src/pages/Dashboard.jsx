import { useEffect, useState } from 'react';
import API from '../api/axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#ef4444'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statusData = stats?.tasksByStatus?.map((s) => ({
    name: s.status,
    count: parseInt(s.dataValues?.count || s.count),
  })) || [];

  const priorityData = stats?.tasksByPriority?.map((p) => ({
    name: p.priority,
    value: parseInt(p.dataValues?.count || p.count),
  })) || [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Navbar title="Dashboard" />
        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                  { label: 'Total Tasks', value: stats?.totalTasks || 0, color: 'bg-purple-100 text-purple-700', icon: '📋' },
                  { label: 'In Progress', value: statusData.find(s => s.name === 'In Progress')?.count || 0, color: 'bg-blue-100 text-blue-700', icon: '⚡' },
                  { label: 'Completed', value: statusData.find(s => s.name === 'Done')?.count || 0, color: 'bg-green-100 text-green-700', icon: '✅' },
                  { label: 'Overdue', value: stats?.overdueTasks || 0, color: 'bg-red-100 text-red-700', icon: '⚠️' },
                ].map((card) => (
                  <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl ${card.color} mb-3`}>
                      {card.icon}
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-base font-semibold text-gray-700 mb-4">Tasks by Status</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={statusData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-base font-semibold text-gray-700 mb-4">Tasks by Priority</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {priorityData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tasks per User */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Tasks per Member</h3>
                <div className="space-y-3">
                  {stats?.tasksByUser?.map((item) => (
                    <div key={item.assignedTo} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {item.assignee?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{item.assignee?.name || 'Unassigned'}</span>
                          <span className="text-gray-400">{item.dataValues?.count || item.count} tasks</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-purple-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(((item.dataValues?.count || item.count) / (stats?.totalTasks || 1)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!stats?.tasksByUser || stats.tasksByUser.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-4">No task assignments yet</p>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;