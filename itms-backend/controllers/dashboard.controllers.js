const db = require('../models/index')
const asyncErrorhandler = require('../middleware/async.middleware')
const Test = db.Test
const Op = db.Sequelize.Op
const Department = db.Department
const Designation = db.Designation

exports.openDashboard = (req, res, next) => {
    res.render('dashboard', {
        page_title: 'Dashboard',
        dashboard: 'active'
    })
}

exports.openProfile = (req, res, next) => {
    res.render('profile', {
        profile: 'active',
        page_title: 'Profile'
    })
}

exports.userDashboard = (req, res, next) => {
    res.render('usersdashboard', {
        page_title: 'Users',
        users: "active"
    })
}

exports.testDashboard = asyncErrorhandler(async (req, res, next) => {
    const departments = await Department.findAll({
        raw: true,
        attributes: ['id', 'name'],
        where:{
            status: 'active'
        },
        order: [['name','ASC']]
    })
    const designations = await Designation.findAll({
        raw: true,
        attributes: ['id', 'designation'],
        where:{
            status: 'active'
        },
        order: [['designation','ASC']]
    })

    res.render('testsdashboard', {
        page_title: 'Tests',
        tests: "active",
        departments,
        designations
    })
})

exports.questionDashboard = (req, res, next) => {
    res.render('questionsdashboard', {
        page_title: 'Questions',
        questions: "active"
    })
}

exports.departmentDashboard = (req, res, next) => {
    res.render('departmentsdashboard', {
        page_title: 'Departments',
        departments: "active"
    })
}

exports.designationDashboard = (req, res, next) => {
    res.render('designationsdashboard', {
        page_title: 'Designations',
        designations: "active"
    })
}

exports.resultDashboard = (req, res, next) => {
    res.render('resultsdashboard', {
        page_title: 'Results',
        results: "active"
    })
}
