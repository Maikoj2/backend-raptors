var expres = require('express');
const getImage = require('../../Controllers/upload/viewImage');
var app = expres();
const { token, validateFields } = require('../../middleware');



//  rutas
app.get('/:tipo/:img', token.verificatoken ,getImage);


module.exports = app;