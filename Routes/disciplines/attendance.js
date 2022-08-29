var expres = require('express')
var app = expres();
const { check  } = require('express-validator');
var Asistencia = require('../../models/discipline/attendance');
 const { token, valid } = require('../../middleware');
const { getItems, createItem, updateItem } = require('../../Controllers/discipline/Attendance');
const { ClassModel } = require('../../models');
const { ExistById } = require('../../helpers/Validators/dbValidators');



 
//  rutas

//  rutas
app.get('/', getItems);

// ==============================
// actualizar  los asistencia
// ==============================

app.put('/:id',[
    check('id', 'the id is invalide').isMongoId(),
    check(['Attendance','pay' ],'the data is requeride').not().isEmpty(),
    check(['Date'],).not().isEmpty(),
    valid.validateFields,
    token.verificatoken], updateItem);


// ==============================
// ingresar Clase nuevo 
// ==============================
app.post('/',[
    
    check('Date', 'the Date is required').not().isEmpty(),
    check(['id_class']).isMongoId().bail() .custom((id_class) => ExistById(id_class, ClassModel)),
    valid.validateFields,
    token.verificatoken], createItem);



// ==============================
// eliminar  los Usuarios
// ==============================

app.delete('/:id',token.verificatoken,(req, res) => {

    var id = req.params.id;
    var data;


    Asistencia.deleteOne({_id: id}, (err, registroborrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar registro',
                erros: err
            });
        }
        if (!registroborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'registro de asistencia  con ' + id + ' no existe',
                erros: { message: 'no existe el registro con ese id ' }
            });
        }

        data = registroborrado;
        res.status(200).json({
            ok: true,
            usuario: data
        });


    });




});


module.exports = app;