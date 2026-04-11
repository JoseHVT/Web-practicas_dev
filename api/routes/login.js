const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Rutas CRUD para login
router.post('/', loginController.login);
router.post('/register', loginController.register);
router.get('/', loginController.getLoginAccounts);
router.delete('/:id', loginController.deleteLoginAccount);
router.put('/password', loginController.updatePassword);

module.exports = router;
