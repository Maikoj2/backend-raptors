var expres = require('express')
var app = expres();
var persona = require('../../models/staff/Personas');

// ==============================
// obtener todos los deportistas
// ==============================

app.get('/', (req, res, next)=>{
    
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
                persona.estimatedDocumentCount({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        personas: personas,
                        total: conteo
                        
                    });
                });
              
            });
});


module.exports = app;