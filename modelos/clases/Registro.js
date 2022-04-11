var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;
var modopagoValidos = {

    values: ['MENSUAL', 'DIARIO'],
    message: '{VALUE} no es un rol valido'
};
var RegistroSchema = new schema({
    
    id_deportista:    { type: String ,  ref: 'persona', required: true},
    id_clase:    { type: String ,  ref: 'clase', required: true},
    Modopagos:    { type: String , enum: modopagoValidos, required: true},
    Usuario: { type: schema.Types.ObjectId, ref: 'usuario', required: true  },
   
    
},{ collection: 'Registros' });

RegistroSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('registro', RegistroSchema);