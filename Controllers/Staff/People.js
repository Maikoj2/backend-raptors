
const { PeopleModel } = require('../../models')
const { response, UpdatingOnDB, SavingOnDB, SearchingAllOnDB } = require('../../helpers');


/**
 * get all register 
 * @param {*} req 
 * @param {*} res 
 */

const getItems = async (req, res) => {

    const { from = 0, limit = 5 } = req.query;
    const query = { deleted: false }

    await Promise.all([
        PeopleModel.countDocuments(query),
        SearchingAllOnDB(PeopleModel, Number(from), Number(limit), query, [] )
    ])
        .then(([count, user]) => response.success(res, res, 'load completed', 200, user, count))
        .catch((err) => response.error(res, res, 'error loandig data for peoples', 500, err))
}
/**
 * create new register 
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {

    const { body } = req;
    const id_user = req.user._id;

    const People = new PeopleModel({
        id: body._id,
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
    await SavingOnDB(People)
        .then(resp => response.success(res, res, 'people was stored Safely', 201, resp))
        .catch((e) => response.error(res, res, 'error storeding peopel', 500, e))


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
    People._id = id;
    People.id = id;

    UpdatingOnDB(id, PeopleModel, People)
        .then(resp => response.success(req, res, 'people was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating people', 500, e))
};

module.exports = {
    getItems,
    createItem,
    updateItem
}