const { Task, User, Project } = require('../models');
const { Op } = require('sequelize');

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo, projectId } = req.body;
    if (!title || !projectId) return res.status(400).json({ message: 'Title and projectId are required.' });

    const task = await Task.create({
      title, description, dueDate, priority,
      assignedTo: assignedTo || null,
      projectId,
      createdBy: req.user.id,
    });

    return res.status(201).json({ message: 'Task created.', task });
  } catch (error) {
    console.error('createTask error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { projectId: req.params.projectId },
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
      ],
    });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('getTasksByProject error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assignedTo: req.user.id },
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
      ],
    });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('getMyTasks error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    if (req.user.role === 'Member') {
      if (task.assignedTo !== req.user.id) {
        return res.status(403).json({ message: 'You can only update your own tasks.' });
      }
      if (status) task.status = status;
    } else {
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate) task.dueDate = dueDate;
      if (priority) task.priority = priority;
      if (status) task.status = status;
      if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    }

    await task.save();
    return res.status(200).json({ message: 'Task updated.', task });
  } catch (error) {
    console.error('updateTask error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    await task.destroy();
    return res.status(200).json({ message: 'Task deleted.' });
  } catch (error) {
    console.error('deleteTask error:', error);
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { createTask, getTasksByProject, getMyTasks, updateTask, deleteTask };