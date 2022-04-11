var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;
var ClaseSchema = new schema({
    
    Nombre: { type: String, required: true},
    id_diciplina: { type: schema.Types.ObjectId , ref: 'disciplina', required: [true, 'el nombre es necesario'] },
    id_Profe: { type: String , ref: 'persona', required: true },
    FechaInicio: { type: Date, required: [true, 'el nombre es necesario'] },
    FechaFin: { type: Date, required: [true, 'el nombre es necesario'] },
    Horario: { type: String, required: [true, 'el Horario es necesario'] },
    Lugar: { type: String, required: true},
    HoraInicio: { type: String, required: true},
    HoraFin: { type: String, required: true},
    Usuario: { type: schema.Types.ObjectId, ref: 'usuario', required: true  },
   
    
},{ collection: 'clases' });

ClaseSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('clase', ClaseSchema);