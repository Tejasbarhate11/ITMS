const express = require('express')
const router = express.Router()

const {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin,
    isExamineeAuthenticated
} = require('../middleware/auth.middleware')

const {
    createSubmission,
    getSubmissionStatistics
} = require('../controllers/submission.controllers')

router.route('/examinee/test/submit')
    .post(isExamineeAuthenticated, createSubmission)

router.route('/dashboard/submissions/statistics')
    .get(getSubmissionStatistics);

module.exports = router