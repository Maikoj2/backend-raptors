require('module-alias/register')
const { SearchingAllOnDB, response, SavingOnDB, UpdatingOnDB } = require('@helpers');
const {  BaseSalaryModel } = require('@models');

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {

    const { from = 0, limit = 5 } = req.query;
    const query = { deleted: false }
    await Promise.all([
        BaseSalaryModel.countDocuments(query),
        SearchingAllOnDB(BaseSalaryModel, Number(from), Number(limit), query)
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user , count))
        .catch((err) => response.error(res, res, 'error loandig data for Base salary', 500, err))
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const User = req.user._id;
    const { position, BaseSalary, valuePerHour } = req.body;
    valuePerHour = BaseSalary/240;
    const loan = new BaseSalaryModel({
        position, BaseSalary, valuePerHour, User
    });


    SavingOnDB(loan)
        .then(resp => response.success(res, res, 'Base salary was stored Safely', 201, resp))
        .catch((e) => response.error(res, res, 'error storeding peopel', 500, e))
};

/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {
    const User = req.user._id;
    const id = req.params.id;
    const { _id, ...rest } = req.body;
    rest.User = User;
      UpdatingOnDB(id, BaseSalaryModel, rest)
        .then(resp => response.success(req, res, 'Base salary was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating Base salary ', 500, e))
};


/**
 * delete a existing record
 * @param {*} req 
 * @param {*} res 
 */
 const deleteItem = async (req, res) => {
    const { id } = req.params;
    
     BaseSalaryModel.delete({_id:id})
    .then((deletedData) => {response.success(req, res, 'Base salary has been deleted successfully', 200, deletedData)})
};

module.exports = {
    getItems,
    // getItem,
    createItem,
    updateItem,
     deleteItem
}