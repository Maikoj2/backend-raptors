var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema; 
var AsistenciaSchema = new schema({

    
    id_registro: { type: String, required: true, ref:'registro' },
    fecha: { type: Date, required: true  },
    asistencia: { type: Boolean, default: Date.now, required: true },
    Pago: { type: Boolean, required: true },
    Usuario: { type: schema.Types.ObjectId, ref: 'usuario', required: true  },
   
    
},{ collection: 'asistencias' });

AsistenciaSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('asistencia', AsistenciaSchema);