var expres = require('express')
var app = expres();
var Asistencia = require('../../models/discipline/asistencia');
var autenticacion = require('../../middelware/autenticacion');
var Prestamo = require('../../models/facturas/Prestamos');
var Registro = require('../../models/discipline/Registro');
const mensualidad = require('../../models/facturas/mensualidad');



 
//  rutas

//  rutas
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    Asistencia.find({},)
        .skip(desde)
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
        .limit(25)
        .exec(
            (err, asistencia) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando clase',
                        erros: err
                    });
                }
                Asistencia.estimatedDocumentCount({}, (err, conteo) => {

                    console.log(asistencia);

                    res.status(200).json({
                        ok: true,
                        Asistencia: asistencia,
                        total: conteo
                    });

                })


            });




});

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
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var id_usuario = req.usuario._id;
        var tiempoTranscurrido = Date.now();
        var dato;
        var hoy = new Date(tiempoTranscurrido);
        var asistencia = new Asistencia({

            id_registro: body.idregistro,
            fecha: body.fecha,
            asistencia: body.asistencia,
            Pago: body.Pago,
            Usuario: id_usuario

        });
        var prestamo
        // hago una busqueda de registro para poder obtener  los precios diario o mensual  de cada diciplina
        // y poder guardarlos en la en prestamos por si no pagan el dia que se hace la asistencia
        Registro.findOne({ _id: body.idregistro })
            .populate({
                path: 'id_clase',
                select: 'id_diciplina',
                populate: [{
                    path: 'id_diciplina',
                    select: 'valor_hora valor_mensualidad '
                }
                ]
            })
            .exec((err, registrobd) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error buscar contacto',
                        erros: err
                    });
                }
                if (registrobd) {
                    switch (registrobd.Modopagos) {
                        case 'DIARIO':

                            Asistencia.findOne({ id_registro: body.idregistro, fecha: body.fecha })
                                .exec((err, busqueda) => {
                                    if (err) {
                                        return res.status(500).json({
                                            ok: false,
                                            mensaje: 'Error buscar contacto',
                                            erros: err
                                        });
                                    };
                                    if (!busqueda || busqueda == null) {
                                        dato = GuadarAsistencia(asistencia);
                                        if (!asistencia.Pago && asistencia.asistencia) {
                                            prestamo = new Prestamo({
                                                idRegistro: body.idregistro,
                                                ValorDeuda: registrobd.id_clase.id_diciplina.valor_hora,
                                                Fecha: body.fecha,
                                                Descripcion: 'No pago la clase',
                                                Usuario: id_usuario
                                            });
                                            dato = GuadarPrestamo(prestamo);
                                            res.status(200).json({
                                                ok: true,
                                                Registro: dato,
                                                message:'asistencia guardada y prestamo creado'
                                            });
                                        }
                                        else { 
                                            res.status(200).json({
                                                ok: true,
                                                Registro: dato,
                                                message:'asistencia guardada'
                                            });
                                        }

                                    } else {
                                    
                                        busqueda.asistencia = body.asistencia;
                                        busqueda.Pago = body.Pago;
                                        if (!busqueda.Pago) {
                                            prestamo = new Prestamo({
                                                idRegistro: body.idregistro,
                                                ValorDeuda: registrobd.id_clase.id_diciplina.valor_hora,
                                                Fecha: body.fecha,
                                                Descripcion: 'No pago la clase',
                                                Usuario: id_usuario
                                            });
                                            dato = GuadarPrestamo(prestamo);
                                        }

                                        dato = GuadarAsistencia(busqueda);

                                        res.status(200).json({
                                            ok: true,
                                            Registro: dato,
                                            message:'asistencia Actualizada '
                                        });
                                    }
                                });




                            break;
                        case 'MENSUAL':
                            mensualidad.findOne({ id_registro: body.idregistro })
                                .exec((err, registro) => {
                                    if (err) {
                                        return res.status(500).json({
                                            ok: false,
                                            mensaje: 'Error buscar contacto',
                                            erros: err
                                        });
                                    }
                                    if (hoy <= registro.fechaFin) {

                                        asistencia.Pago = true
                                        dato = GuadarAsistencia(asistencia);
                                        res.status(200).json({
                                            ok: true,
                                            Registro: dato
                                        });

                                        // let did = hoy.getTime()   - registro.fechaFin.getTime() ;
                                        // console.log(' faltan '+ Math.round(did / (1000 * 60 * 60 * 24)) + ' para vencerce el pago' );
                                    } else {

                                        dato = GuadarAsistencia(asistencia);
                                        if (asistencia.asistencia && !asistencia.Pago) {
                                            // let did = hoy.getTime()   - registro.fechaFin.getTime() ;
                                            // console.log('vencido hace  ' + Math.round(did / (1000 * 60 * 60 * 24)) +' dias');
                                            prestamo = new Prestamo({
                                                idRegistro: body.idregistro,
                                                ValorDeuda: registrobd.id_clase.id_diciplina.valor_hora,
                                                Fecha: body.fecha,
                                                Descripcion: 'tienes vencido el mes y No pago la clase',
                                                Usuario: id_usuario
                                            });
                                            prestamo.save((err, claseGuardado) => {
                                                if (err) {
                                                    return res.status(400).json({
                                                        ok: false,
                                                        mensaje: 'Error crear registro asistencia de clase',
                                                        erros: err
                                                    });
                                                }
                                                dato += claseGuardado;
                                                res.status(200).json({
                                                    ok: true,
                                                    Registro: dato
                                                });

                                            });
                                        }

                                    }



                                })


                            break;
                    };
                };
            });






    });



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