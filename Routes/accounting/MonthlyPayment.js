const expres = require('express')
const app = expres();
const { token } = require('../../middleware');
const { getItems } = require('../../Controllers/accounting/MonthlyPaymenst');




//  rutas
app.get('/', token.verificatoken,getItems);



module.exports = app;