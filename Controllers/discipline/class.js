
const { ClassModel } = require("../../models");
const { response, UpdatingOnDB, SavingOnDB } = require('../../helpers');

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    const count = await ClassModel.estimatedDocumentCount();
    await ClassModel.find({})
        .populate([{
            path: 'id_teacher',
            select: 'id id_BaseSalary profession',
            populate: [{
                path: 'id',
                select: 'Names id SureNames email'
            }]
        },
        {
            path: 'id_discipline',
            select:'Name valuePerHour valuePerMonth'
        },
        {
            path: 'User',
            select:'Name email'
        }
    ])
        .skip(from)
        .limit(5)
        .exec(
            (err, disciplne) => {
                if (err) return response.error(res, res, 'error loandig  Class', 500, err);
                response.success(res, res, 'load completed', 200, disciplne, count)
            });
};

/**
* create new register 
* @param {*} req 
* @param {*} res 
*/
const createItem = async (req, res) => {
    const id_user = req.user._id;
    const { body } = req;
    const Classs = new ClassModel({
        Name: body.Name,
        id_discipline: body.id_discipline,
        id_teacher: body.id_teacher,
        DateStart: body.DateStart,
        DateEnd: body.DateEnd,
        schedule: body.schedule,
        Place: body.Place,
        HourStart: body.HourStart,
        HourEnd: body.HourEnd,
        User: id_user,
    });
    Classs.id = Classs._id;
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
    const { body } = req;
    const Discipline = new ClassModel({
        Name: body.Name,
        id_discipline: body.id_discipline,
        id_teacher: body.id_teacher,
        DateStart: body.DateStart,
        DateEnd: body.DateEnd,
        schedule: body.schedule,
        Place: body.Place,
        HourStart: body.HourStart,
        HourEnd: body.HourEnd,
        User: id_user,
    });
    Discipline._id = id;
    Discipline.id = id;

    UpdatingOnDB(id, ClassModel, Discipline)
        .then(resp => response.success(req, res, 'class was updated Safely', 200, resp))
        .catch((e) => response.error(req, res, 'error Updating class', 500, e))
};


module.exports = {
    getItems,
    createItem,
    updateItem

}
