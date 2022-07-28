var expres = require('express')
var app = expres();
var autenticacion = require('../../middelware/autenticacion')
var Persona = require('../../models/staff/Personas');
var Profesor = require('../../models/staff/Profesor');
var Clase = require('../../models/clases/clase');

// ==============================
// obtener todos los Profesors
// ==============================

app.get('/', (req, res, next) => {



    var desde = req.query.desde || 0;
    desde = Number(desde);

    Profesor.find({},)
        .skip(desde)
        .populate([{
            path: '_id',
            populate: [
                {
                    path: 'Usuario',
                    select: 'Nombre email'
                }
            ]
        },
        {
            path: 'id_sueldoBase'
        }]
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
                Profesor.estimatedDocumentCount({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        profesores: persona,
                        total: conteo

                    });
                });

            });




});

// ==============================
// actualizar  los Profesores
// ==============================

app.put('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var id_usuario = req.usuario._id;
    var ProfeDato = new Profesor({
        id_sueldoBase: body.id_sueldoBase,
        FechaNacimiento: body.FNacimiento,
        DepartamentNacimiento: body.departamentN,
        MunicipioNacimiento: body.MunicipioN,
        Profecion: body.Profecion

    });
    var persona = new Persona({
        Nombre: body.nombres,
        Apellidos: body.apellidos,
        Sexo: body.sexo,
        Barrio: body.barrio,
        Direccion: body.direccion,
        Telefono: body.telefono,
        Ocupacion: body.ocupacion,
        EPS: body.eps,
        email: body.email,
        role: body.role,
        Usuario: id_usuario

    });
    Promise.all([
        ActualizarPrsona(id,persona),
        ActualizarProfe(id,ProfeDato),
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            message: ' Profesor fue Actualizado Correcamente',
            persona: respuestas[0],
            profesor: respuestas[1],
        })
    }
    );
});
// ==============================
// ingresar Profesor nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var id_usuario = req.usuario._id;

        var persona = new Persona({
            TipoId: body.tipoid,
            _id: body.id,
            Nombre: body.nombres,
            Apellidos: body.apellidos,
            Sexo: body.sexo,
            Barrio: body.barrio,
            Direccion: body.direccion,
            Telefono: body.telefono,
            Ocupacion: body.ocupacion,
            EPS: body.eps,
            email: body.email,
            idperfil: body.id,
            role: body.role,
            Usuario: id_usuario

        });
        var profesor = new Profesor({
            _id: persona._id,
            id_sueldoBase: body.id_sueldoBase,
            FechaNacimiento: body.FNacimiento,
            DepartamentNacimiento: body.departamentN,
            MunicipioNacimiento: body.MunicipioN,
            Profecion: body.Profecion


        });
        Promise.all([
            GuardarPersona(persona),
            GuardarProfe(profesor),
        ]).then(respuestas => {
            res.status(200).json({
                ok: true,
                message: ' Profesor fue almacenado Correcamente',
                persona: respuestas[0],
                profesor: respuestas[1],
            })
        }
        );
    });

// ==============================
// eliminar  los Usuarios
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    buscarclase(id).then(clases => {

        if (Object.keys(clases).length === 0 || clase == null) {
            Promise.all([
                BuscarBorrarpersona(id),
                BuscarBorrarProfesor(id)

            ]).then(Dato => {
                res.status(201).json({
                    ok: true,
                    mensaje: 'registro fue borrado',
                    persona: Dato[0],
                    profesor: Dato[1]
                });

            })
        } else {
            res.status(200).json({
                ok: true,
                message: ' este profesor esta asignado a las siguientes clases',
                asistencia: clases

            });
        }



    });

});

// funciones de busquedad  para borrar////

function buscarclase(busqueda) {
    return new Promise((resolve, reject) => {
        Clase.find({ id_Profe: busqueda })
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
function BuscarBorrarpersona(busqueda) {
    return new Promise((resolve, reject) => {
        Persona.deleteOne({ _id: busqueda })
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

function BuscarBorrarProfesor(busqueda) {
    return new Promise((resolve, reject) => {
        Profesor.deleteOne({ _id: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, Profesor) => {

                if (err) {
                    reject('error al cargar Profesor')
                } else {
                    resolve(Profesor)
                }

            });

    });


}
// funciones de guardado datos ////
function GuardarProfe(datos) {
    return new Promise((resolve, reject) => {
        datos.save((err, Profesor) => {
            if (err) {
                reject('error al cargar Profesor')
            } else {
                resolve(Profesor)
            }

        });
    });


}
function GuardarPersona(datos) {
    return new Promise((resolve, reject) => {
        datos.save((err, persona) => {
            if (err) {
                reject('error al cargar persona')
            } else {
                resolve(persona)
            }

        });
    });


}

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
function ActualizarProfe(id, dato) {
    return new Promise((resolve, reject) => {
        Profesor.findByIdAndUpdate(id, dato)
            .exec((err, persona) => {
                if (err) {
                    reject('error al cargar persona')
                } else {
                    resolve(persona)
                }

            });

    });
}





module.exports = app;
