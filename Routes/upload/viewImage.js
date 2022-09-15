
const expres = require('express');
const app = expres();
require('module-alias/register')
const getImage = require('@Controllers/upload/viewImage');
const { token } = require('@middleware');



//  rutas
app.get('/:tipo/:img', token.verificatoken ,getImage);


module.exports = app;