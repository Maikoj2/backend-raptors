const { SearchingAllOnDB, response, Populate, SavingOnDB, UpdatingOnDB } = require("../../helpers");
const { LoanModel } = require("../../models");

/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {

    const { from = 0, limit = 5 } = req.query;
    const query = { deleted: false }
    await Promise.all([
        LoanModel.countDocuments(query),
        SearchingAllOnDB(LoanModel, Number(from), Number(limit), query, Populate.Loan)
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for Loands', 500, err))
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const User = req.user._id;
    const { idPeople, description, valueToPay, Date } = req.body;
    const loan = new LoanModel({
        idPeople, description, valueToPay, Date, User
    });


    SavingOnDB(loan)
        .then(resp => response.success(res, res, 'loan was stored Safely', 201, resp))
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
    const { _id, idPeople, Date,...rest } = req.body;
    rest.User = User;
      UpdatingOnDB(id, LoanModel, rest)
        .then(resp => response.success(req, res, 'Loan was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating athlete', 500, e))
};


/**
 * delete a existing record
 * @param {*} req 
 * @param {*} res 
 */
 const deleteItem = async (req, res) => {
    const { id } = req.params;
    await UpdatingOnDB(id, LoanModel, { deleted: true} )
    .then((savededUser) => {response.success(req, res, 'loan has been deleted successfully', 200, savededUser)})
};

module.exports = {
    getItems,
    // getItem,
    createItem,
    updateItem,
     deleteItem
}