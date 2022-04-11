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
 var loginRout = require('./rutas/personal/login');
 var UsuarioRoutes = require('./rutas/personal/usuario');
 var PrestamoRoutes = require('./rutas/contabilidad/prestamo');
 var pagodiarioRoutes = require('./rutas/contabilidad/pagosDiario');
 var pagomensualRoutes = require('./rutas/contabilidad/pagoMensual');
 var DeportistaRoutes = require('./rutas/diciplinas/deportista');
 var ProfesorRoutes = require('./rutas/personal/Profesor');
 var personaRoutes = require('./rutas/personal/persona');
 var ClaseRoutes = require('./rutas/diciplinas/clases');
 var asistenciaRoutes = require('./rutas/diciplinas/asistencia');
 var RegistrosRoutes = require('./rutas/diciplinas/registro');
 var DiciplinaRoutes = require('./rutas/diciplinas/diciplina');

// coneccion bd
mongoose.connection.openUri('mongodb://localhost:27017/RaptorsDb', (err, res) => {
    if (err) throw err;
    console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
}); 
// rutas
app.use('/persona', personaRoutes);
app.use('/Profesores', ProfesorRoutes);
app.use('/Prestamo', PrestamoRoutes);
app.use('/pago-por-dia', pagodiarioRoutes);
app.use('/pago-Mensual', pagomensualRoutes);

app.use('/clase', ClaseRoutes);
app.use('/asistencia', asistenciaRoutes);
app.use('/registro', RegistrosRoutes);
app.use('/deportista', DeportistaRoutes);
app.use('/diciplina', DiciplinaRoutes);
app.use('/login', loginRout);
app.use('/usuario', UsuarioRoutes);
app.use('/', appRoutes);



app.listen(3000, () => {
    console.log('Express  server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});