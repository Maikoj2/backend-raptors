
const { AthletesModel, ContactModel } = require("../../models");
const { response, UpdatingOnDB, SavingOnDB } = require('../../helpers');

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    const count = await AthletesModel.estimatedDocumentCount();


    await AthletesModel.find({})
        .skip(from)
        .populate(
            [{
                path: 'id',
                populate: [{
                    path: 'user',
                    select: 'Nombre email'
                }]
            },{ path: 'IdContact' }
        ])
        .limit(5)
        .exec(
            (err, athlete) => {
                if (err) return response.error(res, res, 'error loandig  Athlete', 500, err);
                response.success(res, res, 'load completed', 200, athlete, count)


            });
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {

    const { body } = req;
    const Contact = new ContactModel({
        id: body.IdContact,
        Names: body.Names,
        SureNames: body.SureNames,
        neighborhood: body.neighborhood,
        Address: body.Address,
        Phone: body.Phone,
        occupation: body.occupation,
        email: body.email,

    });
    const Athletes = new AthletesModel({
        id: body._id,
        age: body.age,
        IdContact: Contact._id,
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

    Promise.all([
        SavingOnDB(Athletes),
        SavingOnDB(Contact)
    ])
        .then(resp => response.success(res, res, 'athlete was stored Safely', 201, resp))
        .catch((e) => response.error(res, res, 'error storeding peopel', 500, e))
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createcontact = async (req, res) => {

    const { body } = req;
    const Contact = new ContactModel({
        id: body.IdContacto,
        Names: body.Names,
        SureNames: body.SureNames,
        neighborhood: body.neighborhood,
        Address: body.Address,
        Phone: body.Phone,
        occupation: body.occupation,
        email: body.email,

    });

    SavingOnDB(Contact)
        .then(resp => response.success(res, res, 'athlete was stored Safely', 201, resp))
        .catch((e) => response.error(res, res, 'error storeding peopel', 500, e))
};
/**
 * update a existing record 
 * @param {*} req 
 * @param {*} res 
 */

const updatecontact = async (req, res) => {

    const id = req.params.id;
    const { body } = req;
    const Contact = new ContactModel({
        id: body.IdContacto,
        Names: body.Names,
        SureNames: body.SureNames,
        neighborhood: body.neighborhood,
        Address: body.Address,
        Phone: body.Phone,
        occupation: body.occupation,
        email: body.email,

    });
    Contact._id = id;
    UpdatingOnDB(id, ContactModel, Contact)
        .then(resp => response.success(req, res, 'athlete was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating athlete', 500, e))
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
    Athlete._id = id;
    Athlete.id = id;

    UpdatingOnDB(id, AthletesModel, Athlete)
        .then(resp => response.success(req, res, 'athlete was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating athlete', 500, e))
};


module.exports = {
    getItems,
    createItem,
    updateItem,
    createcontact,
    updatecontact

}
