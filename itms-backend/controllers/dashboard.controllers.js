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

exports.testDashboard = (req, res, next) => {
    res.render('testsdashboard', {
        page_title: 'Tests',
        tests: "active"
    })
}

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
