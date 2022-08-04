var expres = require('express')
var app = expres();
var autenticacion = require('../../middelware/autenticacion')
var Persona = require('../../models/staff/people');
var Profesor = require('../../models/staff/Teacher');
var Clase = require('../../models/clases/clase');
const { getItems, createItem, updateItem } = require('../../Controllers/Staff/Teacher');

/**
 * get al  teachers registered 
 */
app.get('/', getItems);
/**
 * upodate a Teache by id
 */
app.put('/:id', autenticacion.verificatoken,updateItem);
/**
 * save a register on data base (a teacher)
 */
app.post('/', autenticacion.verificatoken, createItem);

/**
 * 
 * [TODO]
 * 
 */

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




module.exports = app;
