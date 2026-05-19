const express = require('express');
const router = express.Router();
const loginController = require('./auth.controller');
const { authenticateToken, requireAdmin } = require('../../middlewares/auth.middleware');

router.post('/', loginController.login);
router.post('/register', loginController.register);
router.get('/', authenticateToken, requireAdmin, loginController.getLoginAccounts);
router.delete('/:id', authenticateToken, requireAdmin, loginController.deleteLoginAccount);
router.put('/password', authenticateToken, loginController.updatePassword);

module.exports = router;
