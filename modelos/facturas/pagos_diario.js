var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;

var PagodiarioSchema = new schema({
    
    id_registro: { type: String, required: true, ref:'registro' },
    valor:    { type: Number ,   required: true},
    Usuario: { type: schema.Types.ObjectId, ref: 'usuario', required: true  },
   
    
},{ collection: 'pagosDiarios' });

PagodiarioSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('PagoDiario', PagodiarioSchema);