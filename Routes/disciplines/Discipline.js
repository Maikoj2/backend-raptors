const  expres = require('express')
const  app = expres();
require('module-alias/register')
const { check } = require('express-validator')
const  Disciplina = require('@models/discipline/discipline');
const { getItems, createItem, updateItem } = require('@Controllers/discipline/Discipline');

const { ExistById } = require('@helpers/Validators/dbValidators');
const { DisciplineModel } = require('@models');
const { valid, token } = require('@middleware');

/**
 * get al  discipline  registered 
 */

app.get('/', getItems);

/**
 * update a discipline  registered 
 */

app.put('/:id',[ 
    token.verificatoken,
    check('id', 'the id is invalide').isMongoId(),
     check('id').custom((id) => ExistById(id, DisciplineModel)),
    valid.validateFields,
], updateItem);
/**
 * create a discipline  registered 
 */
app.post('/', [ 
    token.verificatoken,
    check('Names', 'the occupNamesation is required').not().isEmpty(),
    check('valuePerHour', 'the valuePerHour is required').not().isEmpty(),
    check('valuePerMonth', 'the valuePerMonth is required').not().isEmpty(),
    valid.validateFields,
], createItem);
/**
 * deleted (todo) discipline  registered 
 */

app.delete('/:id', token.verificatoken, (req, res) => {

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