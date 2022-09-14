const expres = require('express')
const app = expres();
const { getItems, createItem, updateItem, deleteItem } = require('../../Controllers/accounting/BaseSalary');
const { check } = require('express-validator');
const { token, valid } = require('../../middleware');
const { ExistById, DeletedBaseSalary } = require('../../helpers/Validators/dbValidators');
const { BaseSalaryModel, StaffModel } = require('../../models');

//  rutas
app.get('/', getItems);


// ==============================
// ingresar SueldoBase nuevo 
// ==============================
app.post('/', [
    token.verificatoken,
    check(['position', 'BaseSalary', 'valuePerHour'], `data can't be empty`).not().isEmpty(),
    valid.validateFields,
],
    createItem);


// ==============================
// actualizar  los Personas
// ==============================

app.put('/:id', [
    token.verificatoken,
    check('id').isMongoId().bail().custom((id) => ExistById(id, BaseSalaryModel)),
    valid.validateFields,
],
    updateItem);




// ==============================
// eliminar  
// ==============================

app.delete('/:id', [
    token.verificatoken,
    check('id').isMongoId().bail().custom((id) => ExistById(id, BaseSalaryModel)).bail().custom((id) => DeletedBaseSalary(id, StaffModel)),
    valid.validateFields,
],
    deleteItem);





module.exports = app;