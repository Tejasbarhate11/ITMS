const db = require('../models/index');
const asyncErrorhandler = require('../middleware/async.middleware');
const Assignment = db.Assignment;
const Op = db.Sequelize.Op;
const Department = db.Department;
const Designation = db.Designation;
const User = db.User;
const Test = db.Test;

const {
    decrypt
} = require('../utils/tokenUtil');

const {
    sendTestEmail
} = require('../utils/examineeEmail');

exports.createAssignment = asyncErrorhandler(async (req, res, next) => {
    const examineeID = req.body.examineeID;
    const testID = req.body.testID;
    const startTime = req.body.starts_at;
    const endTime = req.body.ends_at;

    const examinee = await User.findByPk(examineeID);

    let alreadyAssigned = await Assignment.findOne({
        where: {
            test_id: testID,
            user_id: examineeID,
            [Op.or]: [{
                status: 'scheduled'
            },{
                status: 'started'
            }
            ]
        }
    })

    if(alreadyAssigned){
        res.status(400).json({
            success: false,
            message: "This user is either already assigned or started the provided test"
        })
    }else{
        let assignment = {
            UserId: examineeID,
            TestId: testID,
            status: 'scheduled',
            opens_at: new Date(startTime),
            closes_at: new Date(endTime)
        }
        assignment = await Assignment.create(assignment);

        let emailsent = await sendTestEmail({
            assignmentID: assignment.id,
            examineeEmail: examinee.email,
            mailSubject: "Droom Interview Test",
            opensAt: assignment.opens_at,
            closesAt: assignment.closes_at
        })

        if(emailsent){
            res.status(200).json({
                success: true,
                assignment,
                message: "Test assigned and email sent."
            })   
        }else{
            res.status(200).json({
                success: true,
                assignment,
                message: "Test assigned but email not sent."
            })      
        }

    }
})

exports.getAssignmentData = asyncErrorhandler( async (req, res, next) => {

    const assignmentID = decrypt(req.params.eid);

    const data = await Assignment.findOne({
        where: {
            id: assignmentID
        },
        attributes: ['id', 'status', 'opens_at', 'closes_at'],
        include: [{
            model: Test,
            raw: true,
            attributes: ['id', 'title', 'status', 'instructions', 'total_score', 'time_limit'],
            include: [
                {
                    model: Department,
                    raw: true,
                    attributes: ['name']
                },{
                    model: Designation,
                    raw: true,
                    attributes: ['designation']
                }
            ]
        },
        {
            model: User,
            raw: true,
            attributes: ['id', 'name']
        }
    ]
    });

    if(data){
        res.status(200).json({
            success: true,
            data
        });
    }else{
        res.status(404).json({
            success: false,
            message: "No data found"
        });
    }
})

exports.verifyStart = asyncErrorhandler( async (req, res, next) => {
    const assignmentID = decrypt(req.params.eid);

    const assignment = await Assignment.findByPk(assignmentID);

    const currentTime = new Date().getTime();

    if(currentTime >= new Date(assignment.opens_at).getTime() && currentTime <= new Date(assignment.closes_at).getTime()){
        res.status(200).json({
            success: true,
            message: "Test can be started"
        });
    }else if(currentTime <= new Date(assignment.opens_at).getTime()){
        res.status(200).json({
            succes: false,
            message: "Test is yet to be opened"
        });
    }else if(currentTime >= new Date(assignment.closes_at)){
        res.status(200).json({
            succes: false,
            message: "The test has been closed"
        });
    }else{
        res.status(200).json({
            succes: false,
            message: "Test cannot be started"
        });
    }
})