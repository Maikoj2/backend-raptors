var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;
var rolesValidos = {

    values: ['ACTIVO','NO_ACTIVO'],
    message: '{VALUE} no es un Estado valido'
} 

var deportistaSchema = new schema({


    _id:    { type: String , required: false, unique: true},
    FechaNacimiento: { type: Date, required: [true, 'el nombre es necesario'] },
    DepartamentNacimiento: { type: String, required: [true, 'el nombre es necesario'] },
    MunicipioNacimiento: { type: String, required: [true, 'el nombre es necesario'] },
    VeredaNacimiento: { type: String, required: false,default: '' },
    Edad: { type: String, required: true },
    img: { type: String, required: false , default: ' '},
    IdContacto: { type: String, ref: 'contactos' ,required: true},
    IdContacto2: { type: String,ref: 'contactos', required: true },
    padecimientos: { type: String ,required: false},
    Medicamentos: { type: String ,required: false},
    Alergias: { type: String ,required: false},
    TipoSangre: { type: String ,required: false},
    TallaCalzado: { type: String ,required: false},
    TallaCamizeta: { type: String ,required: false},
    TallaPantaloneta: { type: String,required: false },
    Estatura: { type: String,required: false },
    Peso: { type: String ,required: false},
    Estado: { type: String ,required: false,  default: 'ACTIVO', enum: rolesValidos},
    Diciplina: { type: schema.Types.ObjectId, ref: 'disciplina', required: true  },
    
    
    
});

deportistaSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('deportista', deportistaSchema);