var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;
var estadosValidos = {

    values: ['PAGO', 'DEBE'],
    message: '{VALUE} no es un rol valido'
};

var prestamoSchema = new schema({
    idRegistro: { type: String, ref: 'registro' ,required: true},
    Descripcion: { type: String, default:' ', required: false },
    ValorDeuda: { type: Number, required: true },
    Fecha: { type: Date, required: true },
    estado: { type: String, required: true, default: 'DEBE', enum: estadosValidos },
    Usuario: { type: schema.Types.ObjectId, ref: 'usuario', required: true  },
   
    
},{ collection: 'prestamos' });

prestamoSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('prestamo', prestamoSchema);