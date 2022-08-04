var expres = require('express')
var app = expres();
var SueldoBase = require('../../models/nomina/sueldobase');
var autenticacion = require('../../middelware/autenticacion');
var Personal = require('../../models/staff/Teacher')


//  rutas
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    SueldoBase.find({},)
        .skip(desde)
        .limit(5)
        .exec(
            (err, sueldobase) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando sueldobase',
                        erros: err
                    });
                }
                SueldoBase.estimatedDocumentCount({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        sueldobases: sueldobase,
                        total: conteo
                    });

                 })
           

            });




});


// ==============================
// ingresar SueldoBase nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,
    (req, res) => {
        var body = req.body;
        var id_usuario = req.usuario._id;
        var sueldobase = new SueldoBase({
            Cargo: body.Cargo,
            Sueldo_Base: body.Sueldo_Base,
            Valor_Hora: body.Valor_Hora,
            Usuario: id_usuario

        });


        sueldobase.save((err, sueldobaseGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error crear sueldobase',
                    erros: err
                });
            }
            res.status(201).json({
                ok: true,
                mensaje: 'sueldoBase registrado',
                Datos: sueldobaseGuardado
            });

        });
    });


        // ==============================
// actualizar  los Personas
// ==============================

app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    SueldoBase.findById(id, (err, sueldobase) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar sueldobase',
                erros: err
            });
        }

        if (!sueldobase) {
            return res.status(400).json({
                ok: false,
                mensaje: 'sueldobase con ' + id + ' no existe',
                erros: { message: 'no existe el sueldobase con ese id ' }
            });
        }

        sueldobase.Cargo = body.Cargo;
        sueldobase.Sueldo_Base = body.Sueldo_Base;
        sueldobase.Valor_Hora = body.Valor_Hora;
   
        sueldobase.save((err, sueldobaseGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizar usuraio',
                    erros: err
                });
            }

            res.status(200).json({
                ok: true,
                sueldobase: sueldobaseGuardado
            });

        });

    });

});




// ==============================
// eliminar  
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    var id = req.params.id;

    buscarpersonalconsueldo(id,Personal).then(Busqueda => {

        if (Object.keys(Busqueda).length === 0 || Busqueda == null) {
            

            SueldoBase.deleteOne({_id: id}, (err, sueldobaseborrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error borar sueldobase',
                        erros: err
                    });
                }
                if (!sueldobaseborrado) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'sueldo con ' + id + ' no existe',
                        erros: { message: 'no existe el sueldo con ese id ' }
                    });
                }
                res.status(200).json({
                    ok: true,
                    mensaje: 'sueldo con ' + id + ' Borrado Exitosamente',
                    usuario: sueldobaseborrado
                });
        
        
            });        

        }
        else {
            res.status(200).json({
                ok: true,
                message: ' este Registro esta asignado a las siguientes personas, borre el registro del personal e intente de nuevo',
                asistencia: Busqueda

            });
        }


    });






});


function buscarpersonalconsueldo(busqueda,Colleccion) {
    return new Promise((resolve, reject) => {
        Colleccion.find({ id_sueldoBase: busqueda })
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




module.exports = app;