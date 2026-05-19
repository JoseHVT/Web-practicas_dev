const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticateToken, requireAdmin } = require('../../middlewares/auth.middleware');

router.use(authenticateToken);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', requireAdmin, userController.createUser);
router.put('/:id', requireAdmin, userController.updateUser);
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;
