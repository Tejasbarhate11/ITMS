const express = require('express');
const router = express.Router();

const {
    isAuthenticated,
    isNotAuthenticated,
    isAdmin
} = require('../middleware/auth.middleware');

const {
    resetPasswordPage,
    resetPassword,
    getUsers,
    getUserStatistics,
    deleteUser,
    createUser,
    createUserPage,
    updateUserPage,
    updateUser,
    updateStatus,
    getExamineeByEmail
} = require('../controllers/user.controllers');

router.route('/resetpassword')
    .get(isAuthenticated, resetPasswordPage)
    .post(isAuthenticated, resetPassword);

router.route('/dashboard/users/create')
    .get(isAuthenticated, createUserPage)
    .post(isAuthenticated, createUser);
    
router.route('/dashboard/users/update/:id')
    .get(isAuthenticated, updateUserPage)
    .post(isAuthenticated, updateUser)
    .put(isAuthenticated, updateStatus);

router.route('/dashboard/users/delete/:id')
    .delete(deleteUser);

router.route('/dashboard/users/examinee/email')
    .post(isAuthenticated, getExamineeByEmail);

router.route('/dashboard/users/statistics')
    .get(isAuthenticated, getUserStatistics);

router.route('/dashboard/users/all')
    .post(isAuthenticated, getUsers);

module.exports = router;