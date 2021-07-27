const db = require('../models/index')
const asyncErrorhandler = require('../middleware/async.middleware')
const Test = db.Test
const Op = db.Sequelize.Op
const User = db.User
const Question = db.Question
const Department = db.Department
const Designation = db.Designation
const Assignment = db.Assignment
const Option = db.Option
const TestQuestion = db.TestQuestion
const slugify = require('slugify')
const sequelize = db.sequelize
const {
    updateTestDetails
} = require('../utils/testUtils')
const {
    sendTestEmail
} = require('../utils/examineeEmail')
const { 
    decrypt 
} = require('../utils/tokenUtil')

const getOrderBy = (orderby) => {
    if(orderby === "createdAt"){
        return ['createdAt', 'DESC'];
    }else if(orderby === 'title'){
        return ['title', 'ASC'];
    }else if(orderby === "status"){
        return ['status', 'ASC'];
    }else if(orderby === "department"){
        return [Department, 'name', 'ASC'];
    }else if(orderby === "designation"){
        return [Designation, 'designation', 'ASC']
    }else{
        return ['createdAt', 'DESC'];
    }
}

const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
}

const getPagingData = (data, page, limit) => {
    const { count: totalTests, rows: tests } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalTests / limit);
  
    return { totalTests, totalPages, currentPage, tests };
}

exports.getTests = (req, res, next) => {
    const {page, size, orderby} = req.query;
    const { limit, offset } = getPagination(page, size);

    Test.findAndCountAll({
        raw: true,
        attributes: ['id', 'title', 'status', 'createdAt'],
        where: {
            department_id: req.body.department !== "none"? req .body.department : {[Op.ne]: null},
            designation_id: req.body.designation !== "none"? req .body.designation : {[Op.ne]: null}
        },
        order: [getOrderBy(orderby)], 
        limit, 
        offset,
        include: [{
            model: User,
            attributes: ['name']
        }, {
            model: Designation,
            attributes: ['designation']
        }, {
            model: Department,
            attributes: ['name']
        }]
    }).then(data => {
        const response = getPagingData(data, page, limit);
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            message:
              err.message || "Some error occurred while retrieving tests."
        });
    }); 
}


exports.updateStatus = asyncErrorhandler(async (req, res, next) => {
    await Test.update({
        status: req.body.status
    }, 
    {
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({
        success: true,
        message: "Test status changed successfully"
    })
})


exports.getTestsStatistics = asyncErrorhandler(async (req, res, next) => {
    const active_tests = await Test.count({
        where:{
            status: "active"
        }
    })
    const inactive_tests = await Test.count({
        where:{
            status: "inactive",
            deleted_at: null
        }
    })
    const deleted_tests = await Test.count({
        where:{
            deleted_at: { [Op.ne]: null }
        }
    })
    
    res.status(200).json({
        active_tests,
        inactive_tests,
        deleted_tests
    })
})

exports.createTestPage =asyncErrorhandler(async (req, res, next) => {
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
    res.render('createtest',{
        page_title: "Create test",
        departments,
        designations
    })
})

exports.createTest = asyncErrorhandler(async (req, res, next) => {
    req.body.UserId = req.session.userId;
    req.body.slug = slugify(req.body.title, {lower : true});
    let test = await Test.create(req.body,{
        raw: true
    });
    if(test){
        res.status(200).json({
            success: true,
            message: "Test created successfully"
        })
    }
})

exports.deleteTest = asyncErrorhandler(async (req, res, next) => {
    const test = await Test.findByPk(req.params.id);

    const count = await test.countAssignments({
        where: {
            status: 'started'
        }
    })
    if(count === 0){
        await Test.update({
            status: 'inactive',
            deleted_at: Date.now()
        },
        {
            where: {
                id: req.params.id
            }
        })

        await Assignment.update({
            status: 'cancelled'
        },{
            where:{
                test_id: req.params.id,
                status: 'scheduled'
            }
        })

        res.status(200).json({
            success: true,
            message: "Test deleted successfully"
        });
    }else{
        res.status(200).json({
            success: false,
            message: "This test has been assigned and certain users are currently giving the test"
        });
    }    
})

exports.deactivateTest = asyncErrorhandler(async (req, res, next) => {
    await Test.update({
        status: 'inactive'
    },
    {
        where: {
            id: req.params.id
        }
    });

    res.status(200).json({
        success: true,
        message: "The test is inactive now"
    });
})

exports.getQuestionsOfTest = asyncErrorhandler(async (req, res, next) => {
    const TestId = req.params.id;

    const {page, size} = req.query;

    let test = await Test.findOne({
        attributes: ['id', 'time_limit', 'total_score'],
        where: { id: TestId }
    })

    let questions, currentPage, totalPages;
    let totalQuestions = await test.countQuestions();

    if(page === null && size === null){
        questions = await test.getQuestions();
    }else{
        const { limit, offset } = getPagination(page, size);
        questions = await test.getQuestions({
            raw: true,
            limit, 
            offset 
        });

        currentPage = page ? +page : 0;
        totalPages = Math.ceil(totalQuestions / limit);
    }

    res.status(200).json({
        success: true,
        test,
        totalQuestions,
        currentPage,
        totalPages,
        questions
    })
})

exports.assignQuestionsPage =  (req, res, next) => {
    res.render('assignquestions', {
        page_title: 'Assign questions'
    });
}

exports.getTestInfo = asyncErrorhandler(async (req, res, next) => {
    const TestID = req.params.id;

    let test = await Test.findOne({
        raw: true,
        attributes: ['id','title', 'time_limit', 'total_score'],
        where: {
            id: TestID,
            status: "active",
            deleted_at: null
        },
        include: [{
            model: Department,
            attributes: ['name']
        },{
            model: Designation,
            attributes: ['designation']
        },{
            model: User,
            raw: true,
            attributes: ['name']
        }
    ]
    })

    if(test){
        res.status(200).json({
            success: true,
            test
        })
    }else{
        res.status(404).json({
            success: false,
            message: "No test found"
        })
    }
    
})

exports.removeAssignedQuestion = asyncErrorhandler(async (req, res, next) => {
    const questionID = req.params.qid;
    const testID = req.params.tid;

    await TestQuestion.destroy({
        where: {
            question_id: questionID,
            test_id: testID
        }
    });

    await updateTestDetails(testID);

    res.status(200).json({
        success: true,
        message: "Question unassigned successfully"
    })
})

exports.assignQuestions = asyncErrorhandler(async (req, res, next) => {
    const testId = req.params.id;
    const questions = req.body.questions;

    const test = await Test.findOne({
        where: {
            "id":testId
        }
    });

    await test.addQuestions(questions);

    await updateTestDetails(test.id);

    res.status(200).json({
        success: true,
        message: "Questions assigned successfully"
    })
})

//TEST

exports.sendEmail = asyncErrorhandler(async (req, res, next) => {
    const id = req.params.id;

    let success = await sendTestEmail({
        assignmentID: id,
        examineeEmail: "tjbarhate11@gmail.com",
        mailSubject: "THIS IS TEST 3"
    })

    if(success){
        res.status(200).json({
            success
        });
    }else{
        res.status(500).json({
            success
        });
    }

})

exports.testEmailID = asyncErrorhandler(async (req, res, next) => {
    const eid = req.params.eid;

    const did = decrypt(eid);

    res.status(200).json({
        success: true,
        decryptedID: did
    })

})

exports.assignSingleExamineePage = (req, res, next) => {
    res.render('assignTestSingle', {
        page_title: "Assign Test"
    })
}

exports.getCompleteTest = asyncErrorhandler(async (req, res, next) => {
    let test = await Test.findOne({
        attributes: ['id','title', 'time_limit', 'total_score'],
        where: {
            id: req.test_id
        },
        include: [{
            model: Department,
            attributes: ['name']
        },{
            model: Designation,
            attributes: ['designation']
        },{
            model: User,
            raw: true,
            attributes: ['name']
        }, {
            model: Question,
            through: {
                attributes: []
            },
            attributes: ['id', 'type', 'question_body', 'total_score', 'time_limit'],
            include: [{
                model: Option, as: 'Options'
            }]
        }
    ]
    })
    res.status(200).json({
        success: true,
        test: test
    })
})

exports.updateTestPage = asyncErrorhandler(async (req, res, next) => {
    const id = req.params.id;
    let test = await Test.findOne({
        attributes: ['id','title', 'instructions', 'time_limit', 'total_score'],
        where: {
            id: id
        },
        include: [{
            model: Department,
            attributes: ['id', 'name']
        },{
            model: Designation,
            attributes: ['id', 'designation']
        },{
            model: User,
            raw: true,
            attributes: ['name']
        }
    ]
    })

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

    res.render('updatetest',{
        page_title: "Update test",
        id: id,
        title: test.title,
        instructions: test.instructions,
        depId: test["Department"].id,
        desId: test["Designation"].id,
        dep: test["Department"].name,
        des: test["Designation"].designation,
        departments,
        designations
    })


})

exports.updateTest = asyncErrorhandler(async (req, res, next)=>{
    const testID = req.params.id

    req.body.slug = slugify(req.body.title, {lower : true})

    let test = await Test.update(req.body,{
        where: {
            id: testID
        }
    })

    if(test){
        res.status(200).json({
            success: true,
            message: "Test updated successfully"
        })
    }
})

exports.assignUsersPage = asyncErrorhandler(async (req, res, next) => {
    const test = await Test.findOne({
        attributes: ['id', 'title'],
        where: {
            id: req.params.id
        }
    })
    res.render('assignTestBatch', {
        page_title: "Batch Assign",
        testId: req.params.id,
        testTitle: test.title
    })
})