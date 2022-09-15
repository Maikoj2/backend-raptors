require('module-alias/register')
const { StaffModel, PeopleModel } = require('@models')
const { response, UpdatingOnDB, SavingOnDB, SearchingAllOnDB, Populate } = require('@helpers');


/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const { from = 0, limit = 5 } = req.query;
    const query = { deleted: false }
    await Promise.all([
        StaffModel.countDocuments(query),
        SearchingAllOnDB(StaffModel, Number(from), Number(limit), query, Populate.staff )
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for Staff', 500, err))
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
        id_BaseSalary, profession, TypeSalary } = req.body;

    const staff = new StaffModel({ id_BaseSalary, profession,TypeSalary });
    const People = new PeopleModel({
        id, IdType, Names, SureNames, Gender, neighborhood, Address, Phone,
        occupation, email, EPS, img, DateofBirth, DepartamentBirth, MunicipeBirth, role, user
    })

    staff.id = People._id;

    await Promise.all([
        SavingOnDB(People),
        SavingOnDB(staff)
    ])
        .then(resp => response.success(res, res, 'staff was stored Safely', 201, resp))
        .catch((e) => response.error(res, res, 'error storeding staff', 500, e))
};
/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {

    const id_search = req.params.id;
    const { _id,id,...rest } = req.body;
   
    UpdatingOnDB(id_search, StaffModel, rest)
        .then(resp => response.success(req, res, 'staff was updated Safely', 200, resp)
        ).catch((e) => response.error(req, res, 'error Updating staff', 500, e))
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