const { Project, User, ProjectMember } = require('../models');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required.' });

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

    // creator becomes Admin member
    await ProjectMember.create({
      userId: req.user.id,
      projectId: project.id,
      role: 'Admin',
    });

    return res.status(201).json({ message: 'Project created.', project });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.findAll({
        include: [
          { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: ['role'] } },
        ],
      });
    } else {
      const memberships = await ProjectMember.findAll({ where: { userId: req.user.id } });
      const projectIds = memberships.map(m => m.projectId);
      projects = await Project.findAll({
        where: { id: projectIds },
        include: [
          { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: ['role'] } },
        ],
      });
    }
    return res.status(200).json({ projects });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: ['role'] } },
      ],
    });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.status(200).json({ project });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const projectId = req.params.id;

    const existing = await ProjectMember.findOne({ where: { userId, projectId } });
    if (existing) return res.status(400).json({ message: 'User already a member.' });

    await ProjectMember.create({ userId, projectId, role: role || 'Member' });
    return res.status(201).json({ message: 'Member added.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const projectId = req.params.id;

    await ProjectMember.destroy({ where: { userId, projectId } });
    return res.status(200).json({ message: 'Member removed.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Project deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { createProject, getAllProjects, getProjectById, addMember, removeMember, deleteProject };