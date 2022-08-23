const expres = require('express')
const app = expres();
const Registro = require('../../models/discipline/signUpClass');
const Clase = require('../../models/discipline/class');
const Pagodiario = require('../../models/facturas/DailyPayment');
const pagosMensuales = require('../../models/facturas/MonthlyPayment');
const autenticacion = require('../../middleware/autenticacion');
const Prestamo = require('../../models/facturas/loan');
const asistencia = require('../../models/discipline/attendance');
const { getItems, createItem, updateItem } = require('../../Controllers/discipline/signUpClass');



 


//  rutas
app.get('/', getItems);

// ==============================
// actualizar  los Profesores
// ==============================

app.put('/:id', autenticacion.verificatoken, updateItem);

// ==============================
// ingresar Alumno nuevo y crea la base de datos de los que pagan diarios o mensual
// ==============================
app.post('/', autenticacion.verificatoken, createItem);
// ==============================
// eliminar  los Usuarios
// ==============================

app.delete('/:id', autenticacion.verificatoken, (req, res) => {

    const id = req.params.id;
    Promise.all([
        buscarasistencia(id),
        buscardeudas(id),
        BuscarMensualoDiario(id, pagosMensuales),
        BuscarMensualoDiario(id, Pagodiario)
    ]).then(respuestas => {

        if (Object.keys(respuestas[0]).length === 0 &&
            Object.keys(respuestas[2]).length === 0 &&
            Object.keys(respuestas[3]).length === 0
        ) {
            Registro.deleteOne({_id: id}, (err, registroborrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error borar registro',
                        erros: err
                    });
                }
                res.status(201).json({
                    ok: true,
                    mensaje: 'registro fue borrado',
                    data: registroborrado
                });


            });
        } else {
            res.status(200).json({
                ok: true,
                message: ' debe borrar los siguientes registros',
                asistencia: respuestas[0],
                deudas: respuestas[1],
                mensualidad: respuestas[2],
                diario: respuestas[3]
            });
        }

    });

});

// funciones de busquedad ////

function buscarasistencia(busqueda) {
    return new Promise((resolve, reject) => {
        asistencia.find({ id_registro: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, asistencia) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(asistencia)
                }

            });

    });


}
function BuscarMensualoDiario(busqueda, colleccion) {
    console.log(busqueda);
    return new Promise((resolve, reject) => {
        colleccion.find({ id_registro: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, diario) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(diario)
                }

            });

    });


}

function buscardeudas(busqueda) {
    return new Promise((resolve, reject) => {
        Prestamo.find({ idRegistro: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, deudas) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(deudas)
                }

            });

    });


}
function buscarmodopago(busqueda) {
    return new Promise((resolve, reject) => {
        Registro.findById({ _id: busqueda })
            .populate({
                path: 'id_clase',
                select: 'id_diciplina',
                populate: [
                    {
                        path: 'id_diciplina',
                        select: 'valor_hora  valor_mensualidad'
                    }
                ]
            })
            .exec((err, deudas) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(deudas)
                }

            });

    });


}




// funcion save
function guardardato(dato) {
    return new Promise((resolve, reject) => {
        dato.save((err, datos) => {

            if (err) {
                reject('error al cargar asistencia')
                console.log(err);
            } else {
                resolve(datos)
            }

        });

    });


}


// eliminar registro depagos mensuales
function EliminarRegistroMensual(busqueda,colleccion) {
    return new Promise((resolve, reject) => {
        colleccion.findOneAndDelete({ id_registro: busqueda })
            // .populate('usuario', 'Nombre email')
            .exec((err, deudas) => {

                if (err) {
                    reject('error al cargar asistencia')
                } else {
                    resolve(deudas)
                }

            });

    });


}




// agrega el mes siguiente
Date.isLeapYear = function (year) { return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); };
Date.getDaysInMonth = function (year, month) { return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]; };
Date.prototype.isLeapYear = function () { const y = this.getFullYear(); return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)); };
Date.prototype.getDaysInMonth = function () { return Date.getDaysInMonth(this.getFullYear(), this.getMonth()); };
Date.prototype.addMonths = function (value) { const n = this.getDate(); this.setDate(1); this.setMonth(this.getMonth() + value); this.setDate(Math.min(n, this.getDaysInMonth())); return this; };







module.exports = app;