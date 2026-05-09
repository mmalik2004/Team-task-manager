const User = require('./User');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Task = require('./Task');

// User <-> Project (creator)
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Project, { foreignKey: 'createdBy', as: 'projects' });

// Project <-> Members (many to many through ProjectMember)
Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId', as: 'members' });
User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId', as: 'joinedProjects' });

// ProjectMember direct associations
ProjectMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Task associations
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });

module.exports = { User, Project, ProjectMember, Task };