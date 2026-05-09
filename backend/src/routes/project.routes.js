const express = require('express');
const router = express.Router();
const { createProject, getAllProjects, getProjectById, addMember, removeMember, deleteProject } = require('../controllers/project.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

router.get('/', verifyToken, getAllProjects);
router.post('/', verifyToken, createProject);
router.get('/:id', verifyToken, getProjectById);
router.post('/:id/members', verifyToken, isAdmin, addMember);
router.delete('/:id/members', verifyToken, isAdmin, removeMember);
router.delete('/:id', verifyToken, isAdmin, deleteProject);

module.exports = router;