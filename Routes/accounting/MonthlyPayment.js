const expres = require('express')
const app = expres();
require('module-alias/register')
const { token } = require('@middleware');
const { getItems } = require('@Controllers/accounting/MonthlyPaymenst');




//  rutas
app.get('/', token.verificatoken,getItems);



module.exports = app;