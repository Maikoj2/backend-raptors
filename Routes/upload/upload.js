const expres = require('express');
const  app = expres();
require('module-alias/register')
const  fileUpload = require('express-fileupload');
const { valid, token } = require('@middleware');
const { UploadItem } = require('@Controllers/upload/upload');
const { CollectionsValide } = require('@helpers/Validators/dbValidators');
const { check } = require('express-validator');


// default options
app.use(fileUpload());

//  rutas
app.put('/:collection/:id',
[   
   
    token.verificatoken,
    check('collection').custom( (c) => CollectionsValide(c,['staff', 'User'])),
    check('id', 'the id is invalide').isMongoId(),
    valid.validateFields,
] ,UploadItem);

module.exports = app;