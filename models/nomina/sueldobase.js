var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema; 
var SueldoBaseSchema = new schema({

    Cargo: { type: String, required: [true, 'el nombre es necesario'] },
    Sueldo_Base: { type: Number, required: [true, 'el nombre es necesario'] },
    Valor_Hora: { type: Number, required: [true, 'el nombre es necesario'] },
    Usuario: { type: schema.Types.ObjectId, ref: 'usuario', required: true  }  
    
},{ 
    collection: 'sueldosBases', 
}
    
    );

SueldoBaseSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('sueldosBase', SueldoBaseSchema);