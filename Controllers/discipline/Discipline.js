
const { DisciplineModel } = require("../../models");
const { response, UpdatingOnDB,  SavingOnDB} = require('../../helpers');

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const { from = 0, limit = 5 } = req.query;
    const query = { deleted: false }
    await Promise.all([
        DisciplineModel.countDocuments(query),
        SearchingAllOnDB(DisciplineModel, Number(from), Number(limit), query)
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for Staff', 500, err))
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {

    const { Names, valuePerHour, valuePerMonth } = req.body;
    const Discipline = new DisciplineModel({Names, valuePerHour, valuePerMonth,});
    Discipline.id = Discipline._id;
    SavingOnDB(Discipline)
        .then(resp => response.success(res, res, 'disciplne was stored Safely', 201, resp))
        .catch((e) => response.error(res, res,'error storeding peopel', 500, e))
};

/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {

    const {id} = req.params;
    const { _id, ...rest } = req.body;
    UpdatingOnDB(id, DisciplineModel, rest)
        .then(resp =>  response.success(req, res, 'disciplne was updated Safely', 200, resp))
        .catch((e) =>  response.error(req, res,'error Updating disciplne', 500, e))
};


module.exports = {
    getItems,
    createItem,
    updateItem

}
