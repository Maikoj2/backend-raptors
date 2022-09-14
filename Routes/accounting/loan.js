const expres = require('express')
const app = expres();


const { check } = require('express-validator');
const { token, valid } = require('../../middleware');
const { getItems, createItem, updateItem, deleteItem } = require('../../Controllers/accounting/loan');
const { PeopleModel, LoanModel } = require('../../models');
const { ExistById } = require('../../helpers/Validators/dbValidators');

/**
 * get a list of all users that have loan
 */
app.get('/', getItems);

/**
 * Create a new loan on database 
 */
app.post('/', [
    check('idPeople').custom((idPeople) => ExistById(idPeople, PeopleModel)),
    check(['idPeople', 'description', 'valueToPay', 'Date'], `data can't be empty`).not().isEmpty(),
    valid.validateFields,
    token.verificatoken],
    createItem);

/**
 * Update a loan by id 
 */
app.put('/:id', [
    check('id').isMongoId().bail().custom((id) => ExistById(id, LoanModel)),
    valid.validateFields,
    token.verificatoken] , updateItem);

// ==============================
// eliminar  
// ==============================

app.delete('/:id', [
    token.verificatoken,
    check('id').isMongoId().bail().custom((id) => ExistById(id, LoanModel)),
    valid.validateFields,
], deleteItem);

module.exports = app;