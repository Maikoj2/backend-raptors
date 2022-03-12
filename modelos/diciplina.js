var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;

var disciplinaSchema = new schema({

    NombreDiciplina: { type: String, required: [true, 'el nombre es necesario'] },
    Horario: { type: String, required: [true, 'el Horario es necesario'] },
    Lugar: { type: String, required: true},
    Hora: { type: String, required: true}

    
});

disciplinaSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('disciplina', disciplinaSchema);