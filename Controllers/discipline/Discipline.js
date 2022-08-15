
const { DisciplineModel } = require("../../models");
const { response, UpdatingOnDB,  SavingOnDB } = require('../../helpers');

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    const count = await DisciplineModel.estimatedDocumentCount();
    await DisciplineModel.find({})
        .skip(from)
        .limit(5)
        .exec(
            (err, disciplne) => {
                if (err) return  response.error(res, res,'error loandig  Disciplne', 500, err);
                 response.success(res, res, 'load completed', 200, disciplne, count )
            });
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {

    const { body } = req;
    const Discipline = new DisciplineModel({
        Name: body.Name,
        valuePerHour: body.valuePerHour,
        valuePerMonth: body.valuePerMonth,
    });
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

    const id = req.params.id;
    const { body } = req;
    const Discipline = new DisciplineModel({
        Name: body.Name,
        valuePerHour: body.valuePerHour,
        valuePerMonth: body.valuePerMonth,
    });
    Discipline._id = id;
    Discipline.id = id;

    UpdatingOnDB(id, DisciplineModel, Discipline)
        .then(resp =>  response.success(req, res, 'disciplne was updated Safely', 200, resp))
        .catch((e) =>  response.error(req, res,'error Updating disciplne', 500, e))
};


module.exports = {
    getItems,
    createItem,
    updateItem

}
