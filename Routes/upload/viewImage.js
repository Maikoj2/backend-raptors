var expres = require('express');
const getImage = require('../../Controllers/upload/viewImage');
var app = expres();
const autenticacion = require('../../middleware/autenticacion');



//  rutas
app.get('/:tipo/:img', autenticacion.verificatoken ,getImage);


module.exports = app;