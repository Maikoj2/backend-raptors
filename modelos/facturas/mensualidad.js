var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;

var MensualidadSchema = new schema({
    
    id_registro: { type: String, required: true, ref:'registro' },
    valor:    { type: Number ,   required: true},
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    Usuario: { type: schema.Types.ObjectId, ref: 'usuario', required: true  },
   
    
},{ collection: 'pagosMensuales' });

MensualidadSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Mensualidad', MensualidadSchema);