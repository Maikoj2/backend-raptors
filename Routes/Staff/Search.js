const expres = require('express')
const app = expres();
const Usuario = require('../../models/staff/user')
const personas = require('../../models/staff/people')
const clase = require('../../models/discipline/class')
const diciplina = require('../../models/discipline/discipline');
const { getItemsByname, getItemsByCameOnColletion } = require('../../Controllers/Staff/Search');
const { check } = require('express-validator');
const { validateFields } = require('../../middleware/ValidateInputs');
const { ExistCollections } = require('../../helpers/Validators/dbValidators');

//  rutas
app.get('/all/:search',[
    check('search', 'the search must be min length 5 ').isLength({ min: 2 }),
    validateFields,
], getItemsByname);


// busca por colleciones
app.get('/collection/:table/:search' ,[
    check('search', 'the search must be min length 5 ').isLength({ min: 2 }),
    check('table').custom((table,next) =>ExistCollections(table,next)),
    validateFields,
] , getItemsByCameOnColletion )




////////////////////////////////////////
function BuscarGeneralpornombre(busqueda, colleccion, desde) {
    return new Promise((resolve, reject) => {
        colleccion.find({ Names: busqueda })
            .skip(desde)
            .limit(5)
            .exec((err, diario) => {

                if (err) {
                     reject('error al cargar asistencia', err)
                } else {

                    resolve(diario)
                }

            });

    });


}

function BuscarPersonaporNombres(busqueda, desde, colleccion2,role) {
    const resp=[]
    return new Promise((resolve, reject) => {
        colleccion2.find({Nombre:busqueda}).and([{ role: role }])
            .exec((err, diario) => {
                if (err) {
                    reject('error al cargar asistencia', err)
                } else {

                    resolve(diario)
                }

            });

    });


}






module.exports = app;