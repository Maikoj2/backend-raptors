const expres = require('express')
const app = expres();
require('module-alias/register')
const { check, body } = require('express-validator');
const { token, valid } = require('@middleware');

const { getItemsExtrasHours, updateItemExtrasHours } = require('@Controllers/accounting/payroll/ValueEstraHours');
const { ExistById, isPaymodeValid, ExistPayroll, } = require('@helpers/Validators/dbValidators');
const { ValueExtraHourslModel, TransportAssitancelModel, payrollModel, StaffModel, payModeModel } = require('@models');
const { getItemsTransportAssitance, updateItemTransportAssitance } = require('@Controllers/accounting/payroll/TransportAssitance');
const { getItems, createItem, updateItem, createItems, deleteItem } = require('@Controllers/accounting/payroll/payroll');



/*********************************************************************************************** /
*                                      payroll rutes                                            *   
************************************************************************************************/


//get items of  payrolls //
app.get('/', getItems);


//create all  items of  payrolls in a specific Date and type salary //
app.post('/several/:TypeSalary', [
    check(['Date', 'TypeSalary'], `data can't be empty`).not().isEmpty(),
    check('TypeSalary').custom((TypeSalary) => isPaymodeValid(TypeSalary, payModeModel)),
    valid.validateFields,
    token.verificatoken],
    createItems);



app.post('/', [
    token.verificatoken,
    check(['Date', 'id_staff'], `data can't be empty`).not().isEmpty(),
    body('id_staff').isMongoId().bail().custom((id) => ExistById(id, StaffModel)).bail().custom((value, { req }) => ExistPayroll(req.body, payrollModel)),
    valid.validateFields,
],
    createItem);



app.put('/:id', [
    token.verificatoken,
    check('id').isMongoId().bail().custom((id) => ExistById(id, payrollModel)),
    valid.validateFields,
], updateItem);

app.delete('/:id', [
    token.verificatoken,
    check('id').isMongoId().bail().custom((id) => ExistById(id, payrollModel)),
    valid.validateFields,
], deleteItem)



/*********************************************************************************************** /
 *                              getItems value per percentage Extra hours                        *   
 ************************************************************************************************/

app.get('/ValueExtrasHours', getItemsExtrasHours);

/**
 * Update value   per percentage Extra hours
 */
app.put('/ValueExtrasHours/:id', [
    check('id').isMongoId().bail().custom((id) => ExistById(id, ValueExtraHourslModel)),
    valid.validateFields,
    token.verificatoken], updateItemExtrasHours);


/*********************************************************************************************** /
 *                              getItems value TransportAssitance                               *
 ************************************************************************************************/

app.get('/ValueTransportAssitance', getItemsTransportAssitance);

/**
 * Update value  TransportAssitance
 */
app.put('/ValueTransportAssitance/:id', [
    check('id').isMongoId().bail().custom((id) => ExistById(id, TransportAssitancelModel)),
    valid.validateFields,
    token.verificatoken], updateItemTransportAssitance);
/*********************************************************************************************** */



module.exports = app;