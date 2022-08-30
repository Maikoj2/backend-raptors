const expres = require('express')
const app = expres();
const { getItems, createItem, updateItem } = require('../../Controllers/discipline/class');
const { check  } = require('express-validator');
const { ClassModel, DisciplineModel, StaffModel } = require('../../models');
const { token, valid } = require('../../middleware');
const { ExistById, ExistTeacher } = require('../../helpers/Validators/dbValidators');



//  rutas
app.get('/', getItems);

// ==============================
// ingresar Clase nuevo 
// ==============================
app.post('/', [
    check('Names', 'the Names is required').not().isEmpty(),
    check('id_discipline').isMongoId().bail().custom((id_discipline) => ExistById(id_discipline, DisciplineModel)),
    check('id_teacher').isMongoId().bail().custom((id_teacher) => ExistTeacher(id_teacher, StaffModel)),
    check(['Names', 'DateStart','DateEnd',  'schedule' , 'Place' , 'HourStart', 'HourEnd' ], `data can't be empty`).not().isEmpty(),
    valid.validateFields,
    token.verificatoken
], createItem);

// ==============================
// actualizar  los Personas
// ==============================

app.put('/:id', [
    check('id').isMongoId().bail().custom((id) => ExistById(id, ClassModel)),
    check('id_discipline').isMongoId().bail().custom((id_discipline) => ExistById(id_discipline, DisciplineModel)),
    check('id_teacher').isMongoId().bail().custom((id_teacher) => ExistTeacher(id_teacher, StaffModel)),
    check(['Names', 'DateStart','DateEnd',  'schedule' , 'Place' , 'HourStart', 'HourEnd' ], `data can't be empty`).not().isEmpty(),
    valid.validateFields,
    token.verificatoken
    ], updateItem);



// ==============================
// eliminar  los clase
// ==============================

// app.delete('/:id',token(req, res) => {

//     const id = req.params.id;
//     let data = '';

//     Registro.findOne({ id_clase: id }, (err, claseborrado) => {


//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error borar clase',
//                 erros: err
//             });
//         }
        
//         if (claseborrado != null ||  claseborrado == {}) {
//             return res.status(205).json({
//                 ok: false,
//                 mensaje: 'la clase con id: ' + id + ' tiene registrado alumnos  ',
//                 erros: { message: 'borre los registros antes de borrar una clase ' }
//             });
//         }
//         clase.deleteOne({_id: id}, (err, claseborrado) => {


//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     mensaje: 'Error borar clase',
//                     erros: err
//                 });
//             }
//             if (!claseborrado) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'no hay una clase  con ' + id + ' no existe',
//                     erros: { message: 'no existe la clase  con ese id ' }
//                 });
//             }
//             data = `${data} ${claseborrado}`;
        

//         });
//         res.status(201).json({
//             ok: true,
//             mensaje: 'la clase tiene fue borrada',
//             data: data
//         });

//     });


// });




module.exports = app;