const expres = require('express')
const app = expres();
const pagomensual = require('../../models/facturas/MonthlyPayment');
const { token,valid } = require('../../middleware');
const { getItems } = require('../../Controllers/accounting/MonthlyPaymenst');




//  rutas
app.get('/', token.verificatoken,getItems);



module.exports = app;