
const db = require('../models/index');
const bcryptjs = require('bcryptjs');
const User = db.User;
const Op = db.Sequelize.Op;
const asyncErrorhandler = require('../middleware/async.middleware');

const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};

const getOrderBy = (orderby) => {
    if(orderby === "createdAt"){
        return ['createdAt', 'DESC'];
    }else if(orderby === "name"){
        return ['name', 'ASC'];
    }else if(orderby === "email"){
        return ['email', 'ASC'];
    }else if(orderby === "status"){
        return ['status', 'ASC'];
    }else{
        return ['createdAt', 'DESC'];
    }
}

const getOrArray = (body) => {
    let arr = [];
    if(body.name !== null){
        arr.push({
            name: {
                [Op.substring]: body.name
            }
        });
    }

    if(body.email !== null){
        arr.push({
            email:  body.email
        });
    }

    if(body.mobile_no !== null){
        arr.push({
            mobile_no:  body.mobile_no
        });
    }

    if(body.name === null && body.email === null && body.mobile_no === null){
        arr.push({
            email: { [Op.ne]: null }
        })
    }

    return arr;
}

const getDeletedAtCondition = (deleted_at) => {
    if(deleted_at !== "deleted"){
        return null;
    }else{
        return { [Op.ne]: null };
    }
}

const getStatusCondition = (status) => {
    if(status === "all"){
        return { [Op.ne]: null };
    }else{
        return status;
    }
}

const getPagingData = (data, page, limit) => {
    const { count: totalUsers, rows: users } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalUsers / limit);
  
    return { totalUsers, totalPages, currentPage, users };
};

exports.profilePage = (req, res, next) => {
    res.render('profile', {
        profile: 'active',
        page_title: 'Profile'
    });
}

exports.resetPasswordPage = (req, res, next) => {
    res.render('resetPassword', {
        page_title: 'Reset Password',
        profile: 'active'
    });
}

exports.resetPassword = (req, res, next) => {
    res.redirect('/');
}

exports.getAllUsers = (req, res, next) => {
    res.render('users');
}


exports.getUsers = (req, res, next) => {
    const {page, size, orderby} = req.query;
    const { limit, offset } = getPagination(page, size);

    User.findAndCountAll({
         raw: true,
         attributes: ['id', 'name', 'email', 'mobile_no', 'status', 'createdAt'], 
         where: {
            role: 'examinee',
            [Op.and]: getOrArray(req.body),
            status: getStatusCondition(req.body.status),
            deleted_at: getDeletedAtCondition(req.body.deleted_at)
         }, 
         order: [getOrderBy(orderby)], 
         limit, 
         offset
        })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message:
                  err.message || "Some error occurred while retrieving users."
              });
        }); 
}


exports.getUserStatistics = asyncErrorhandler(async (req, res, next) => {
    const total_admins = await User.count({ 
        where: { role: 'admin' }
    });
    const active_examinees = await User.count({ 
        where: { role: 'examinee', status: 'active'}
    });
    const inactive_examinees = await User.count({ 
        where: { role: 'examinee', status: 'inactive', deleted_at: null}
    });
    const deleted_examinees = await User.count({ 
        where: { role: 'examinee', deleted_at: { [Op.ne]: null }}
    });

    res.status(200).json({
        total_admins,
        active_examinees,
        inactive_examinees,
        deleted_examinees
    });
})

exports.deleteUser = asyncErrorhandler(async (req, res, next) => {
    await User.update({ 
        status: 'inactive', 
        deleted_at: Date.now() 
    }, 
    {
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({
        success: true,
        message: "User is deleted successfully"
    })
});

exports.updateUser = asyncErrorhandler(async (req, res, next) => {
    await User.update( req.body , {
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({
        success: true,
        message: "User updated successfully"
    })
});

exports.updateStatus = asyncErrorhandler(async (req, res, next) => {

    await User.update({
        status: req.body.status
    }, 
    {
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({
        success: true,
        message: "User's status changed successfully"
    })
});

exports.createUser = asyncErrorhandler(async (req, res, next) => {
    
    let user = await User.findOne({ where: { email: req.body.email }});
    if(user){
        res.render('createuser', {
            page_title: "Create user",
            messageClass: "alert-danger",
            message: "This email is already registered"
        })
    }else{
        user =  {
            name: req.body.name,
            email: req.body.email,
            mobile_no: req.body.mobile_no,
            password: process.env.DEFAULT_PASSWORD,
            role: 'examinee',
            status: 'active',
            created_at: new Date(),
            deleted_at: null
        }

        let salt = await bcryptjs.genSalt(10);

        user.password = await bcryptjs.hash(user.password, salt);

        let newuser = await User.create(user)

        if(newuser){
            res.render('createuser', {
                page_title: "Create user",
                messageClass: "alert-success",
                message: "User created successfully!"
            })
        }
    }

});

exports.createUserPage = (req, res, next) => {
    res.render('createuser', {
        page_title: "Create user"
    })
}

exports.updateUserPage = asyncErrorhandler(async (req, res, next) => {
    const userID = req.params.id;

    const user = await User.findByPk(userID);
    if(user){
        res.render('updateuser', {
            page_title: "Update user",
            id: user.id,
            name: user.name,
            email: user.email,
            mobile_no: user.mobile_no
        })
    }else{
        res.render('updateuser',{
            messageClass: "alert-danger",
            message: "No user found with the given id",
            updatebtn: "disabled"
        })
    }
})

exports.getExamineeByEmail = asyncErrorhandler(async (req, res, next) => {

    const examinee = await User.findOne({
        where: {
            email: req.body.email,
            status: "active",
            role: "examinee"
        }
    })

    if(examinee){
        res.status(200).json({
            success: true,
            examinee
        })
    }else{
        res.status(404).json({
            success: false,
            message: "No examinee found with this email."
        })
    }
})
