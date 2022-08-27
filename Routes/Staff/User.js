const expres = require('express');
const app = expres();
const { check } = require('express-validator')
const autenticacion = require('../../middleware/autenticacion');
const { getItems, createItem, updateItem, deleteItem } = require('../../Controllers/Staff/user');
const { validateFields } = require('../../middleware/ValidateInputs');
const { isRolValid, emailExist, ExistById } = require('../../helpers/Validators/dbValidators');
const { UserModel } = require('../../models');

/**
 * get a list of all users 
 */
app.get('/', autenticacion.verificatoken, getItems);

/**
 * Create a new user on database 
 */
app.post('/', [
    check('email', 'the email is invalide').isEmail(),
    check('Name', 'the email is required').not().isEmpty(),
    check('password', 'the password is required').not().isEmpty(),
    check('password', 'the must be greater than 6 characters').isLength({ min: 6 }),
    check('role').custom(isRolValid),
    check('email').custom((email) => emailExist(email, UserModel)),
    validateFields,
    autenticacion.verificatoken], createItem);

/**
 * Update a user by id 
 */
app.put('/:id', [
    check('id', 'the id is invalide').isMongoId(),
    check('role').custom(isRolValid),
    check('id').custom((id) => ExistById(id, UserModel)),
    validateFields,
    autenticacion.verificatoken
], updateItem);

/**
 * delete a user by id 
 */

app.delete('/:id',[
    check('id', 'the id is invalide').isMongoId().bail().custom((id) => ExistById(id, UserModel)),
     validateFields,
     autenticacion.verificatoken], 
     deleteItem);

module.exports = app; 