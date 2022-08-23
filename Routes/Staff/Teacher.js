const expres = require('express')
const app = expres();
const { check } = require('express-validator')
const autenticacion = require('../../middleware/autenticacion')
const Persona = require('../../models/staff/people');
const Profesor = require('../../models/staff/Teacher');
const Clase = require('../../models/discipline/class');
const { getItems, createItem, updateItem } = require('../../Controllers/Staff/Teacher');
const { isRolValid, ExistById } = require('../../helpers/Validators/dbValidators');
const { validateFields } = require('../../middleware/ValidateInputs');
const { BaseSalaryModel, TeacherModel } = require('../../models');

/**
 * get al  teachers registered 
 */
app.get('/', getItems);
/**
 * upodate a Teache by id
 */
app.put('/:id-search',[ 
    check('id-search', 'the id is invalide').isMongoId(),
    check('role').custom(isRolValid),
    check('id').custom((id) => ExistById(id, TeacherModel)),
    check('id_BaseSalary').custom((id_BaseSalary) => ExistById(id_BaseSalary, BaseSalaryModel)),
    validateFields,
    autenticacion.verificatoken],updateItem);
/**
 * save a register on data base (a teacher)
 */
app.post('/',[
    check('id', 'the id is required').not().isEmpty(),
    check('Names', 'the Names is required').not().isEmpty(),
    check('IdType', 'the IdType is required').not().isEmpty(),
    check('SureNames', 'the SureNames is required').not().isEmpty(),
    check('Gender', 'the Gender is required').not().isEmpty(),
    check('neighborhood', 'the neighborhood is required').not().isEmpty(),
    check('Address', 'the Address is required').not().isEmpty(),
    check('Phone', 'the Phone is required').not().isEmpty(),
    check('occupation', 'the occupation is required').not().isEmpty(),
    check('DateofBirth', 'the DateofBirth is required').not().isEmpty(),
    check('DepartamentBirth', 'the DepartamentBirth is required').not().isEmpty(),
    check('id_BaseSalary').custom((id_BaseSalary) => ExistById(id_BaseSalary, BaseSalaryModel)),
    check('profession', 'the profession is required').not().isEmpty(),
    check('email', 'the email is ivalide').isEmail(),
    check('role').custom(isRolValid),
    validateFields, 
    autenticacion.verificatoken], createItem);

/**
 * 
 * [TODO]
 * 
 */

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    const id = req.params.id;
    buscarclase(id).then(clases => {

        if (Object.keys(clases).length === 0 || clase == null) {
            Promise.all([
                BuscarBorrarpersona(id),
                BuscarBorrarProfesor(id)

            ]).then(Dato => {
                res.status(201).json({
                    ok: true,
                    mensaje: 'registro fue borrado',
                    persona: Dato[0],
                    profesor: Dato[1]
                });

            })
        } else {
            res.status(200).json({
                ok: true,
                message: ' este profesor esta asignado a las siguientes clases',
                asistencia: clases

            });
        }



    });

});
 
// funciones de busquedad  para borrar////

function buscarclase(busqueda) {
    return new Promise((resolve, reject) => {
        Clase.find({ id_Profe: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, clase) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(clase)
                }

            });

    });


}
function BuscarBorrarpersona(busqueda) {
    return new Promise((resolve, reject) => {
        Persona.deleteOne({ _id: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, persona) => {

                if (err) {
                    reject('error al cargar persona')
                } else {
                    resolve(persona)
                }

            });

    });


}

function BuscarBorrarProfesor(busqueda) {
    return new Promise((resolve, reject) => {
        Profesor.deleteOne({ _id: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, Profesor) => {

                if (err) {
                    reject('error al cargar Profesor')
                } else {
                    resolve(Profesor)
                }

            });

    });


}




module.exports = app;
