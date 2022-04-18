var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema; 
var HoraExtraSchema = new schema({

    id_personal:    { type: String ,ref: 'Profesor', required: true},
    fecha: { type: Date, requeride: true},
    H_E_Diurna: { type: Number, default: 0},
    Valor_H_E_Diurna: { type: Number, default: 0},
    H_E_Nocturna: { type: Number, default: 0  },
    Valor_H_E_Nocturna: { type: Number,  default: 0},
    Recargo_Nocturno: { type: Number,  default: 0  },
    Valor_Recargo_Nocturno: { type: Number,  default:0},
    H_Fesiva_Diurna: { type: Number,  default: 0  },
    Valor_H_Fesiva_Diurna: { type: Number,  default: 0  },
    H_Festiva_Nocturna: { type: Number, default: 0   },
    Valor_H_Festiva_Nocturna: { type: Number,  default: 0  },
    H_E_F_Diurna: { type: Number,  default: 0  },
    Valor_H_E_F_Diurna: { type: Number,  default: 0  },
    H_E_F_Nocturna: { type: Number,  default: 0  },
    Valor_H_E_F_Nocturna: { type: Number,  default: 0  },
    Valor_Total_H_E: { type: Number, default: 0   },


   
    
},{ collection: 'HorasExtras' });

HoraExtraSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('HoraExtra', HoraExtraSchema);