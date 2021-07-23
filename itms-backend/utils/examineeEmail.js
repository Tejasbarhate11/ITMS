const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { encrypt } = require('../utils/tokenUtil');



exports.sendTestEmail = async (options) => {
    return new Promise((resolve, reject) => {
        const encrytedID = encrypt(options.assignmentID.toString());

        let mailText = `Hi! You've been assigned a test for you application with Droom. 
        Exam link: http://localhost:3000/launch/${encrytedID} 
        The test opens on ${options.opensAt} and closes on ${options.closesAt}.
        Best of luck for the test :)`;
    
        var transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
              }
        });
    
        var mail = {
            from: process.env.EMAIL,
            to: options.examineeEmail,
            subject: options.mailSubject,
            text: mailText
        };
        transporter.sendMail(mail, (err, info) => {
            if(err){
                console.log(error);
                resolve(false)
            }else{
                console.log('Email sent: ' + info.response);
                resolve(true)
            }
        });
    })
    
}

