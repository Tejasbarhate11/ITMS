const db = require('../models/index');
const asyncErrorhandler = require('../middleware/async.middleware');
const Question = db.Question;
const Option = db.Option;
const Answer = db.Answer;
const TestQuestion = db.TestQuestion;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalQuestions, rows: questions } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalQuestions / limit);
  
    return { totalQuestions, totalPages, currentPage, questions };
};

const getKeywordsCondition = (req) => {
    const keywords = req.body.keywords;
    let condition = [];
    keywords.forEach(keyword => {
        condition.push({
            keywords: {
                [Op.like]: "%"+keyword+"%"
            }
        })
    });

    return {
        [Op.or]: condition
    }
}

const optionsPage = (res, type) => {
    if(type === "single_ans_mcq"){
        res.render('options', {
            page_title: "Add options",
        })
    }else if(type === "multiple_ans_mcq"){
        res.render('options', {
            page_title: "Add options"
        })
    }else if(type === "true_false"){
        res.render('options', {
            page_title: "Add options"
        })
    }
}

exports.addQuestionPage = (req, res, next) => {
    res.render('createquestion', {
        page_title: "Add question"
    });
}

exports.addOptionsPage = asyncErrorhandler(async (req, res, next) => {
    const question = await Question.findByPk(req.params.id);

    optionsPage(res, question.type);
})

exports.addOptions = asyncErrorhandler(async (req, res, next) => {
    const total_options = req.body.options.length;
    const options_created =  (await Option.bulkCreate(req.body.options)).length;
    if(options_created === total_options){
        res.status(200).json({
            success: true,
            message: "Options added successfully"
        });
    }
    
})

exports.addAnswersPage = asyncErrorhandler(async (req, res, next) => {
    const questionID = req.params.id;

    const options = await Option.findAll({
        raw: true,
        attributes: ['id', 'option_body'],
        where: {
            QuestionId: questionID
        }
    })
    res.render('answers', {
        page_title: "Add answers",
        options 
    })
})

exports.addAnswers = asyncErrorhandler(async (req, res, next) => {
    const questionID = req.params.id;

    const answer = await Answer.create({
        correct: req.body.correct,
        QuestionId: questionID
    })

    if(answer){
        res.status(200).json({
            success: true,
            message: "Answers added successfully"
        })
    }
})

exports.addQuestion = asyncErrorhandler(async (req, res, next) => {
    const question = await Question.create(req.body);
    console.log(question);
    if(question.dataValues.id){
        res.status(200).json({
            success: true,
            message: "Question added successfully",
            questionID: question.dataValues.id,
            questionType: question.dataValues.type
        })
    }
})

exports.deleteQuestion = asyncErrorhandler( async (req, res, next) => {
    const questionID = req.params.id;

    const assigned = await TestQuestion.count({
        where: {
            question_id: questionID
        }
    })

    if(assigned > 0){
        res.status(400).json({
            success: false,
            message: "This question is already assigned to a test. Cannot be deleted"
        })
    }else{
        await Option.destroy({
            where: {
                question_id: questionID
            }
        });

        await Answer.destroy({
            where: {
                question_id: questionID
            }
        });

        await Question.destroy({
            where: {
                id: questionID
            }
        });

        res.status(200).json({
            success: true,
            message: "Question deleted successfully"
        })
    }
})

exports.getQuestionsStatistics = asyncErrorhandler(async (req, res, next) => {
    const mcqs_questions = await Question.count({
        where: { type: "single_ans_mcq" }
    })
    const mcqm_questions = await Question.count({
        where: { type: "multiple_ans_mcq" }
    })
    const tf_questions = await Question.count({
        where: { type: "true_false" }
    })

    res.status(200).json({
        success: true,
        mcqs_questions,
        mcqm_questions,
        tf_questions
    })
})

exports.getQuestionsByKeywords = asyncErrorhandler(async (req, res, next) => {
    const {page, size } = req.query;
    const { limit, offset } = getPagination(page, size);


    const questionslist = await Question.findAndCountAll({
        where: getKeywordsCondition(req),
        order: [['id', 'DESC']],
        limit,
        offset
    })

    const response = getPagingData(questionslist, page, limit);

    res.status(200).json({
        success: true,
        response
    })
})

exports.getTestQuestions = asyncErrorhandler(async (req, res, next) => {
    const testID = req.params.id;
    const questions = await TestQuestion.findAll({
        where: {
            test_id: testID
        },
        include: Question
    });

    res.status(200).json({
        success: true,
        questions
    })
})