const express = require('express');
const router = express.Router();

const {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin
} = require('../middleware/auth.middleware');

const {
    getQuestionsByKeywords,
    addQuestionPage,
    addQuestion,
    addOptionsPage,
    addAnswersPage,
    deleteQuestion,
    addOptions,
    addAnswers,
    getQuestionsStatistics,
    getTestQuestions
} = require('../controllers/question.controllers');

router.route('/dashboard/questions/statistics')
    .get(isAuthenticated, getQuestionsStatistics);

router.route('/dashboard/questions/add')
    .get(isAuthenticated, addQuestionPage)
    .post(isAuthenticated, addQuestion);

router.route('/dashboard/questions/options/:id')
    .get(isAuthenticated, addOptionsPage)
    .post(isAuthenticated, addOptions);

router.route('/dashboard/questions/answers/:id')
    .get(isAuthenticated, addAnswersPage)
    .post(isAuthenticated, addAnswers);

router.route('/dashboard/questions/delete/:id')
    .delete(isAuthenticated, deleteQuestion);

router.route('/dashboard/questions/test/:id')
    .get(getTestQuestions);

router.route('/dashboard/questions/keywords')
    .post(isAuthenticated, getQuestionsByKeywords);


module.exports = router;