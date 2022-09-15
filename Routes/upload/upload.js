const expres = require('express');
const  app = expres();
require('module-alias/register')
const  fileUpload = require('express-fileupload');

const { UploadItem } = require('@Controllers/upload/upload');

// default options
app.use(fileUpload());

//  rutas
app.put('/:tipo/:id', UploadItem);

module.exports = app;