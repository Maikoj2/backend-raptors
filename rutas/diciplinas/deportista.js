var expres = require('express');
var autenticacion = require('../../middelware/autenticacion');
var app = expres();
var Deportista = require('../../modelos/deportista');
var Persona = require('../../modelos/Personas');
var contatoEmergencia = require('../../modelos/contacEmergen');
var Registro = require('../../modelos/clases/Registro');


// ==============================
// obtener todos los deportistas
// ==============================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    Deportista.find({},)
        .skip(desde)
        .populate([
            {
                path: '_id',
                select: '',
                populate: [{
                    path: 'Usuario',
                    select: 'Nombre email'
                }]
            },
            {
                path: 'IdContacto',
                select: 'Nombres Telefono',
            },
            {
                path: 'IdContacto2',
                select: 'Nombres Telefono',
            }
        ])
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
                Deportista.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        personas: persona,
                        total: conteo
                    });

                })


            });




});

// ==============================
// actualizar  los Personas
// ==============================

app.put('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var id_usuario = req.usuario._id;
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


    Promise.all([
        ActualizarPrsona(id, persona),
        Actualizaralumno(id, deportistaDato),
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            message: ' el alumno fue Actualizado Correcamente',
            persona: respuestas[0],
            Alumno: respuestas[1],
        })
    }
    );
});
// ==============================
// actualizar  los Contactos
// ==============================
app.put('/contacto/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var contacto = new contatoEmergencia({
        _id: body.IdContacto,
        Nombres: body.NombresContacto,
        Apellidos: body.ApellidosContacto,
        Barrio: body.BarrioContacto,
        Direccion: body.direccionContacto,
        Telefono: body.telefonoContacto,
        Ocupacion: body.ocupacioncontacto,
        email: body.emailcontacto
    });



    Actualizarcontacto(id, contacto).then(respuestas => {
        res.status(200).json({
            ok: true,
            message: ' el contacto fue Actualizado Correcamente',
            persona: respuestas,
        })
    }
    );
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
            Usuario: id_usuario

        });
        var deportista = new Deportista({
            _id: persona._id,
            FechaNacimiento: body.FNacimiento,
            DepartamentNacimiento: body.departamentN,
            MunicipioNacimiento: body.MunicipioN,
            Edad: body.edad,
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
    Registro.findOne({ id_deportista: id }, (err, claseborrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar clase',
                erros: err
            });
        }
        console.log(claseborrado);
        if (claseborrado != null || claseborrado == {}) {
            return res.status(205).json({
                ok: false,
                mensaje: 'el deportista con id: ' + id + ' tiene registrado alumnos  ',
                erros: { message: 'borre los registros antes de borrar una clase ' }
            });
        }
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

            });


        });
        res.status(201).json({
            ok: true,
            mensaje: 'el  deportista fue borrado',
            data: data
        });

    });

});

// funciones de Actualizar datos////
function ActualizarPrsona(id, dato) {
    return new Promise((resolve, reject) => {
        Persona.findByIdAndUpdate(id, dato)
            // .populate('usuario', 'Nombre email')
            .exec((err, persona) => {

                if (err) {
                    reject('error al cargar persona')
                } else {
                    resolve(persona)
                }

            });

    });
}
function Actualizaralumno(id, dato) {
    return new Promise((resolve, reject) => {
        Deportista.findByIdAndUpdate(id, dato)
            .exec((err, alumno) => {
                if (err) {
                    reject('error al cargar alumno')
                } else {
                    resolve(alumno)
                }
            });

    });
}
function Actualizarcontacto(id, dato) {
    return new Promise((resolve, reject) => {
        contatoEmergencia.findByIdAndUpdate(id, dato)
            .exec((err, contacto) => {
                if (err) {
                    reject('error al cargar alumno')
                } else {
                    resolve(contacto)
                }
            });

    });
}
// funciones de guardado datos ////
function GuardarAlumno(datos) {
    return new Promise((resolve, reject) => {
        datos.save((err, alumno) => {
            if (err) {
                reject('error al cargar alumno')
            } else {
                resolve(alumno)
            }

        });
    });


}
function Guardarcontacto(datos) {
    return new Promise((resolve, reject) => {
        datos.save((err, contacto) => {
            if (err) {
                reject('error al cargar persona')
            } else {
                resolve(contacto)
            }

        });
    });


}
// buscar contacto
function buscarcontacto(busqueda) {
    return new Promise((resolve, reject) => {
        contatoEmergencia.find({ _id: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, contacto) => {

                if (err) {
                    reject('error al cargar contacto')
                } else {
                    resolve(contacto)
                }

            });

    });


}





module.exports = app;