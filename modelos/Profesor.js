var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;


var ProfesorSchema = new schema({


    _id:    { type: String , required: false, unique: true},
    FechaNacimiento: { type: Date, required: [true, 'el nombre es necesario'] },
    DepartamentNacimiento: { type: String, required: [true, 'el nombre es necesario'] },
    MunicipioNacimiento: { type: String, required: [true, 'el nombre es necesario'] },
    VeredaNacimiento: { type: String, required: false,default: '' },
    Profecion: { type: String, required: true },
    EPS: { type: String, required: true },
    img: { type: String, required: false , default: ' '},
    ValorHora: { type: Number, required: true },
    Salario: { type: Number, required: false },
    Diciplina: { type: schema.Types.ObjectId, ref: 'diciplina', required: true  },
    
    
});

ProfesorSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Profesor', ProfesorSchema);