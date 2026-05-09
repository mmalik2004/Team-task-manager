const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, getMyTasks, updateTask, deleteTask } = require('../controllers/task.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

router.get('/my', verifyToken, getMyTasks);
router.get('/project/:projectId', verifyToken, getTasksByProject);
router.post('/', verifyToken, createTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, isAdmin, deleteTask);

module.exports = router;