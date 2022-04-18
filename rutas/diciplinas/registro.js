var expres = require('express')
var app = expres();
var Registro = require('../../modelos/clases/Registro');
var Clase = require('../../modelos/clases/clase');
var Pagodiario = require('../../modelos/facturas/pagos_diario');
var pagosMensuales = require('../../modelos/facturas/mensualidad');
var autenticacion = require('../../middelware/autenticacion');
var Prestamo = require('../../modelos/facturas/Prestamos');
var asistencia = require('../../modelos/clases/asistencia');






//  rutas
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    Registro.find({},)
        .skip(desde)
        .populate('id_deportista', ' Nombres Apellidos email')
        .populate('Usuario', 'Nombre email'
        )
        .populate('id_clase', 'Nombre'
        )
        .limit(25)
        .exec(
            (err, prestamo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando prestamo',
                        erros: err
                    });
                }
                Registro.estimatedDocumentCount({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        registro: prestamo,
                        total: conteo
                    });


                })


            });




});

// ==============================
// actualizar  los Profesores
// ==============================

app.put('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var id_usuario = req.usuario._id;
    var pagodiario;
    var pagoMensual;
    var myDate2 = new Date();
    switch (body.modopago) {
        case 'DIARIO':

            Promise.all([
                buscarmodopago(id),
                BuscarMensualoDiario(id, pagosMensuales)
            ]).then(respuestas => {

                if (respuestas[0].Modopagos == 'MENSUAL') {
                    respuestas[0].Modopagos = 'DIARIO';

                    pagodiario = new Pagodiario(
                        {
                            id_registro: respuestas[0]._id,
                            valor: respuestas[0].id_clase.id_diciplina.valor_hora,
                            Usuario: id_usuario,
                        });

                    console.log(pagodiario);
                    Promise.all([
                        guardardato(respuestas[0]),
                        guardardato(pagodiario),
                        EliminarRegistroMensual(respuestas[0]._id,pagosMensuales)
                    ]).then(resp => {
                        res.status(200).json({
                            ok: true,
                            message: ' datos fueron actualizados Correcamente',
                            registro: resp[0],
                            pagodiario: resp[1],
                            pagoMensualEliminado: resp[2],
                        })
                    }
                    );


                } else {
                    res.status(200).json({
                        ok: true,
                        message: ' registro encotrados',
                        registro: respuestas[0],
                        pagodiario: respuestas[1],
                    })
                }
            }
            );
            break;
        case 'MENSUAL':
            Promise.all([
                buscarmodopago(id),
                BuscarMensualoDiario(id, Pagodiario)
            ]).then(respuestas => {

                if (respuestas[0].Modopagos == 'DIARIO') {
                    respuestas[0].Modopagos = 'MENSUAL';
                    console.log(myDate2);

                    pagoMensual = new pagosMensuales(
                        {
                            id_registro: respuestas[0]._id,
                            fechaInicio: new Date(),
                            fechaFin: myDate2.addMonths(1),
                            valor: respuestas[0].id_clase.id_diciplina.valor_mensualidad,
                            Usuario: id_usuario,
                        });

                        console.log( pagodiario);
                    Promise.all([
                        guardardato(respuestas[0]),
                        guardardato(pagoMensual),
                        EliminarRegistroMensual(respuestas[0]._id, Pagodiario)
                    ]).then(resp=> {
                        res.status(200).json({
                            ok: true,
                            message: ' datos fueron actualizados Correcamente',
                            registro: resp[0],
                            pagodiario: resp[1],
                            pagoEliminado: resp[2],
                        })
                    }
                    );


                } else {
                    res.status(200).json({
                        ok: true,
                        message: ' registro encotrados',
                        registro: respuestas[0],
                        pagodiario: respuestas[1],
                    })
                }
            }
            );

            break;

        default:
            break;
    }

});

// ==============================
// ingresar Alumno nuevo y crea la base de datos de los que pagan diarios o mensual
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var id_usuario = req.usuario._id;
        var registro = new Registro({
            id_deportista: body.idAlumno,
            id_clase: body.idClase,
            Modopagos: body.modopago,
            Usuario: id_usuario

        });
        var pagodiario;
        var pagoMensual;

        var data;



        // busco en el coleecion que el mismo alumno no este repetido en la mis clase
        Registro.findOne({ id_clase: body.idClase, id_deportista: body.idAlumno })
            .exec((err, registrobd) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error buscar contacto',
                        erros: err
                    });
                }
                //  si no esta hay registro en la colleccion registro crea el registro
                if (!registrobd || registrobd == null) {
                    registro.save((err, claseGuardado) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                mensaje: 'Error crear clase',
                                erros: err
                            });
                        }
                        data = claseGuardado;

                    });
                    // busco en la clase el valor y registro los que pagan mensual o diarios 
                    Clase.findOne({ _id: body.idClase })
                        .populate({
                            path: 'id_diciplina',
                            select: 'valor_hora valor_mensualidad',
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
                                switch (registro.Modopagos) {
                                    case 'DIARIO':
                                        pagodiario = new Pagodiario(
                                            {
                                                id_registro: registro._id,
                                                valor: registrobd.id_diciplina.valor_hora,
                                                Usuario: id_usuario,
                                            }
                                        );
                                        pagodiario.save((err, registroGuardado) => {
                                            if (err) {
                                                return res.status(400).json({
                                                    ok: false,
                                                    mensaje: 'Error crear clase',
                                                    erros: err
                                                });
                                            }
                                            res.status(201).json({
                                                ok: true,
                                                mensaje: 'alumno registrado',
                                                Datos: registroGuardado + data
                                            });

                                        });
                                        break;
                                    case 'MENSUAL':
                                        pagoMensual = new pagosMensuales({
                                            id_registro: registro._id,
                                            valor: registrobd.id_diciplina.valor_mensualidad,
                                            fechaInicio: body.fechaInicio,
                                            fechaFin: body.fechaFin,
                                            Usuario: id_usuario,

                                        });
                                        pagoMensual.save((err, registroGuardado) => {
                                            if (err) {
                                                return res.status(400).json({
                                                    ok: false,
                                                    mensaje: 'Error crear clase',
                                                    erros: err
                                                });
                                            }
                                            res.status(201).json({
                                                ok: true,
                                                mensaje: 'alumno registrado',
                                                Datos: registroGuardado + data
                                            });

                                        });


                                        break;

                                    default:
                                        break;
                                };
                            };
                        });
                } else {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'usuario con ' + body.idAlumno + ' Ya esta Registrado',
                        erros: { message: 'el deportista ya se encuentra registrado en la clase ' + body.idClase }
                    });
                };
            });



    });
// ==============================
// eliminar  los Usuarios
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    Promise.all([
        buscarasistencia(id),
        buscardeudas(id),
        BuscarMensualoDiario(id, pagosMensuales),
        BuscarMensualoDiario(id, Pagodiario)
    ]).then(respuestas => {

        if (Object.keys(respuestas[0]).length === 0 &&
            Object.keys(respuestas[2]).length === 0 &&
            Object.keys(respuestas[3]).length === 0
        ) {
            Registro.deleteOne({_id: id}, (err, registroborrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error borar registro',
                        erros: err
                    });
                }
                res.status(201).json({
                    ok: true,
                    mensaje: 'registro fue borrado',
                    data: registroborrado
                });


            });
        } else {
            res.status(200).json({
                ok: true,
                message: ' debe borrar los siguientes registros',
                asistencia: respuestas[0],
                deudas: respuestas[1],
                mensualidad: respuestas[2],
                diario: respuestas[3]
            });
        }

    });

});

// funciones de busquedad ////

function buscarasistencia(busqueda) {
    return new Promise((resolve, reject) => {
        asistencia.find({ id_registro: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, asistencia) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(asistencia)
                }

            });

    });


}
function BuscarMensualoDiario(busqueda, colleccion) {
    console.log(busqueda);
    return new Promise((resolve, reject) => {
        colleccion.find({ id_registro: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, diario) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(diario)
                }

            });

    });


}

function buscardeudas(busqueda) {
    return new Promise((resolve, reject) => {
        Prestamo.find({ idRegistro: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, deudas) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(deudas)
                }

            });

    });


}
function buscarmodopago(busqueda) {
    return new Promise((resolve, reject) => {
        Registro.findById({ _id: busqueda })
            .populate({
                path: 'id_clase',
                select: 'id_diciplina',
                populate: [
                    {
                        path: 'id_diciplina',
                        select: 'valor_hora  valor_mensualidad'
                    }
                ]
            })
            .exec((err, deudas) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(deudas)
                }

            });

    });


}




// funcion save
function guardardato(dato) {
    return new Promise((resolve, reject) => {
        dato.save((err, datos) => {

            if (err) {
                reject('error al cargar asistencia')
                console.log(err);
            } else {
                resolve(datos)
            }

        });

    });


}


// eliminar registro depagos mensuales
function EliminarRegistroMensual(busqueda,colleccion) {
    return new Promise((resolve, reject) => {
        colleccion.findOneAndDelete({ id_registro: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, deudas) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(deudas)
                }

            });

    });


}




// agrega el mes siguiente
Date.isLeapYear = function (year) { return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); };
Date.getDaysInMonth = function (year, month) { return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]; };
Date.prototype.isLeapYear = function () { var y = this.getFullYear(); return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)); };
Date.prototype.getDaysInMonth = function () { return Date.getDaysInMonth(this.getFullYear(), this.getMonth()); };
Date.prototype.addMonths = function (value) { var n = this.getDate(); this.setDate(1); this.setMonth(this.getMonth() + value); this.setDate(Math.min(n, this.getDaysInMonth())); return this; };







module.exports = app;