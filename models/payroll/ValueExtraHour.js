const mongoose = require('mongoose');
const schema = mongoose.Schema; 
const ValueHoraExtraSchema = new schema({


    Value_H_E_Daytime: { type: Number, default: 0},// Value_Hour_Extra_Daytime
    Value_H_E_Night: { type: Number,  default: 0},// Value_Hour_Extra_night
    Value_Surcharge_Night: { type: Number,  default:0},//  Value_Surcharge_Night:
    Value_H_Holiday_Daytime: { type: Number,  default: 0  },// Value_Hour_Extra_dayTime
    Value_H_Holiday_Night: { type: Number,  default: 0  },// Value_Hour_Extra_Night
    Value_H_E_Holiday_Daytime: { type: Number,  default: 0  },// Value_Hour_Extra_Holiday_Night
    Value_H_E_Holiday_Night: { type: Number,  default: 0  }, // Value_Hour_Extra_Holiday_Night
    
},{ collection: 'ValueExtrasHours' , timestamps: true});

ValueHoraExtraSchema.methods.toJSON = function () {
    const { __v, deleted, ...BaseSalarys } = this.toObject();
    return BaseSalarys;
}

module.exports = mongoose.model('ValueExtraHour', ValueHoraExtraSchema);