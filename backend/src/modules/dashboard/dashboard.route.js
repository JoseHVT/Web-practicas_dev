const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');

router.use(authenticateToken);

router.get('/kpis', dashboardController.getKPIs);
router.get('/charts/registrations', dashboardController.getRegistrationsChart);

module.exports = router;
