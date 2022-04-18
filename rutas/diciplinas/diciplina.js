var expres = require('express')
var app = expres();
var Disciplina = require('../../modelos/diciplina');
var autenticacion = require('../../middelware/autenticacion')


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
                Disciplina.estimatedDocumentCount({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        disciplina: disciplina,
                        total: conteo
                    });

                })
               

            });
});

// ==============================
// actualizar  los Personas
// ==============================

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Disciplina.findById(id, (err, disciplina) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar disciplina',
                erros: err
            });
        }

        if (!disciplina) {
            return res.status(400).json({
                ok: false,
                mensaje: 'disciplina con ' + id + ' no existe',
                erros: { message: 'no existe el disciplina con ese id ' }
            });
        }

        disciplina.Nombre = body.nombre;
        disciplina.valor_hora= body.vhora;
        disciplina.valor_mensualidad= body.vmes;

        disciplina.save((err, disciplinaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuraio',
                    erros: err
                });
            }

            res.status(200).json({
                ok: true,
                disciplina: disciplinaGuardado
            });

        });

    });

});
// ==============================
// ingresar disciplina nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;

        var disciplina = new Disciplina({
            Nombre: body.nombre,
            Horario: body.horario,
            Hora: body.hora,
            Lugar: body.Lugar,
            valor_hora: body.vhora,
            valor_mensualidad: body.vmes
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

// ==============================
// eliminar  los Usuarios
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var data;

    Disciplina.deleteOne({_id: id}, (err, disciplinaborrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar disciplina',
                erros: err
            });
        }
        if (!disciplinaborrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'persona con ' + id + ' no existe',
                erros: { message: 'no existe el persona con ese id ' }
            });
        }
        data = disciplinaborrado;
        res.status(200).json({
            ok: true,
            usuario: data
        });


    });


});




module.exports = app;