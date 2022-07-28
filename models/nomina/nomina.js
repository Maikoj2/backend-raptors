var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema; 
var NominaSchema = new schema({


    id_personal:    { type: String ,ref: 'Profesor', required: true},
    id_Deducidos:    { type: String ,ref: 'Deducido', required: true},
    id_Devengado:    { type: String ,ref: 'Devengado', required: true},
    fecha: { type: Date, requeride: true},
    Total_neto: { type: Number,  default: 0},
    Usuario: { type: schema.Types.ObjectId, ref: 'usuario', required: true  },
  

   
    
},{ collection: 'Nominas' });

NominaSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Nominas', NominaSchema);