const  expres = require('express')
const  app = expres();
const  Disciplina = require('../../models/discipline/discipline');
const  autenticacion = require('../../middelware/autenticacion');
const { getItems, createItem, updateItem } = require('../../Controllers/discipline/Discipline');


/**
 * get al  discipline  registered 
 */

app.get('/', getItems);

/**
 * update a discipline  registered 
 */

app.put('/:id',autenticacion.verificatoken, updateItem);
/**
 * create a discipline  registered 
 */
app.post('/', autenticacion.verificatoken, createItem);
/**
 * deleted (todo) discipline  registered 
 */

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    const  id = req.params.id;
    let  data ;

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