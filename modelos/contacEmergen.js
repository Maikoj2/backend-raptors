var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;
var ContactoSchema = new schema({

    _id:    { type: String , required: true, unique: true},
    Nombres: { type: String, required: [true, 'el nombre es necesario'] },
    Apellidos: { type: String, required: [true, 'el nombre es necesario'] },
    Barrio: { type: String, required: [true, 'el nombre es necesario'] },
    Direccion: { type: String, required: [true, 'el nombre es necesario'] },
    Telefono: { type: String, required: [true, 'el nombre es necesario'] },
    Ocupacion: { type: String, required: [true, 'el nombre es necesario'] },
    email: { type: String, required: false },
   
    
},{ collection: 'contactos' });

ContactoSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('contactos', ContactoSchema);