const expres = require('express');
const app = expres();
require('module-alias/register')
const { check } = require('express-validator')
const { valid, token } = require('@middleware');
const { getItems, createItem, updateItem, deleteItem } = require('@Controllers/Staff/user');
 
const { isRolValid, emailExist, ExistById } = require('@helpers/Validators/dbValidators');
const { UserModel } = require('@models');

/**
 * get a list of all users 
 */
app.get('/', token.verificatoken, getItems);

/**
 * Create a new user on database 
 */
app.post('/', [
    check('email', 'the email is invalide').isEmail(),
    check('Names', 'the email is required').not().isEmpty(),
    check('password', 'the password is required').not().isEmpty(),
    check('password', 'the must be greater than 6 characters').isLength({ min: 6 }),
    check('role').custom(isRolValid),
    check('email').custom((email) => emailExist(email, UserModel)),
    valid.validateFields,
    token.verificatoken], createItem);

/**
 * Update a user by id 
 */
app.put('/:id', [
    check('id', 'the id is invalide').isMongoId(),
    check('role').custom(isRolValid),
    check('id').custom((id) => ExistById(id, UserModel)),
    valid.validateFields,
    token.verificatoken
], updateItem);

/**
 * delete a user by id 
 */

app.delete('/:id',[
    token.verificatoken,
    check('id', 'the id is invalide').isMongoId().bail().custom((id) => ExistById(id, UserModel)),
     valid.validateFields,
    ], 
     deleteItem);

module.exports = app; 