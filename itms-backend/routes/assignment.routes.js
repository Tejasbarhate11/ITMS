const express = require('express');
const router = express.Router();

const {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin
} = require('../middleware/auth.middleware');

const {
    createAssignment,
    getAssignmentData,
    verifyStart
} = require('../controllers/assignment.controllers');

router.route("/dashboard/assignments/assign")
    .post(createAssignment)

router.route('/assignments/data/:eid')
    .get(getAssignmentData);

router.route('/assignments/verify/:eid')
    .get(verifyStart);

module.exports = router;