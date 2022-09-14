const expres = require('express');
const app = expres();
const { check } = require('express-validator');
const { valid, token } = require('../../middleware');  
const Deportista = require('../../models/staff/Athlete');
const Persona = require('../../models/staff/people');
const contatoEmergencia = require('../../models/staff/contactEmergen');
const Registro = require('../../models/discipline/signUpClass');
const { getItems, createItem, updateItem } = require('../../Controllers/Staff/Athlete');
 
const { AthletesModel } = require('../../models');
const { ExistById } = require('../../helpers/Validators/dbValidators');


/**
 * get a list of all users 
 */
app.get('/', getItems);
/**
 * Update a user by id 
 */
app.put('/:id_search', [
    token.verificatoken,
    check('id_search', 'the id_search is invalide').isMongoId(),
    check('id_search').custom((id_search) => ExistById(id_search, AthletesModel)),
    check(['id', 'IdContact','ContactNames',  'Names' , 'IdType' , 'SureNames', 'ContactSureNames'
    , 'Gender' , 'neighborhood', 'Address' , 'Phone' , 'occupation', 'DateofBirth' , 'DepartamentBirth'  ], `data can't be empty`).not().isEmpty(),
    valid.validateFields,
], updateItem);

/**
 * Create a new user on database 
 */
app.post('/', [
    token.verificatoken,
    check(['id', 'IdContact','ContactNames',  'Names' , 'IdType' , 'SureNames', 'ContactSureNames'
        , 'Gender' , 'neighborhood', 'Address' , 'Phone' , 'occupation', 'DateofBirth' , 'DepartamentBirth'  ], `data can't be empty`).not().isEmpty(),
    check('email', 'the email is ivalide').isEmail(),
    valid.validateFields,
], createItem);

/**
 * delete a user by id 
 */
app.delete('/:id',token.verificatoken , (req, res) => {

    const id = req.params.id;
    let data;
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
        Persona.deleteOne({ _id: id }, (err, usuarioborrado) => {


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
            Deportista.deleteOne({ _id: id }, (err, usuarioborrado) => {


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