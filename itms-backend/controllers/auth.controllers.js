const models = require('../models');
const db = require('../models/index');
const bcryptjs = require('bcryptjs');
const asyncErrorhandler = require('../middleware/async.middleware');
const ErrorHandler = require('../utils/errorHandler');
const Assignment = db.Assignment;
const jwt = require('jsonwebtoken');

const {
    decrypt
} = require('../utils/tokenUtil');
// const Validator = require('fastest-validator');

// const schema = {
//     name: {type: "string", optional: false, max: "50"},
//     email: {type: "string", optional: false},
//     mobile_no: {type},
//     password: {type: "string", optional: false, min: "6"}
// }
exports.dashboardPage = (req, res, next) => {
    res.render('dashboard', {
        page_title: 'Dashboard',
        dashboard: 'active',
        title: 'Logged in successfully',
        loggedIn: true
    })
}

exports.startPage = (req, res, next) => {
    res.redirect('/login');
}

exports.loginPage = (req, res, next) => {
    res.render('login', {
        page_title: 'Login',
        login: true
    });
}

exports.registerPage = (req, res, next) => {
    res.render('register', {
        page_title: 'Register'
    });
}

exports.login = (req, res, next) => {
    
    models.User.findOne({where:{email: req.body.email}})
        .then(user => {
            if(user !== null)
            {
                bcryptjs.compare(req.body.password, user.password, (err, success) => {
                    if(success)
                    {
                        res.locals.userId = user.id;
                        req.session.loggedIn = true;
                        req.session.userId = res.locals.userId;
                        req.session.role=user.role;
                        res.redirect('/dashboard');
                    }
                    else
                    {
                        return res.render('login', {
                            message: 'Incorrect password',
                            messageClass: 'alert-danger'
                        });
                    }
                    if(err) {
                        next(new ErrorHandler(err.message, 500));
                    }
                    
                })
            }
            else
            {
                return res.render('login', {
                    message: 'Email is not registered. Please register first.',
                    messageClass: 'alert-danger'
                });
            }
        })
        .catch(err => {
            next(new ErrorHandler(err.message, 500));
        });
}

exports.register = (req, res, next) => {
    models.User.findOne({where:{email: req.body.email}})
        .then(result => {
            if(result){
                return res.render('register', {
                    page_title: 'Register',
                    message: 'This email is already registered. Please login',
                    messageClass: 'alert-danger'
                });
            }else{
                const user = {
                    name: req.body.name,
                    email: req.body.email,
                    mobile_no: req.body.mobile_no,
                    password: req.body.password,
                    role: 'examinee',
                    status: 'active',
                    created_at: new Date(),
                    deleted_at: null
                }

                bcryptjs.genSalt(10, (err, salt) => {
                    
                    bcryptjs.hash(req.body.password, salt, (err, hash) => {
                        user.password = hash;
                        models.User.create(user)
                            .then(result =>{
                                if(result){
                                    return res.redirect('/login');
                                }else{
                                    return res.render('register', {
                                        page_title: 'Register',
                                        message: 'Failed!',
                                        messageClass: 'alert-danger'
                                    });
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                return res.render('register', {
                                    page_title: 'Register',
                                    message: 'Something went wrong!',
                                    messageClass: 'alert-danger'
                                });
                            });
                    });
                });
            }
        }).catch(err => {
            next(new ErrorHandler(err.message, 500));
        })
}

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if(err){
            console.log(err);
            next(new ErrorHandler(err.message, 500));
        }else{
            res.clearCookie(process.env.SESSION_NAME)
            res.redirect('/');
        }
    });
}

exports.loginExaminee = asyncErrorhandler(async (req, res, next) => {
    const assignmentID = decrypt(req.params.id);
    const assignment = await Assignment.findByPk(assignmentID);

    if(assignment.status === 'scheduled'){
        await Assignment.update({
            status: 'started'
        },{
            where: {
                id: assignmentID,
                status: 'scheduled'
            }
        })
    
        const token = jwt.sign({
            user_id: assignment.UserId,
            test_id: assignment.TestId,
            assignment_id: assignmentID
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_TIME
        })

        res.cookie(process.env.COOKIE_NAME, token, {
            httpOnly : true
        });

        res.status(200)
        .json({
            success : true,
            message: "Test has started",
            token: token
        });
    }else if(assignment.status === 'started'){
        res.status(200).json({
            success: false,
            message: "Test has already been started"
        })
    }else{
        res.status(400).json({
            success: false,
            message: "Error starting test!"
        })
    }
})

exports.logoutExaminee = (req, res, next) => {
    res.cookie(process.env.COOKIE_NAME, 'none', {
        expires : Date.now(),
        httpOnly : true
    });

    res.status(200).json({
        success : true,
        message : 'Logged out successfully.'
    });
}

exports.testExamineeAuth = (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user,
        testId: req.test_id,
        assignmentId: req.assignment_id
    })
}

exports.authenticated = asyncErrorhandler(async (req, res, next) => {
    let token = req.cookies.token;
    if(!token || token == 'none'){
        return res.status(200).json({
            auth:false
        })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findByPk(decoded.user_id);
    if(user){
        return res.status(200).json({
            auth: true
        })
    }else{
        return res.status(200).json({
            auth:false
        })
    }
})