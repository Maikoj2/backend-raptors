var expres = require('express')
var app = expres();
var Asistencia = require('../../modelos/clases/asistencia');
var pagodiario = require('../../modelos/facturas/pagos_diario');
var Registro = require('../../modelos/clases/Registro');


//  rutas
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    var prueba ;
    pagodiario.find({})
    .populate({
        path: 'id_registro',
        select: 'id_deportista id_clase _id',
        populate: [{
            path: 'id_clase',
            select: 'Nombre Horario Lugar HoraInicio HoraFin '
        },
        {
            path: 'id_deportista',
            select: 'Nombres  Apellidos _id'
        }
        ]
    })
        .exec(
            (err, prestamo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando prestamo',
                        erros: err
                    });
                }
                console.log(prestamo);
                res.status(200).json({
                    ok: true,
                    Datos: prestamo,
                });
               

            });




});


module.exports = app;