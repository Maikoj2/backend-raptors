require('module-alias/register')
const { ClassModel } = require('@models');
const { response, UpdatingOnDB, SavingOnDB, Populate, SearchingAllOnDB } = require('@helpers');

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    const { from = 0, limit = 5 } = req.query;
    const query = { deleted: false }
    await Promise.all([
        ClassModel.countDocuments(query),
        SearchingAllOnDB(ClassModel, Number(from), Number(limit), query, Populate.Class)
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for class', 500, err))
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const User = req.user._id;
    const { Names, id_discipline, id_teacher, DateStart, DateEnd, schedule, Place, HourStart, HourEnd} = req.body;
    const Classs = new ClassModel({ Names, id_discipline, id_teacher, DateStart, DateEnd, schedule,Place, HourStart, HourEnd, User});
    SavingOnDB(Classs)
        .then(resp => response.success(res, res, 'class was stored Safely', 201, resp))
        .catch((e) => response.error(res, res, 'error storeding peopel', 500, e))
};

/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {
    const id_user = req.user._id;
    const id = req.params.id;
    const { _id, ...rest  } = req.body;
    rest.User = id_user;
    UpdatingOnDB(id, ClassModel, rest)
        .then(resp => response.success(req, res, 'class was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating class', 500, e))
};


module.exports = {
    getItems,
    createItem,
    updateItem

}
