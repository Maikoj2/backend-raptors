var expres = require('express')
var app = expres();
var persona = require('../modelos/Personas');

// ==============================
// obtener todos los deportistas
// ==============================

app.get('/', (req, res, next)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    persona.find({})
        .exec(
            (err, personas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando persona',
                        erros: err
                    });
                }
                // persona.count({}, (err, conteo) => {
                   
                // });
                res.status(200).json({
                    ok: true,
                    personas: personas,
                    // total: conteo

                });
            });
});


module.exports = app;