var expres = require('express')
var autenticacion = require('../middelware/autenticacion')
var app = expres();
var Deportista = require('../modelos/deportista');
var Persona = require('../modelos/Personas');
var contatoEmergencia = require('../modelos/contacEmergen');
const { json } = require('express/lib/response');


// ==============================
// obtener todos los deportistas
// ==============================

app.get('/', (req, res, next) => {



    var desde = req.query.desde || 0;
    desde = Number(desde);

    Persona.find({},)
        .skip(desde)
        .populate('Usuario', 'Nombre email')
        .populate({
            path: 'idperfil',
            populate: [
                {
                    path: 'IdContacto'
                },
                {
                    path: 'IdContacto2'
                },
                {
                    path: 'Diciplina'
                },
            ]
        }
        )
        .limit(5)
        .exec(
            (err, persona) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuraio',
                        erros: err
                    });
                }
                // deportista.count({}, (err, conteo) => {



                // })
                res.status(200).json({
                    ok: true,
                    personas: persona,
                    // total: conteo
                });

            });




});

// ==============================
// actualizar  los Personas
// ==============================

app.put('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var id_usuario = req.usuario._id;
    var data;
    var deportistaDato = new Deportista({
        FechaNacimiento: body.FNacimiento,
        DepartamentNacimiento: body.departamentN,
        MunicipioNacimiento: body.MunicipioN,
        Edad: body.edad,
        Diciplina: body.Diciplina,
        IdContacto: body.IdContacto,
        IdContacto2: body.IdContacto2,
        padecimientos: body.padecimientos,
        Medicamentos: body.medicamentos,
        Alergias: body.alergias,
        TipoSangre: body.tiposangre,
        TallaCalzado: body.tallaCalzado,
        TallaCamizeta: body.tallaCamisa,
        TallaPantaloneta: body.TallaPantaloneta,
        Estatura: body.estatura,
        Peso: body.peso

    });
    var persona = new Persona({
        Nombres: body.nombres,
        Apellidos: body.apellidos,
        Sexo: body.sexo,
        Barrio: body.barrio,
        Direccion: body.direccion,
        Telefono: body.telefono,
        Ocupacion: body.ocupacion,
        EPS: body.eps,
        email: body.email,
        Usuario: id_usuario

    });

    Persona.findByIdAndUpdate(id, persona)
        .exec((err, deportista) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar deportista',
                    erros: err
                });
            }

            if (deportista = null || !deportista) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'el deportista no esta en almacenado',
                    erros: err
                });
            }
            data = deportista;
            Deportista.findByIdAndUpdate(id, deportistaDato)
                .exec((err, deportista) => {


                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al buscar deportista',
                            erros: err
                        });
                    }

                    if (deportista = null || !deportista) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'el deportista no esta en almacenado',
                            erros: err
                        });
                    }
                    data   = `${data}  ${deportista}`;
                    res.status(500).json({
                        ok: true,
                        mensaje:  'deportista actualizado'

                    });

                });

        });




});
// ==============================
// ingresar deportista nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var id_usuario = req.usuario._id;
        var data;

        var persona = new Persona({
            TipoId: body.tipoid,
            _id: body.id,
            Nombres: body.nombres,
            Apellidos: body.apellidos,
            Sexo: body.sexo,
            Barrio: body.barrio,
            Direccion: body.direccion,
            Telefono: body.telefono,
            Ocupacion: body.ocupacion,
            EPS: body.eps,
            email: body.email,
            idperfil: body.id,
            Usuario: id_usuario

        });
        var deportista = new Deportista({
            _id: persona._id,
            FechaNacimiento: body.FNacimiento,
            DepartamentNacimiento: body.departamentN,
            MunicipioNacimiento: body.MunicipioN,
            Edad: body.edad,
            Diciplina: body.Diciplina,
            IdContacto: body.IdContacto,
            IdContacto2: body.IdContacto2,
            padecimientos: body.padecimientos,
            Medicamentos: body.medicamentos,
            Alergias: body.alergias,
            TipoSangre: body.tiposangre,
            TallaCalzado: body.tallaCalzado,
            TallaCamizeta: body.tallaCamisa,
            TallaPantaloneta: body.TallaPantaloneta,
            Estatura: body.estatura,
            Peso: body.peso

        });
        var contacto1 = new contatoEmergencia({
            _id: body.IdContacto,
            Nombres: body.NombresContacto,
            Apellidos: body.ApellidosContacto,
            Barrio: body.BarrioContacto,
            Direccion: body.direccionContacto,
            Telefono: body.telefonoContacto,
            Ocupacion: body.ocupacioncontacto,
            email: body.emailcontacto

        });
        var contacto2 = new contatoEmergencia({
            _id: body.IdContacto2,
            Nombres: body.NombresContacto2,
            IdContacto: body.IdContacto,
            Apellidos: body.ApellidosContacto2,
            Barrio: body.BarrioContacto2,
            Direccion: body.direccionContacto2,
            Telefono: body.telefonoContacto2,
            Ocupacion: body.ocupacioncontacto2,
            email: body.emailcontacto2

        });


        persona.save((err, personaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error crear persona',
                    erros: err
                });
            }
            data = personaGuardado


            deportista.save((err, deportistaGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error crear deportista',
                        erros: err
                    });
                }
                data = `${data} ${deportista}`
                contatoEmergencia.findById({ _id: contacto1._id }, (err, usuariodb) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error buscar contacto',
                            erros: err
                        });
                    }
                    if (usuariodb = null || !usuariodb) {
                        contacto1.save((err, contacto2Guardado) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    mensaje: 'Error crear usuraio',
                                    erros: err
                                });
                            }
                            data = `${data}  ${contacto2Guardado}`
                        });

                    }
                })
                contatoEmergencia.findById({ _id: contacto2._id }, (err, usuariodb) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error buscar contacto',
                            erros: err
                        });
                    };
                    if (usuariodb = null || !usuariodb) {

                        contacto2.save((err, contacto2Guardado) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    mensaje: 'Error crear usuraio',
                                    erros: err
                                });
                            }
                            data = `${data}  ${contacto2Guardado}`


                        });
                    }
                })
                res.status(201).json({
                    ok: true,
                    mensaje: 'todo guardado buscar contacto',
                    Datos: data
                });

            });

        });
    });

// ==============================
// eliminar  los Usuarios
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var data;

    Persona.findByIdAndRemove(id, (err, usuarioborrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar usuario',
                erros: err
            });
        }
        if (!usuarioborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'persona con ' + id + ' no existe',
                erros: { message: 'no existe el persona con ese id ' }
            });
        }
        data = usuarioborrado;
        Deportista.findByIdAndRemove(id, (err, usuarioborrado) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borar usuario',
                    erros: err
                });
            }
            if (!usuarioborrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'deportes con ' + id + ' no existe',
                    erros: { message: 'no existe el deportes con ese id ' }
                });
            }
            data = `${data} ${usuarioborrado}`;
            res.status(200).json({
                ok: true,
                usuario: data
            });




        });


    });


});



module.exports = app;