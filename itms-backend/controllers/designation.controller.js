const db = require('../models/index');
const asyncErrorhandler = require('../middleware/async.middleware');
const Designation = db.Designation;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;  
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalDesignations, rows: designations } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalDesignations / limit);
    return { totalDesignations, totalPages, currentPage, designations };
};

const getOrderBy = (orderby) => {
    if(orderby === "createdAt"){
        return ['createdAt', 'DESC'];
    }else if(orderby === "designation"){
        return ['designation', 'ASC'];
    }else if(orderby === "status"){
        return ['status', 'ASC'];
    }else{
        return ['createdAt', 'DESC'];
    }
}

exports.getDesignations = (req, res, next) => {
    const {page, size, orderby} = req.query;
    const { limit, offset } = getPagination(page, size);

    Designation.findAndCountAll({
         raw: true,
         attributes: ['id', 'designation', 'status', 'createdAt'],  
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
                  err.message || "Some error occurred while retrieving tutorials."
              });
        }); 
}

exports.createDesignation = asyncErrorhandler(async (req, res, next) => {
    let designation = {
        designation: req.body.designation,
        status: 'active'
    }

    designation = await Designation.create(designation);

    if(designation){
        res.status(200).json({
            success: true,
            message: "Designation created successfully"
        })
    }else{
        res.status(500).json({
            success: false,
            message: "Something went wrong. Try again"
        })
    }   
})

exports.deleteDesignation = asyncErrorhandler( async(req, res, next) => {
    await Designation.destroy({
        where: {
            id: req.params.id
        }
    });

    res.status(200).json({
        success: true,
        message: "Designation deleted successfully"
    })
})

exports.updateDesignation = asyncErrorhandler(async (req, res, next) => {
    await Designation.update({ 
        status: req.body.status
    }, 
    {
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({
        success: true,
        message: "action successfully"
    })
})

exports.getDesignationStatistics = asyncErrorhandler(async (req, res, next) => {
    const active_designations = await Designation.count({
        where: { status: 'active' }
    });
    const inactive_designations = await Designation.count({
        where: { status: 'inactive' }
    });

    res.status(200).json({
        active_designations,
        inactive_designations
    });
})