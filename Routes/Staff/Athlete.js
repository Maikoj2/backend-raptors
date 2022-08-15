var expres = require('express');
var autenticacion = require('../../middelware/autenticacion');
var app = expres();
var Deportista = require('../../models/staff/Athlete');
var Persona = require('../../models/staff/people');
var contatoEmergencia = require('../../models/staff/contacEmergen');
var Registro = require('../../models/clases/Registro');
const { getItems, createItem, updateItem } = require('../../Controllers/Staff/Athlete');


/**
 * get a list of all users 
 */
app.get('/',getItems);
/**
 * Update a user by id 
 */
app.put('/:id', autenticacion.verificatoken, updateItem);
/**
 * Update a user by id [Todo]
 */
app.put('/contacto/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var contacto = new contatoEmergencia({
        _id: body.IdContacto,
        Nombre: body.NombresContacto,
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
/**
 * Create a new user on database 
 */
app.post('/', autenticacion.verificatoken, createItem);

/**
 * delete a user by id 
 */
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
        Persona.deleteOne({_id: id}, (err, usuarioborrado) => {


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
            Deportista.deleteOne({_id: id}, (err, usuarioborrado) => {


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