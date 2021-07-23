const express = require('express');
const router = express.Router();

const {
    isAuthenticated,
    isNotAuthenticated,
    isExamineeAuthenticated
} = require('../middleware/auth.middleware');

const {
    startPage,
    loginPage,
    login,
    registerPage,
    register,
    dashboardPage,
    logout,
    loginExaminee,
    logoutExaminee,
    testExamineeAuth,
    authenticated
} = require('../controllers/auth.controllers');


router.route('/').get(isNotAuthenticated, startPage);

router.route('/login') 
    .get(isNotAuthenticated, loginPage)
    .post(isNotAuthenticated, login);

router.route('/register') 
    .get(isAuthenticated, registerPage)
    .post(isAuthenticated, register);

router.route('/logout')
    .get(isAuthenticated, logout);

router.route('/examinee/login/:id')
    .get(loginExaminee);

router.route('/examinee/logout')
    .get(logoutExaminee);

router.route('/examinee/test')
    .get(isExamineeAuthenticated, testExamineeAuth)

router.route('/examinee/authenticated')
    .get(authenticated)

module.exports = router;