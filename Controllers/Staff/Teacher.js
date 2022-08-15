const { TeacherModel, PeopleModel } = require('../../models')
const { response , UpdatingOnDB, SavingOnDB } = require('../../helpers');


/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    TeacherModel.find({})
        .skip(from)
        .populate([{
            path: 'id',
            populate: [{
                path: 'user',
                select: 'Nombre email'
            }]
        },
        // {
        //     // path: 'id_BaseSalary'
        // }
    ])
        .limit(5)
        .exec((err, teachers) => {
            if (err) response.error(res, res, 'error loandig data for teacher', 500, err);
            TeacherModel.estimatedDocumentCount({},
                (count) => response.success(res, res, 'load completed', 200, teachers, count)
            )
        });
};

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
// const getItem = (req, res) => { };

/**
 * create new register 
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {

    const { body } = req;
    const Teacher = new TeacherModel({
        id: body._id,
        id_BaseSalary: body.id_BaseSalary,
        profession: body.profession
    });

    SavingOnDB(Teacher)
        .then(resp => response.success(res, res, 'teacher was stored Safely', 201, resp))
        .catch((e) => response.error(res, res, 'error storeding teacher', 500, e))


};
/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {

    const id = req.params.id;
    const { body } = req;
    const Teacher = new TeacherModel({
        _id: body._id,
        id_BaseSalary: body.id_BaseSalary,
        profession: body.profession
    });
    UpdatingOnDB(id, TeacherModel, Teacher)
        .then(resp => response.success(req, res, 'teacher was updated Safely', 200, resp)
        ).catch((e) => response.error(req, res, 'error Updating Teacher', 500, e))
};

/**
 * delete a existing record
 * @param {*} req 
 * @param {*} res 
 */
// const deleteItem = async (req, res) => {
//     /**TODO
//      * create rute class an implemente this deletd
//      */
// };

module.exports = {
    getItems,
    // getItem,
    createItem,
    updateItem,
    // deleteItem
}