const mongoose = require('mongoose');
const  mongooseDelete = require('mongoose-delete'); 

const schema = mongoose.Schema; 
const HoraExtraSchema = new schema({
    H_E_Daytime: { type: Number, default: 0},
    H_E_Night: { type: Number, default: 0  },
    Night_Surcharge: { type: Number,  default: 0  },
    H_Holiday_Daytime: { type: Number,  default: 0  },
    H_Holiday_Night: { type: Number, default: 0   },
    H_E_F_Daytime: { type: Number,  default: 0  },
    H_E_F_Night: { type: Number,  default: 0  },
    Total: { type: Number,  default: 0  },   
},{ collection: 'ExtrasHours' , timestamps: true});

HoraExtraSchema.plugin(mongooseDelete, { overrideMethods: 'all' })
HoraExtraSchema.methods.toJSON = function () {
    const { __v, deleted, ...BaseSalarys } = this.toObject();
    return BaseSalarys;
}

module.exports = mongoose.model('ExtraHour', HoraExtraSchema);