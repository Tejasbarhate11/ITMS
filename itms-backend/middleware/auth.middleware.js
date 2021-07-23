const db = require('../models/index');
const User = db.User;
const asyncErrorhandler = require('../middleware/async.middleware');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
    if(req.session && req.session.userId){
        next();
    }else{
        res.redirect('/');
    }    
}

exports.isNotAuthenticated = (req, res, next) => {
    if(req.session && req.session.userId){
        res.redirect('/dashboard');
    }else{
        next();        
    }    
}

exports.isAdmin = (req, res, next) => {
    if(req.session && req.session.userId && req.session.role==='admin'){
        next();
    }else{
        res.render('error', {
            error_code: '403',
            error_message: 'You do not have permission to access this resource.'
        });       
    }    
}

exports.isExamineeAuthenticated = asyncErrorhandler( async (req, res, next) => {
    let token = req.cookies[process.env.COOKIE_NAME];
    if(!token || token == 'none'){
        return next(new ErrorHandler('Access denied', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findByPk(decoded.user_id);
    req.test_id = decoded.test_id;
    req.assignment_id = decoded.assignment_id;

    next();
})