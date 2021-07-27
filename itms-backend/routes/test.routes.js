const express = require('express');
const router = express.Router();

const {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin,
    isExamineeAuthenticated
} = require('../middleware/auth.middleware');

const {
    getTestsStatistics,
    createTestPage,
    createTest,
    deleteTest,
    deactivateTest,
    getTests,
    updateStatus,
    getQuestionsOfTest,
    assignQuestionsPage,
    getTestInfo,    
    removeAssignedQuestion,
    assignQuestions,
    assignSingleExamineePage,
    getCompleteTest,
    updateTestPage,
    updateTest,
    assignUsersPage
} = require('../controllers/test.controllers');

router.route('/dashboard/tests/statistics')
    .get(isAuthenticated, getTestsStatistics);

router.route('/dashboard/tests/all')
    .post(isAuthenticated, getTests);

router.route('/dashboard/tests/create')
    .get(isAuthenticated, createTestPage)
    .post(isAuthenticated, createTest);

router.route('/dashboard/tests/update/:id')
    .get(isAuthenticated, updateTestPage)
    .post(isAuthenticated, updateTest);

router.route('/dashboard/tests/:id/assign/questions')
    .get(isAuthenticated, assignQuestionsPage)
    .post(isAuthenticated, assignQuestions);

router.route('/dashboard/tests/:id/assign/users')
    .get(isAuthenticated, assignUsersPage);

router.route('/dashboard/tests/status/:id')
    .put(isAuthenticated, updateStatus);

router.route('/dashboard/tests/delete/:id')
    .delete(isAuthenticated, deleteTest);

router.route('/dashboard/tests/deactivate/:id')
    .put(isAuthenticated, deactivateTest);

router.route('/dashboard/tests/test/:id/questions')
    .get(getQuestionsOfTest);

router.route('/dashboard/tests/test/:id')
    .get(getTestInfo);


router.route('/dashboard/tests/:tid/unassign/:qid')
    .get(isAuthenticated, removeAssignedQuestion);

router.route('/dashboard/tests/assign/single')
    .get(isAuthenticated, assignSingleExamineePage);

router.route('/examinee/test/data')
    .get(isExamineeAuthenticated, getCompleteTest)
    

//TEST ROUTES

// router.route('/:id')
//     .get(sendEmail);

// router.route('/launch/:eid')
//     .get(testEmailID);

module.exports = router;