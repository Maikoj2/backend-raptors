const { TeacherModel, PeopleModel } = require('../../models')
const { saveRegister } = require('../../helpers/SavingOnDB');
const UpdateRegister = require('../../helpers/UpdatingOnDB');



/**
 * get a  list 
 * @param {*} req 
 * @param {*} res 
 */
const getItems = async (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    TeacherModel.find({})
        .skip(from)
        .populate(
            [
                {
                    path: '_id',
                    populate: [{
                        path: 'user',
                        select: 'Nombre email'
                    }]
                },
                {
                    path: 'id_BaseSalary'
                }
            ]
        )
        .limit(5)
        .exec((err, reg) => {
            if (err) return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuraio',
                erros: err
            });
            TeacherModel.estimatedDocumentCount({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    register: reg,
                    total: count
                });
            });
        });
};

/**
 * get a data
 * @param {*} req 
 * @param {*} res 
 */
const getItem = (req, res) => { };

/**
 * create new register 
 * @param {*} req 
 * @param {*} res 
 */
const createItem = async (req, res) => {

    const { body } = req;
    const id_user = req.user._id;

    const Teacher = new TeacherModel({
        _id: body._id,
        id_BaseSalary: body.id_BaseSalary,
        profession: body.profession
    });

    saveRegister(Teacher)
        .then(resp => {
            res.status(200).json({
                ok: true,
                message: 'teacher was stored Safely',
                People: resp[1],
                Teacher: resp[0],
            });
        })
        .catch((e) => {
            console.log(e)
            return res.status(500).json({
                ok: false,
                message: 'Error storeding Teacher',
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
    const id_user = req.user._id;
    const Teacher = new TeacherModel({
        _id: body._id,
        id_BaseSalary: body.id_BaseSalary,
        profession: body.profession
    });



    UpdateRegister(id, TeacherModel, Teacher)
        .then(resp => {
            res.status(200).json({
                ok: true,
                message: 'teacher was updated Safely',
                profesor: resp,
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

/**
 * delete a existing record
 * @param {*} req 
 * @param {*} res 
 */
const deleteItem = async (req, res) => {
    /**TODO
     * create rute class an implemente this deletd
     */
};

module.exports = {
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
}