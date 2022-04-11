var expres = require('express')
var app = expres();
var Prestamo = require('../../modelos/facturas/Prestamos');
var autenticacion = require('../../middelware/autenticacion')


//  rutas
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    Prestamo.find({},)
        .skip(desde)
        .populate('idpersona', ' Nombres Apellidos email' )
        .populate('Usuario',  'Nombre email'
        )
        .limit(5)
        .exec(
            (err, prestamo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando prestamo',
                        erros: err
                    });
                }
                // deportista.count({}, (err, conteo) => {



                // })
                res.status(200).json({
                    ok: true,
                    prestamos: prestamo,
                    // total: conteo
                });

            });




});

// ==============================
// ingresar Prestamo nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var id_usuario = req.usuario._id;
        var prestamo = new Prestamo({
            idpersona: body.idpersona,
            Descripcion: body.descripcion,
            ValorDeuda: body.valorDeuda,
            Fecha: body.Fecha,
            Usuario: id_usuario

        });


        prestamo.save((err, prestamoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error crear prestamo',
                    erros: err
                });
            }
            res.status(201).json({
                ok: true,
                mensaje: 'Prestamo registrado',
                Datos: prestamoGuardado
            });

        });
    });

    // ==============================
// actualizar  los Personas
// ==============================

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Prestamo.findById(id, (err, prestamo) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar prestamo',
                erros: err
            });
        }

        if (!prestamo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'prestamo con ' + id + ' no existe',
                erros: { message: 'no existe el prestamo con ese id ' }
            });
        }

        prestamo.Descripcion = body.descripcion;
        prestamo.estado = body.estado;
   
        prestamo.save((err, prestamoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuraio',
                    erros: err
                });
            }

            res.status(200).json({
                ok: true,
                prestamo: prestamoGuardado
            });

        });

    });

});

// ==============================
// eliminar  
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var data;

    Prestamo.findByIdAndRemove(id, (err, prestamoborrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar prestamo',
                erros: err
            });
        }
        if (!prestamoborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'persona con ' + id + ' no existe',
                erros: { message: 'no existe el persona con ese id ' }
            });
        }
    
        res.status(200).json({
            ok: true,
            usuario: prestamoborrado
        });


    });


});

module.exports = app;