const db = require('../models/index');
const asyncErrorhandler = require('../middleware/async.middleware');
const Department = db.Department;

const getPagination = (page, size) => {
    const limit = size ? +size : 15;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalDepartments, rows: departments } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalDepartments / limit);
  
    return { totalDepartments, totalPages, currentPage, departments };
};

const getOrderBy = (orderby) => {
    if(orderby === "createdAt"){
        return ['createdAt', 'DESC'];
    }else if(orderby === "name"){
        return ['name', 'ASC'];
    }else if(orderby === "status"){
        return ['status', 'ASC'];
    }else{
        return ['createdAt', 'DESC'];
    }
}

exports.getDepartments = (req, res, next) => {
    const {page, size, orderby} = req.query;
    const { limit, offset } = getPagination(page, size);

    Department.findAndCountAll({
         attributes: ['id', 'name', 'status', 'createdAt'],  
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

exports.createDepartment = asyncErrorhandler(async (req, res, next) => {
    let department = {
        name: req.body.name,
        status: 'active'
    }

    department = await Department.create(department);

    if(department){
        res.status(200).json({
            success: true,
            message: "Department created successfully"
        })
    }else{
        res.status(500).json({
            success: false,
            message: "Something went wrong. Try again"
        })
    }   
})

exports.deleteDepartment = asyncErrorhandler( async(req, res, next) => {
    const department = await Department.findByPk(req.params.id)

    const count = await department.countTests()

    if(count !== 0){
        res.status(200).json({
            success: false,
            message: `Could not delete. Requested department still has ${count} active test(s)`
        })
    }else{
        await department.destroy()
        res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        })
    }
})
 
exports.updateDepartment = asyncErrorhandler(async (req, res, next) => {
    await Department.update({ 
        status: req.body.status
    }, 
    {
        where: {
            id: req.params.id
        }
    });

    res.status(200).json({
        success: true,
        message: "action successfully"
    })
})

exports.getDepartmentStatistics = asyncErrorhandler(async (req, res, next) => {
    const active_departments = await Department.count({
        where: { status: 'active' }
    });
    const inactive_departments = await Department.count({
        where: { status: 'inactive' }
    });

    res.status(200).json({
        active_departments,
        inactive_departments
    });
})