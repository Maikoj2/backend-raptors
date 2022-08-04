
const { saveRegister } = require("../../helpers/SavingOnDB");
const UpdateRegister = require("../../helpers/UpdatingOnDB");
const { AthletesModel } = require("../../models");




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
            [
                {
                    path: '_id',
                    populate: [{
                        path: 'user',
                        select: 'Nombre email'
                    }]
                }
            ]
        )
        .limit(5)
        .exec(
            (err, user) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error loandig  Athlete',
                        erros: err
                    });
                }
                AthletesModel.estimatedDocumentCount({}, (err, count) => {

                    res.status(200).json({
                        ok: true,
                        Athlete: user,
                        total: count
                    });

                })


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
    saveRegister(Athletes)
        .then(resp => {
            res.status(200).json({
                ok: true,
                message: 'athlete was stored Safely',
                People: resp
            });
        })
        .catch((e) => {
            console.log(e)
            return res.status(500).json({
                ok: false,
                message: 'Error storeding Athlete',
                erros: e
            });
        })


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

    UpdateRegister(id, AthletesModel, Athlete)
        .then(resp => {
            res.status(200).json({
                ok: true,
                message: 'Athlete was updated Safely',
                profesor: resp,
            })
        }
        ).catch((e) => {
            return res.status(500).json({
                ok: false,
                message: 'Error Updating Athlete',
                erros: e
            });
        })
};


module.exports = {
    getItems,
    createItem,
    updateItem

}
