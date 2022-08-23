var expres = require('express')
var app = expres();
var Asistencia = require('../../models/discipline/attendance');
var autenticacion = require('../../middleware/autenticacion');
var Prestamo = require('../../models/facturas/loan');
var Registro = require('../../models/discipline/signUpClass');
const mensualidad = require('../../models/facturas/MonthlyPayment');
const { getItems, createItem } = require('../../Controllers/discipline/Attendance');



 
//  rutas

//  rutas
app.get('/', getItems);

// ==============================
// actualizar  los asistencia
// ==============================

app.put('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Asistencia.findById(id, (err, asistencia) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar asistencia',
                erros: err
            });
        }

        if (!asistencia) {
            return res.status(400).json({
                ok: false,
                mensaje: 'asistencia con ' + id + ' no existe',
                erros: { message: 'no existe el asistencia con ese id ' }
            });
        }

        asistencia.fecha = body.fecha;
        asistencia.estado = body.estado;
        asistencia.Usuario = req.usuario._id;

        asistencia.save((err, asistenciaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuraio',
                    erros: err
                });
            }
            asistenciaGuardado.password = '<3'
            res.status(200).json({
                ok: true,
                asistencia: asistenciaGuardado
            });

        });

    });

});


// ==============================
// ingresar Clase nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,createItem);



// ==============================
// eliminar  los Usuarios
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

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

//////FUNCIONES//////

function GuadarAsistencia(asistencia) {

    asistencia.save((err, Guardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear registro asistencia de clase',
                erros: err
            });
        }
        return Guardado;
    });

}
function GuadarPrestamo(Prestamo) {

    Prestamo.save((err, Guardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error crear Prestamo asistencia de clase',
                erros: err
            });
        }
        return Guardado;
    });

}

module.exports = app;