const db = require('../models/index');
const asyncErrorhandler = require('../middleware/async.middleware');
const Test = db.Test;
const Op = db.Sequelize.Op;
const User = db.User;
const Question = db.Question;
const Department = db.Department;
const Designation = db.Designation;
const Option = db.Option;
const Assignment = db.Assignment;
const TestQuestion = db.TestQuestion;
const sequelize = db.sequelize;


exports.getTestAssignmentStats = asyncErrorhandler(async (testID) => {
    let result = {};
    const test = await Test.findByPk(testID);
    if(test){
        const scheduledAssignmentCount = await test.countAssignments({
            where: {
                status: 'scheduled',
                opens_at: {
                    [Op.gt]: new Date()
                }
            }
        });

        result.success = true;
        result.scheduledAssignmentCount = scheduledAssignmentCount;

        return result;
    }else{
        result.success = false;
        result.message = "Invalid test ID";
        return result;
    }
})

exports.cancelTestAssignments = asyncErrorhandler(async (testID) => {
    let result = {};
    const test = await Test.findByPk(testID);
    if(test){
        await Assignment.update({ 
            status: 'cancelled' 
        },{
            where: {
                TestId: testID,
                status: 'scheduled',
                opens_at: {
                    [Op.gt]: new Date()
                }
            }
        })
        result.success = true;
        result.message = "All test assignments are cancelled"
        return result;
    }else{
        result.success = false;
        result.message = "Invalid test ID";
        return result;
    }
})

exports.unattemptedTests = asyncErrorhandler(async () => {
    await Assignment.update({ 
        status: 'not attempted'
    },{
        where: {
            status: 'scheduled',
            closes_at: {
                [Op.lt]: new Date()
            }
        }
    })
})

exports.updateTestDetails = asyncErrorhandler(async (testId) => {

    const test = await Test.findOne({
        where: {
            "id":testId
        }
    });

    const questions = await test.getQuestions({
        attributes: ['total_score', 'time_limit']
    });

    let totalScore = 0;
    let totalTime = 0;

    questions.forEach(question => {
        totalScore += question.total_score;
        totalTime += question.time_limit;
    })

    await Test.update({
        total_score: totalScore,
        time_limit: totalTime
    },{
        where: {
            id: testId
        }
    });
});