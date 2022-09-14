const expres = require('express')
const app = expres();
const { check } = require('express-validator')
const { Login, RevalidateToken} = require('../../Controllers/Staff/login');
 
const { emailNoExist } = require('../../helpers/Validators/dbValidators');
const { valid, token } = require('../../middleware');
const { verificatoken } = require('../../middleware/autenticacion');
const { UserModel } = require('../../models');

app.post('/', [
   check('email').isEmail().withMessage('is not valid')
   .bail().custom((email) => emailNoExist(email, UserModel)).withMessage(`it's not registered`),
   check('password', 'the password is required').not().isEmpty(), 
   valid.validateFields
]
, Login);

app.get('/reNew', token.verificatoken
 ,RevalidateToken);

module.exports = app;