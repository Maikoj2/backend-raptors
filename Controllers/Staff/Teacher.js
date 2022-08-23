const { TeacherModel, PeopleModel } = require('../../models')
const { response, UpdatingOnDB, SavingOnDB, SearchingAllOnDB, Populate } = require('../../helpers');


/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const { from = 0, limit = 5 } = req.query;
    const query = { deleted: false }
    await Promise.all([
        TeacherModel.countDocuments(query),
        SearchingAllOnDB(TeacherModel, Number(from), Number(limit), query, Populate.populateTeacher )
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for teachers', 500, err))
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

    const user = req.user._id;
    const { id, IdType, Names, SureNames, Gender, neighborhood, Address, Phone,
        occupation, email, EPS, img, DateofBirth, DepartamentBirth, MunicipeBirth, role,
        id_BaseSalary, profession } = req.body;

    const Teacher = new TeacherModel({ id_BaseSalary, profession });
    const People = new PeopleModel({
        id, IdType, Names, SureNames, Gender, neighborhood, Address, Phone,
        occupation, email, EPS, img, DateofBirth, DepartamentBirth, MunicipeBirth, role, user
    })

    Teacher.id = People._id;

    await Promise.all([
        SavingOnDB(People),
        SavingOnDB(Teacher)
    ])
        .then(resp => response.success(res, res, 'teacher was stored Safely', 201, resp))
        .catch((e) => response.error(res, res, 'error storeding teacher', 500, e))




};
/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {

    const id_search = req.params.id;
    const { _id,id,...rest } = req.body;
   
    UpdatingOnDB(id_search, TeacherModel, rest)
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