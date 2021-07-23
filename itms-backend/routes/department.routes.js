const express = require('express');
const router = express.Router();

const {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin
} = require('../middleware/auth.middleware');

const {
    getDepartmentStatistics,
    getDepartments,
    updateDepartment,
    createDepartment,
    deleteDepartment
} = require('../controllers/department.controller');

router.route('/dashboard/departments/statistics')
    .get( isAuthenticated, getDepartmentStatistics);

router.route('/dashboard/departments/all')
    .get(isAuthenticated, getDepartments);

router.route('/dashboard/departments/create')
    .post(isAuthenticated, createDepartment);

router.route('/dashboard/departments/update/:id')
    .post(isAuthenticated, updateDepartment);

router.route('/dashboard/departments/delete/:id')
    .delete(isAuthenticated, deleteDepartment);

module.exports = router;