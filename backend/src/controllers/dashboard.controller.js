const { Task, User } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const whereClause = req.user.role === 'Member' ? { assignedTo: req.user.id } : {};

    const totalTasks = await Task.count({ where: whereClause });

    const tasksByStatus = await Task.findAll({
      where: whereClause,
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
    });

    const overdueTasks = await Task.count({
      where: {
        ...whereClause,
        dueDate: { [Op.lt]: today },
        status: { [Op.ne]: 'Done' },
      },
    });

    const tasksByUser = await Task.findAll({
      attributes: ['assignedTo', [fn('COUNT', col('Task.id')), 'count']],
      include: [{ model: User, as: 'assignee', attributes: ['name'] }],
      group: ['assignedTo', 'assignee.id'],
    });

    const tasksByPriority = await Task.findAll({
      where: whereClause,
      attributes: ['priority', [fn('COUNT', col('id')), 'count']],
      group: ['priority'],
    });

    return res.status(200).json({
      totalTasks,
      tasksByStatus,
      overdueTasks,
      tasksByUser,
      tasksByPriority,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { getDashboardStats };