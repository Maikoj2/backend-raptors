// Requires
const  express = require('express');
const  mongoose = require('mongoose');
const  bodyParser = require('body-parser')
const fs = require("fs");
const https = require("https");
const  cors = require('cors')



const  app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( cors() )

//rutas importadas
//  const  BusquedaRoutes = require('./rutas/personal/Busqueda');
 
// //rutas importadas (personal completo)
//  const  UsuarioRoutes = require('./rutas/personal/usuario');
//  const  ProfesorRoutes = require('./rutas/personal/Profesor');
//  const  personaRoutes = require('./rutas/personal/persona');
//  const  DeportistaRoutes = require('./rutas/diciplinas/deportista');
// //rutas importadas(nominas y pagos)
// const  PrestamoRoutes = require('./rutas/contabilidad/prestamo');
// const  pagodiarioRoutes = require('./rutas/contabilidad/pagosDiario');
// const  SueldoBaseRoutes = require('./rutas/contabilidad/sueldobase');
// const  pagomensualRoutes = require('./rutas/contabilidad/pagoMensual');
// const  NominaRoutes = require('./rutas/contabilidad/Nomina/Nomina');
// const  pagomensualRoutes = require('./rutas/contabilidad/pagoMensual');
// //rutas importadas(clases y diciplinas)
// const  ClaseRoutes = require('./rutas/diciplinas/clases');
// const  asistenciaRoutes = require('./rutas/diciplinas/asistencia');
// const  RegistrosRoutes = require('./rutas/diciplinas/registro');
// const  DiciplinaRoutes = require('./rutas/diciplinas/diciplina');
// // upload
// const  UploadRoutes = require('./rutas/upload/upload');
// // imagenes
// const  imagenesRoutes = require('./rutas/imagenes');

// coneccion bd
mongoose.connection.openUri('mongodb://localhost:27017/RaptorsDb', (err, res) => {
    if (err) throw err;
    console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
});


// rutas
// app.use('/persona', personaRoutes);
// app.use('/Profesores', ProfesorRoutes);
// app.use('/Prestamo', PrestamoRoutes);
// app.use('/pago-por-dia', pagodiarioRoutes);
// app.use('/pago-Mensual', pagomensualRoutes);
// app.use('/Nomina', NominaRoutes);
// app.use('/sueldo-Base', SueldoBaseRoutes);
// app.use('/Busqueda', BusquedaRoutes);
// app.use('/upload', UploadRoutes);
// app.use('/img', imagenesRoutes);

// app.use('/clase', ClaseRoutes);
// app.use('/asistencia', asistenciaRoutes);
// app.use('/registro', RegistrosRoutes);
// app.use('/deportista', DeportistaRoutes);
// app.use('/diciplina', DiciplinaRoutes);
// app.use('/login', loginRout);
// app.use('/usuario', UsuarioRoutes);
app.use('/', require('./Routes'));



app.listen(3000, () => {
    console.log('Express  server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});
