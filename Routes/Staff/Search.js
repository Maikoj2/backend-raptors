const expres = require('express')
const app = expres();
const { check } = require('express-validator');
require('module-alias/register')

const { getItemsByname, getItemsByCameOnColletion } = require('@Controllers/Staff/Search');
const { ExistCollections } = require('@helpers/Validators/dbValidators');
const { valid } = require('@middleware');

//  rutas
app.get('/all/:search',[
    valid.validateFields,
    check('search', 'the search must be min length 5 ').isLength({ min: 2 }),
], getItemsByname);


// busca por colleciones
app.get('/collection/:table/:search' ,[
    valid.validateFields,
    check('search', 'the search must be min length 5 ').isLength({ min: 2 }),
    check('table').custom((table,next) =>ExistCollections(table,next)),
] , getItemsByCameOnColletion );






module.exports = app;