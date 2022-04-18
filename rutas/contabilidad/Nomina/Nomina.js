var expres = require('express')
var app = expres();
var Nomina = require('../../../modelos/nomina/nomina');
var Horasextras = require('../../../modelos/nomina/Horasextras');
var Devengados = require('../../../modelos/nomina/Devengado');
var Deducidos = require('../../../modelos/nomina/Deducido');
var autenticacion = require('../../../middelware/autenticacion');
const Devengado = require('../../../modelos/nomina/Devengado');



//  rutas
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    Nomina.find({},)
        .populate(
            [
                {
                    path: "id_personal",
                    select: '_id id_sueldoBase Profecion',
                    populate:
                        [
                            {
                                path: '_id', select: ' Nombres Apellidos Telefono'
                            },
                            {
                                path: 'id_sueldoBase', select: ' Cargo Sueldo_Base Valor_Hora'
                            }
                        ]
                },
                {
                    path: "id_Deducidos",
                },
                {
                    path: "id_Devengado",
                }
            ]
        )
        .skip(desde)
        .limit(5)
        .exec(
            (err, nomina) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando nomina',
                        erros: err
                    });
                }
                Nomina.estimatedDocumentCount({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        nominas: nomina,
                        total: conteo
                    });

                })


            });


});
// //////////////////////////////////////
// almacenna los datos de nomina devengados, deducidos y horas extras
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var id_usuario = req.usuario._id;
        var nomina = new Nomina({
            id_personal: body.id_personal,
            id_Deducidos: body.id_Deducidos,
            id_Devengado: body.id_Devengado,
            fecha: body.fecha,
            Total_neto: body.Total_neto,
            Usuario: id_usuario
        });

        Promise.all([
            BuscarPorIdFecha(nomina.id_personal, nomina.fecha, Deducidos),
            BuscarPorIdFecha(nomina.id_personal, nomina.fecha, Devengados)
        ]).then(respuestas => {

            if (Object.keys(respuestas[0]).length === 0 ||
                Object.keys(respuestas[1]).length === 0) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'no a creado nomina o deducciones de este empleado ' + nomina.id_personal + ' ',
                    erros: { message: 'cree su debengado o deducciones ' }
                });
            }

            nomina.id_Deducidos = respuestas[0][0]._id
            nomina.id_Devengado = respuestas[1][0]._id
            guardardato(nomina)
                .then(
                    resp => {
                        res.status(200).json({
                            ok: true,
                            message: ' datos fueron almacenado Correcamente',
                            registro: resp,
                        })
                    }
                )



        }).catch(e => {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al cargar archivos',
                registro: e
            });
        })




    });
// //////////////////////////////////////////////////////
app.post('/Horasextras', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var id_usuario = req.usuario._id;
        var horasextras = new Horasextras({
            id_personal: body.id_personal,
            fecha: body.fecha,
            H_E_Diurna: body.H_E_Diurna,
            H_E_Nocturna: body.H_E_Nocturna,
            Recargo_Nocturno: body.Recargo_Nocturno,
            H_Fesiva_Diurna: body.H_Fesiva_Diurna,
            H_Festiva_Nocturna: body.H_Festiva_Nocturna,
            H_E_F_Diurna: body.H_E_F_Diurna,
            H_E_F_Nocturna: body.H_E_F_Nocturna,
            Valor_H_E_Diurna: body.Valor_H_E_Diurna,
            Valor_H_E_Nocturna: body.Valor_H_E_Nocturna,
            Valor_Recargo_Nocturno: body.Valor_Recargo_Nocturno,
            Valor_H_Fesiva_Diurna: body.Valor_H_Fesiva_Diurna,
            Valor_H_Festiva_Nocturna: body.Valor_H_Festiva_Nocturna,
            Valor_H_E_F_Diurna: body.Valor_H_E_F_Diurna,
            Valor_H_E_F_Nocturna: body.Valor_H_E_F_Nocturna,
        });
        console.log('entro');
        guardardato(horasextras)
            .then(
                resp => {
                    res.status(200).json({
                        ok: true,
                        message: ' datos fueron almacenado Correcamente',
                        registro: resp,
                    })
                }
            ).catch(e => {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos',
                    registro: e
                });
            })


    });
// ////////////////////////////////////////////
app.post('/devengados', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var devengados = new Devengados({
            id_personal: body.id_personal,
            fecha: body.fecha,
            Dias_laborados: body.Dias_laborados,
            id_HoraEXtra: body.id_HoraEXtra,
            Basico_devengado: body.Basico_devengado,
            Comiciones: body.Comiciones,
            Bonificaciones: body.Bonificaciones,
            Auxilio_transporte: body.Auxilio_transporte,
            Total_conAuxiolioT: body.Total_conAuxiolioT,
            Total_Sin_auxilio: body.Total_Sin_auxilio
        });

        BuscarPorIdFecha(body.id_personal, new Date(devengados.fecha), Horasextras)
            .then(resp => {

                devengados.id_HoraEXtra = resp[0]._id;
                guardardato(devengados)
                    .then(
                        resp2 => {
                            res.status(200).json({
                                ok: true,
                                message: ' datos fueron almacenado Correcamente',
                                debengado: resp2,
                            })
                        }
                    )

            }).catch(e => {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos',
                    registro: e
                });
            })
    });
// ///////////////////////////////////////////////////////
app.post('/deducidos', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var deducidos = new Deducidos({
            id_personal: body.id_personal,
            fecha: body.fecha,
            Salud: body.Salud,
            Pension: body.Pension,
            Fondo_Solidadridad: body.Fondo_Solidadridad,
            Retencion_fuente: body.Retencion_fuente,
            Total_Deducido: body.Total_Deducido
        });

        guardardato(deducidos)
            .then(
                resp => {
                    res.status(200).json({
                        ok: true,
                        message: ' datos fueron almacenado Correcamente',
                        registro: resp,
                    })
                }
            ).catch(e => {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos',
                    registro: e
                });
            })


    });

// ==============================
// actualizar   de los datos de deducidos, nomina,devengados y horas extras 
// ==============================

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;
    BuscarpotId(id, Nomina)
        .then(resp => {

            if (!resp) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'nomina con ' + id + ' no existe',
                    erros: { message: 'no existe el nomina con ese id ' }
                });
            }
            resp[0].Total_neto = body.Total_neto;
            console.log(resp[0]);
            guardardato(resp[0]).then(
                resp2 => {
                    res.status(200).json({
                        ok: true,
                        message: ' datos fueron almacenado Correcamente',
                        registro: resp2,
                    })
                }
            )


        }).catch(e => {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al cargar archivos',
                registro: e
            });
        })

});
// ///////////////////////////////////////////////////

app.put('/Horasextras/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;
    BuscarpotId(id, Horasextras)
        .then(resp => {

            if (!resp) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Horasextras con ' + id + ' no existe',
                    erros: { message: 'no existe el nomina con ese id ' }
                });
            }

            resp[0].H_E_Diurna = body.H_E_Diurna,
                resp[0].H_E_Nocturna = body.H_E_Nocturna,
                resp[0].Recargo_Nocturno = body.Recargo_Nocturno,
                resp[0].H_Fesiva_Diurna = body.H_Fesiva_Diurna,
                resp[0].H_Festiva_Nocturna = body.H_Festiva_Nocturna,
                resp[0].H_E_F_Diurna = body.H_E_F_Diurna,
                resp[0].H_E_F_Nocturna = body.H_E_F_Nocturna,
                resp[0].Valor_H_E_Diurna = body.Valor_H_E_Diurna,
                resp[0].Valor_H_E_Nocturna = body.Valor_H_E_Nocturna,
                resp[0].Valor_Recargo_Nocturno = body.Valor_Recargo_Nocturno,
                resp[0].Valor_H_Fesiva_Diurna = body.Valor_H_Fesiva_Diurna,
                resp[0].Valor_H_Festiva_Nocturna = body.Valor_H_Festiva_Nocturna,
                resp[0].Valor_H_E_F_Diurna = body.Valor_H_E_F_Diurna,
                resp[0].Valor_H_E_F_Nocturna = body.Valor_H_E_F_Nocturna,
                guardardato(resp[0]).then(
                    resp2 => {
                        res.status(200).json({
                            ok: true,
                            message: ' datos fueron almacenado Correcamente',
                            registro: resp2,
                        })
                    }
                ).catch(e => {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error al cargar archivos',
                        registro: e
                    });
                })


        }).catch(e => {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al cargar archivos',
                registro: e
            });
        })

});
// ////////////////////////////////////////////////////

app.put('/devengados/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;
    BuscarpotId(id, Devengados)
        .then(resp => {

            if (!resp) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Horasextras con ' + id + ' no existe',
                    erros: { message: 'no existe el nomina con ese id ' }
                });
            }


            resp[0].Dias_laborados = body.Dias_Laborados;
            resp[0].Basico_devengado = body.Basico_devengado;
            resp[0].Comiciones = body.Comiciones;
            resp[0].Bonificaciones = body.Bonificaciones;
            resp[0].Auxilio_transporte = body.Auxilio_transporte;
            resp[0].Total_conAuxiolioT = body.Total_conAuxiolioT;
            resp[0].Total_Sin_auxilio = body.Total_Sin_auxilio;
            guardardato(resp[0]).then(
                resp2 => {
                    res.status(200).json({
                        ok: true,
                        message: ' datos fueron almacenado Correcamente',
                        registro: resp2,
                    })
                }
            ).catch(e => {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos',
                    registro: e
                });
            })


        }).catch(e => {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al cargar archivos',
                registro: e
            });
        })

});
// /////////////////////////////////////////

app.put('/deducidos/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;
    BuscarpotId(id, Deducidos)
        .then(resp => {

            if (!resp) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Horasextras con ' + id + ' no existe',
                    erros: { message: 'no existe el nomina con ese id ' }
                });
            }


            resp[0].Salud = body.Salud;
            resp[0].Pension = body.Pension;
            resp[0].Fondo_Solidadridad = body.Fondo_Solidadridad;
            resp[0].Retencion_fuente = body.Retencion_fuente;
            resp[0].Total_Deducido = body.Total_Deducido;
            guardardato(resp[0]).then(
                resp2 => {
                    res.status(200).json({
                        ok: true,
                        message: ' datos fueron almacenado Correcamente',
                        registro: resp2,
                    })
                }
            ).catch(e => {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al cargar archivos',
                    registro: e
                });
            })


        }).catch(e => {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al cargar archivos',
                registro: e
            });
        })

});
// ==============================
// eliminar  nomina
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;


    BuscarpotId(id, Nomina).then(resp => {


        if (!resp) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Horasextras con ' + id + ' no existe',
                erros: { message: 'no existe el nomina con ese id ' }
            });
        }
        
        Promise.all([
            EliminarRegistro(resp[0].id_Devengado.id_HoraEXtra, Horasextras),
            EliminarRegistro(resp[0].id_Devengado, Devengado),
            EliminarRegistro(resp[0].id_Deducidos, Deducidos),
            EliminarRegistro(id, Nomina)
        ]).then(respuestas => {
            res.status(200).json({
                ok: true,
                message: ' datos Borrados almacenado Correcamente',
                registro: respuestas[0],
                registro2: respuestas[1],
                registro3: respuestas[2],
                registro4: respuestas[3],
            })
        }).catch(e => {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al cargar archivos',
                registro: e
            });
        })




    }).catch(e => {
        return res.status(500).json({
            ok: false,
            mensaje: 'error al cargar archivos',
            registro: e
        });
    })

});




// funciones 
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
function BuscarPorIdFecha(id, fecha, Colleccion) {
    return new Promise((resolve, reject) => {
        Colleccion.find({ id_personal: id, fecha: fecha })
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
function BuscarpotId(id, Colleccion) {
    return new Promise((resolve, reject) => {
        Colleccion.find({ _id: id })
            .populate('id_Devengado', 'id_HoraEXtra')
            .exec((err, clase) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(clase)
                }

            });

    });


}
function EliminarRegistro(busqueda, colleccion) {
    return new Promise((resolve, reject) => {
        colleccion.findOneAndDelete({ _id: busqueda })
            .exec((err, deudas) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(deudas)
                }

            });

    });


}


module.exports = app;