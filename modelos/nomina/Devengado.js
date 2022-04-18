var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema; 
var DevengadoSchema = new schema({

    id_personal:    { type: String ,ref: 'Profesor', required: true},
    fecha: { type: Date, requeride: true},
    Dias_laborados: { type: Number, default: 0, require: true},
    Basico_devengado: { type: Number, default: 0},
    id_HoraEXtra:    { type: String ,ref: 'HoraExtra', required: true},
    Comiciones: { type: Number, default: 0},
    Bonificaciones: { type: Number, default: 0},
    Auxilio_transporte: { type: Number, default: 0},
    Total_conAuxiolioT: { type: Number, default: 0},
    Total_Sin_auxilio: { type: Number, default: 0},
 
   
    
},{ collection: 'Devengados' });

DevengadoSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Devengado', DevengadoSchema);