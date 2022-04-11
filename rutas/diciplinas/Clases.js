var expres = require('express')
var app = expres();
var Registro = require('../../modelos/clases/Registro');
var Clase = require('../../modelos/clases/clase');
var autenticacion = require('../../middelware/autenticacion');
const clase = require('../../modelos/clases/clase');



//  rutas
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    Clase.find({},)
        .skip(desde)
        .populate('id_diciplina', ' NombreDiciplina ')
        .populate('id_profesor', ' Nombres Apellidos email')
        .populate('Usuario', 'Nombre email'
        )
        .limit(25)
        .exec(
            (err, prestamo) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando clase',
                        erros: err
                    });
                }
                Clase.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        clase: prestamo,
                        total: conteo
                    });


                })
              

            });




});

// ==============================
// ingresar Clase nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var id_usuario = req.usuario._id;
        var clase = new Clase({
            Nombre: body.nombre,
            id_diciplina: body.idDciplina,
            id_Profe: body.idProfe,
            FechaInicio: body.FechaI,
            FechaFin: body.FechaF,
            Horario: body.Horario,
            Lugar: body.Lugar,
            HoraInicio: body.HoraInicio,
            HoraFin: body.HoraFin,
            Usuario: id_usuario

        });

        clase.save((err, ClaseGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error crear Clase',
                    erros: err
                });
            }
            res.status(201).json({
                ok: true,
                disciplina: ClaseGuardado
            });

        });



    });

// ==============================
// actualizar  los Personas
// ==============================

app.put('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var id_usuario = req.usuario._id;

    Clase.findById(id, (err, clase) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar clase',
                erros: err
            });
        }

        if (!clase) {
            return res.status(400).json({
                ok: false,
                mensaje: 'clase con ' + id + ' no existe',
                erros: { message: 'no existe el clase con ese id ' }
            });
        }
       
        clase.Nombre =  body.nombre,
            clase.id_diciplina =  body.idDciplina,
            clase.id_Profe =  body.idProfe,
            clase.FechaInicio =  body.FechaI,
            clase.FechaFin =  body.FechaF,
            clase.Horario =  body.Horario,
            clase.Lugar =  body.Lugar,
            clase.HoraInicio =  body.HoraInicio,
            clase.HoraFin =  body.HoraFin,
            clase.Usuario =  id_usuario

        clase.save((err, claseGuardado) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuraio',
                    erros: err
                });
            }
            claseGuardado.password='<3'
            res.status(200).json({
                ok: true,
                clase: claseGuardado
            });

        });

    });

});



// ==============================
// eliminar  los clase
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var data;

    Registro.findOne({ id_clase: id }, (err, claseborrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borar clase',
                erros: err
            });
        }
        
        if (claseborrado != null ||  claseborrado == {}) {
            return res.status(205).json({
                ok: false,
                mensaje: 'la clase con id: ' + id + ' tiene registrado alumnos  ',
                erros: { message: 'borre los registros antes de borrar una clase ' }
            });
        }
        clase.findByIdAndRemove(id, (err, claseborrado) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borar clase',
                    erros: err
                });
            }
            if (!claseborrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'no hay una clase  con ' + id + ' no existe',
                    erros: { message: 'no existe la clase  con ese id ' }
                });
            }
            data = `${data} ${claseborrado}`;
        

        });
        res.status(201).json({
            ok: true,
            mensaje: 'la clase tiene fue borrada',
            data: data
        });

    });


});




module.exports = app;