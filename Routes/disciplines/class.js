const expres = require('express')
const app = expres();
const Registro = require('../../models/discipline/signUpClass');
const Clase = require('../../models/discipline/class');
const autenticacion = require('../../middelware/autenticacion');
const clase = require('../../models/discipline/class');
const { getItems, createItem, updateItem } = require('../../Controllers/discipline/class');



//  rutas
app.get('/', getItems);

// ==============================
// ingresar Clase nuevo 
// ==============================
app.post('/', autenticacion.verificatoken,createItem);

// ==============================
// actualizar  los Personas
// ==============================

app.put('/:id', autenticacion.verificatoken, updateItem);



// ==============================
// eliminar  los clase
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    const id = req.params.id;
    let data = '';

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
        clase.deleteOne({_id: id}, (err, claseborrado) => {


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