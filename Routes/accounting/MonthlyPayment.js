var expres = require('express')
var app = expres();
var pagomensual = require('../../models/facturas/mensualidad');
var autenticacion = require('../../middelware/autenticacion')




//  rutas
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var prueba ;
    pagomensual.find({})
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

    // ==============================
// actualizar  los Personas
// ==============================

app.put('/:id',autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    pagomensual.findById(id, (err, pagomensualBuscado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar pagomensual',
                erros: err
            });
        }

        if (!pagomensualBuscado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'pagomensual con ' + id + ' no existe',
                erros: { message: 'no existe el pagomensual con ese id ' }
            });
        }

        pagomensualBuscado.valor = body.valor;
        pagomensualBuscado.fechaInicio = body.fechaInicio;
        pagomensualBuscado.fechaFin = body.fechaFin;
        pagomensualBuscado.save((err, pagomensualGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuraio',
                    erros: err
                });
            }

            res.status(200).json({
                ok: true,
                pagomensual: pagomensualGuardado
            });

        });

    });

});


// ==============================
// eliminar  
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;

    pagomensual.deleteOne({_id: id}, (err, pagomensualborrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar pagomensual',
                erros: err
            });
        }
        if (!pagomensualborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'persona con ' + id + ' no existe',
                erros: { message: 'no existe el persona con ese id ' }
            });
        }
    
        res.status(200).json({
            ok: true,
            usuario: pagomensualborrado
        });


    });


});


module.exports = app;