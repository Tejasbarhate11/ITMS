const express = require('express');
const router = express.Router();

const {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin
} = require('../middleware/auth.middleware');

const {
    getDesignationStatistics,
    getDesignations,
    createDesignation,
    updateDesignation,
    deleteDesignation
} = require('../controllers/designation.controller');

router.route('/dashboard/designations/statistics')
    .get(isAuthenticated, getDesignationStatistics);

router.route('/dashboard/designations/all')
    .get(isAuthenticated, getDesignations);

router.route('/dashboard/designations/update/:id')
    .post(isAuthenticated, updateDesignation);

router.route('/dashboard/designations/delete/:id')
    .delete(isAuthenticated, deleteDesignation);

router.route('/dashboard/designations/create')
    .post(isAuthenticated, createDesignation);


module.exports = router;