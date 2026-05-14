const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');

// Rutas del Dashboard
router.get('/kpis', dashboardController.getKPIs);
router.get('/charts/registrations', dashboardController.getRegistrationsChart);

module.exports = router;
