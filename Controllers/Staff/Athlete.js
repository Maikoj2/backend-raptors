
const { AthletesModel } = require("../../models");
const { response, UpdatingOnDB,  SavingOnDB } = require('../../helpers');

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    await AthletesModel.find({})
        .skip(from)
        .populate(
            [{
                path: '_id',
                populate: [{
                    path: 'user',
                    select: 'Nombre email'
                }]
            }])
        .limit(5)
        .exec(
            (err, athlete) => {
                if (err) return  response.error(res, res,'error loandig  Athlete', 500, err);
                AthletesModel.estimatedDocumentCount({}, 
                    (count) => response.success(res, res, 'load completed', 200, athlete, count )
                )

            });
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {

    const { body } = req;
    const Athletes = new AthletesModel({
        _id: body._id,
        age: body.age,
        IdContact: body.IdContact,
        IdContact2: body.IdContact2,
        ailments: body.ailments,
        medicines: body.medicines,
        allergies: body.allergies,
        bloodType: body.bloodType,
        shoeSize: body.shoeSize,
        tShirtSize: body.tShirtSize,
        tShortSize: body.tShortSize,
        height: body.height,
        weight: body.weight,
        state: body.state,
    });
    SavingOnDB(Athletes)
        .then(resp => response.success(res, res, 'athlete was stored Safely', 201, resp))
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
    const Athlete = new AthletesModel({
        _id: body._id,
        age: body.age,
        IdContact: body.IdContact,
        IdContact2: body.IdContact2,
        ailments: body.ailments,
        medicines: body.medicines,
        allergies: body.allergies,
        bloodType: body.bloodType,
        shoeSize: body.shoeSize,
        tShirtSize: body.tShirtSize,
        tShortSize: body.tShortSize,
        height: body.height,
        weight: body.weight,
        state: body.state,
    });

    UpdatingOnDB(id, AthletesModel, Athlete)
        .then(resp =>  response.success(req, res, 'athlete was updated Safely', 200, resp))
        .catch((e) =>  response.error(req, res,'error Updating athlete', 500, e))
};


module.exports = {
    getItems,
    createItem,
    updateItem

}
