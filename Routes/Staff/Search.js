var expres = require('express')
var app = expres();
var Usuario = require('../../models/staff/user')
var personal = require('../../models/staff/Profesor')
var deportista = require('../../models/staff/deportista')
var personas = require('../../models/staff/Personas')
var clase = require('../../models/clases/clase')
var diciplina = require('../../models/clases/diciplina')

//  rutas
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var conteo


    Promise.all([
        BuscarGeneralpornombre(regex, Usuario, desde),
        BuscarGeneralpornombre(regex, personas, desde),
        BuscarGeneralpornombre(regex, clase, desde),
        BuscarGeneralpornombre(regex, diciplina, desde),

    ])
        .then(
            resp => {

                conteo = Object.keys(resp[0]).length + Object.keys(resp[1]).length + Object.keys(resp[2]).length + Object.keys(resp[3]).length
                res.status(200).json({
                    ok: true,
                    usuarios: resp[0],
                    personas: resp[1],
                    clase: resp[2],
                    Diciplinas: resp[3],
                    cantidad: conteo
                })


            }
        ).catch(
            e => {
                res.status(500).json({
                    ok: false,
                    error: e
                })

            }
        )


});


// busca por colleciones
app.get('/collecion/:tabla/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i')
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var promesa

    switch (tabla) {
        case 'personas':
            promesa = BuscarGeneralpornombre(regex, personas, desde);
            break;
        case 'deportista':
            promesa = BuscarPersonaporNombres(regex, desde , personas, 'USER_ROLE')
            break;
        case 'Profesor':
            promesa = BuscarPersonaporNombres(regex, desde , personas,'TEACHER_ROLE')
            break;
        case 'Usuario':
            promesa = BuscarGeneralpornombre(regex, Usuario, desde);
            break;
        case 'clase':
            promesa = BuscarGeneralpornombre(regex, clase, desde);
            break;
        case 'diciplina':
            promesa = BuscarGeneralpornombre(regex, diciplina, desde);
            break;

        default:
            return  res.status(500).json({
                ok: false,
                mesaje: 'los tipos de busquedas son personas, deportista , clase , diciplina , usuarios, personal, deportista ',
                error: {mensaje: 'tipo de tabla/collecion no vaido'}
                })
            break;
    }

    promesa.then(
        resp => {

            res.status(200).json({
                ok: true,
                usuarios: resp,
                cantidad: Object.keys(resp).length 
            })

        }
    )




})




////////////////////////////////////////
function BuscarGeneralpornombre(busqueda, colleccion, desde) {
    return new Promise((resolve, reject) => {
        colleccion.find({ Nombre: busqueda })
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
    var resp=[]
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