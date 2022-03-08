// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


// Inicializar variables
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rutas importadas
 var appRoutes = require('./rutas/app');
 var loginRout = require('./rutas/login');
 var UsuarioRoutes = require('./rutas/usuario');

// coneccion bd
mongoose.connection.openUri('mongodb://localhost:27017/RaptorsDb', (err, res) => {
    if (err) throw err;
    console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
}); 
// rutas
app.use('/login', loginRout);
app.use('/usuario', UsuarioRoutes);
app.use('/', appRoutes);



app.listen(3000, () => {
    console.log('Express  server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});