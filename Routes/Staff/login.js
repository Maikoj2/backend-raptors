const expres = require('express')
const app = expres();
const Login = require('../../Controllers/Staff/login');

app.post('/', Login);







module.exports = app;