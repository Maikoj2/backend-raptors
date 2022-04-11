var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;

var disciplinaSchema = new schema({

    
    NombreDiciplina: { type: String, required: [true, 'el nombre es necesario'] },
    valor_hora: { type: Number, required: true},
    valor_mensualidad: { type: Number, required: true},
    

    
},{ collection: 'disciplinas' });

disciplinaSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('disciplina', disciplinaSchema);