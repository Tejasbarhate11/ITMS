const express = require('express');
const router = express.Router();

const {
    isAuthenticated,
    isNotAuthenticated
} = require('../middleware/auth.middleware');


module.exports = router;