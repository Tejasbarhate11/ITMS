const express = require('express');
const router = express.Router();

const {
    isAuthenticated,
    isNotAuthenticated
} = require('../middleware/auth.middleware');

const {
    openDashboard,
    openProfile,
    userDashboard,
    testDashboard,
    questionDashboard,
    departmentDashboard,
    designationDashboard,
    resultDashboard
} = require('../controllers/dashboard.controllers');

router.route('/dashboard').get(isAuthenticated, openDashboard);

router.route('/profile').get(isAuthenticated, openProfile);

router.route('/dashboard/users').get(isAuthenticated, userDashboard);

router.route('/dashboard/tests').get(isAuthenticated, testDashboard);

router.route('/dashboard/questions').get(isAuthenticated, questionDashboard);

router.route('/dashboard/departments').get(isAuthenticated, departmentDashboard);

router.route('/dashboard/designations').get(isAuthenticated, designationDashboard);

router.route('/dashboard/results').get(isAuthenticated, resultDashboard);
module.exports = router;