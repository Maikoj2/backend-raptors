const { type } = require('express/lib/response');
var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;


var rolesValidos = {

    values: ['USER_ROLE','TEACHER_ROLE'],
    message: '{VALUE} no es un rol valido'
} 

var PersonaSchema = new schema({

    _id:    { type: String , required: true, unique: true},
    TipoId: { type: String,  required: [true, 'el nombre es necesario'] },
    Nombres: { type: String, required: [true, 'el nombre es necesario'] },
    Apellidos: { type: String, required: [true, 'el nombre es necesario'] },
    Sexo: { type: String, required: [true, 'el nombre es necesario'] },
    Barrio: { type: String, required: [true, 'el nombre es necesario'] },
    Direccion: { type: String, required: [true, 'el nombre es necesario'] },
    Telefono: { type: String, required: [true, 'el nombre es necesario'] },
    Ocupacion: { type: String, required: [true, 'el nombre es necesario'] },
    email: { type: String, required: [true, 'el correo es necesario'] },
    EPS: { type: String, required: false },
    tipoDiciplina: { type: String, default: 'deportista', required: true  },
    email: { type: String, required: [true, 'el correo es necesario'] },
    idperfil: { type: String, ref: 'deportista', required: false  },
    Usuario: { type: schema.Types.ObjectId, ref: 'usuario', required: true  },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
   
    
});
PersonaSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('persona', PersonaSchema);