const expres = require('express')
const app = expres();
const { check } = require('express-validator')
const Login = require('../../Controllers/Staff/login');
const { validateFields } = require('../../middleware/ValidateInputs');
const { emailNoExist } = require('../../helpers/Validators/dbValidators');
const { UserModel } = require('../../models');

app.post('/', [
    check('email', 'the email is required').not().isEmpty(),
    check('email', 'the email is invalide').isEmail(),
    check('password', 'the password is required').not().isEmpty(),
    check('email').custom((email) => emailNoExist(email, UserModel)),
    validateFields,

], Login);

module.exports = app;