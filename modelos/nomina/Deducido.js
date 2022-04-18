var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema; 
var DeducidoSchema = new schema({


    id_personal:    { type: String ,ref: 'Profesor', required: true},
    fecha: { type: Date, requeride: true},
    Salud: { type: Number, default: 0},
    Pension: { type: Number, default: 0},
    Fondo_Solidadridad: { type: Number, default: 0  },
    Retencion_fuente: { type: Number,  default: 0},
    Total_Deducido: { type: Number,  default: 0},
  

   
    
},{ collection: 'Deducidos' });

DeducidoSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Deducido', DeducidoSchema);