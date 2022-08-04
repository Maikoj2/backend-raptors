const { saveRegister } = require('../../helpers/SavingOnDB');
const UpdateRegister = require('../../helpers/UpdatingOnDB');
const { PeopleModel } = require('../../models')

/**
 * get all register 
 * @param {*} req 
 * @param {*} res 
 */

const getItems = async (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    await PeopleModel.find({})
        .skip(from)
        .limit(5)
        .exec(
            (err, people) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error loanding People',
                        erros: err
                    });
                }
                PeopleModel.estimatedDocumentCount({}, (err, count) => {

                    res.status(200).json({
                        ok: true,
                        people: people,
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
    const id_user = req.user._id;

    const People = new PeopleModel({
        _id: body._id,
        IdType: body.IdType,
        Names: body.Names,
        SureNames: body.SureNames,
        Gender: body.Gender,
        neighborhood: body.neighborhood,
        Address: body.Address,
        Phone: body.Phone,
        occupation: body.occupation,
        email: body.email,
        EPS: body.EPS,
        DateofBirth: body.DateofBirth,
        DepartamentBirth: body.DepartamentBirth,
        MunicipeBirth: body.MunicipeBirth,
        role: body.role,
        user: id_user
    });
     await saveRegister(People)
        .then(resp => {
            res.status(200).json({
                ok: true,
                message: 'people was stored Safely',
                People: resp
            });
        })
        .catch((e) => {
            console.log(e)
            return res.status(500).json({
                ok: false,
                message: 'Error storeding peopel',
                erros: e
            });
        })


};

/**
 * Update whit id register 
 * @param {*} req 
 * @param {*} res 
 */

const updateItem = async (req, res) => {

    const id = req.params.id;
    const { body } = req;
    const id_user = req.user._id;
    const People = new PeopleModel({
        IdType: body.IdType,
        _id: body._id,
        Names: body.Names,
        SureNames: body.SureNames,
        Gender: body.Gender,
        neighborhood: body.neighborhood,
        Address: body.Address,
        Phone: body.Phone,
        occupation: body.occupation,
        email: body.email,
        EPS: body.EPS,
        DateofBirth: body.DateofBirth,
        DepartamentBirth: body.DepartamentBirth,
        MunicipeBirth: body.MunicipeBirth,
        role: body.role,
        user: id_user

    });

    UpdateRegister(id, PeopleModel, People)
        .then(resp => {
            res.status(200).json({
                ok: true,
                message: 'teacher was updated Safely',
                persona: resp
            })
        }
        ).catch((e) => {
            return res.status(500).json({
                ok: false,
                message: 'Error Updating Teacher',
                erros: e
            });
        })
};

module.exports = {
    getItems,
    createItem,
    updateItem
}