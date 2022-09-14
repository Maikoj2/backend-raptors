const expres = require('express')
const app = expres();

const {token, rol} = require('../../middleware');
const { getItems } = require('../../Controllers/accounting/DailyPayment');



//  rutas
app.get('/', [token.verificatoken, rol.haveRol('ADMIN_ROLE', 'TEACHER_ROLE')], getItems);




module.exports = app;