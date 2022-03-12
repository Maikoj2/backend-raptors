var expres = require('express')
var app = expres();
var Disciplina = require('../modelos/diciplina');
var autenticacion = require('../middelware/autenticacion')


// ==============================
// obtener todos los disciplinas
// ==============================

app.get('/', (req, res, next) => {



    var desde = req.query.desde || 0;
    desde = Number(desde);

    Disciplina.find({},)
        .skip(desde)
        .limit(5)
        .exec(
            (err, disciplina) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuraio',
                        erros: err
                    });
                }
                // disciplina.count({}, (err, conteo) => {



                // })
                res.status(200).json({
                    ok: true,
                    disciplina: disciplina,
                    // total: conteo
                });

            });




});

// ==============================
// actualizar  los Personas
// ==============================

// app.put('/:id', (req, res) => {

//     var id = req.params.id;
//     var body = req.body;

//     Persona.findById(id, (err, persona) => {


//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'Error al buscar persona',
//                 erros: err
//             });
//         }

//         if (!persona) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'persona con ' + id + ' no existe',
//                 erros: { message: 'no existe el persona con ese id ' }
//             });
//         }

//         persona.Nombre = body.nombre;
//         persona.email = body.email;
//         persona.role = body.role;

//         persona.save((err, personaGuardado) => {

//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     mensaje: 'Error actualizar usuraio',
//                     erros: err
//                 });
//             }
//             personaGuardado.password = '<3'
//             res.status(200).json({
//                 ok: true,
//                 persona: personaGuardado
//             });

//         });

//     });

// });
// ==============================
// ingresar disciplina nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;

        var disciplina = new Disciplina({
            NombreDiciplina: body.nombre,
            Horario: body.horario,
            Hora: body.hora,
            Lugar: body.Lugar
        });

        disciplina.save((err, disciplinaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error crear disciplina',
                    erros: err
                });
            }
            res.status(201).json({
                ok: true,
                disciplina: disciplinaGuardado
            });

        });

    
    });


module.exports = app;