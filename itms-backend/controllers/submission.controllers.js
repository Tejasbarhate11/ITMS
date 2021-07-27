const db = require('../models/index')
const asyncErrorhandler = require('../middleware/async.middleware')
const Submission = db.Submission
const Assignment = db.Assignment
const Op = db.Sequelize.Op
const User = db.User
const Test = db.Test

exports.createSubmission = asyncErrorhandler( async (req, res, next) => {
    const userId = req.user.id
    const testId = req.test_id
    
    let check = await Submission.findOne({
        where:{
            user_id: userId,
            test_id: testId
        }
    })

    if(check){
        res.status(200).json({
            success: false,
            message: "Examinee has already submitted response for the specified test"
        })
    }else{
        const submission = await Submission.create({
            response: req.body.responses,
            submitted_on: new Date(),
            UserId: userId,
            TestId: testId
        })

        if(submission){
                await Assignment.update({
                status: req.body.status
            },{
                where: {
                    id: req.assignment_id
                }
            })
            res.status(200).json({
                success: true,
                message: "Responses submitted successfully"
            })
        }else{
            res.status(200).json({
                success: false,
                message: "Error submitting the responses. Please try again"
            })
        }
    }
})

exports.getSubmissionStatistics = asyncErrorhandler(async (req, res,next) => {
    const unevaluated_subs = await Submission.count({
        where: {
            status: 'unevaluated'
        }
    })
    
    res.status(200).json({
        success: true,
        unevalued_submissions: unevaluated_subs
    })
})