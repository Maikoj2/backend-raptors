var expres = require('express')
var app = expres();
var Asistencia = require('../../models/discipline/asistencia');
var pagodiario = require('../../models/facturas/pagos_diario');
var Registro = require('../../models/discipline/Registro');
var autenticacion = require('../../middelware/autenticacion')



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
            (err, pagodiario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando pagodiario',
                        erros: err
                    });
                }
                console.log(pagodiario);
                res.status(200).json({
                    ok: true,
                    Datos: pagodiario,
                });
               

            });




});

    // ==============================
// actualizar  los Personas
// ==============================

app.put('/:id',autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    pagodiario.findById(id, (err, pagodiarioBuscado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar pagodiario',
                erros: err
            });
        }

        if (!pagodiarioBuscado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'pagodiario con ' + id + ' no existe',
                erros: { message: 'no existe el pagodiario con ese id ' }
            });
        }

        pagodiarioBuscado.valor = body.valor;
        pagodiarioBuscado.save((err, pagodiarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuraio',
                    erros: err
                });
            }

            res.status(200).json({
                ok: true,
                pagodiario: pagodiarioGuardado
            });

        });

    });

});


// ==============================
// eliminar  
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;

    pagodiario.deleteOne({_id: id}, (err, pagodiarioborrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar pagodiario',
                erros: err
            });
        }
        if (!pagodiarioborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'persona con ' + id + ' no existe',
                erros: { message: 'no existe el persona con ese id ' }
            });
        }
    
        res.status(200).json({
            ok: true,
            usuario: pagodiarioborrado
        });


    });


});


module.exports = app;