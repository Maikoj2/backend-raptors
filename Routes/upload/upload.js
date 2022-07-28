const expres = require('express');
const  app = expres();
const  fileUpload = require('express-fileupload');

const { UploadItem } = require('../../Controllers/upload/upload');

// default options
app.use(fileUpload());

//  rutas
app.put('/:tipo/:id', UploadItem);

module.exports = app;