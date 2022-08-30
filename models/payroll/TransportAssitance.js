const mongoose = require('mongoose');
const schema = mongoose.Schema; 
const TrasportAssisExtraSchema = new schema({


    Assitance_Monthly: { type: Number, default: 0},// Value_Hour_Extra_Daytime
    Assitance_Daily: { type: Number,  default: 0},// Value_Hour_Extra_night
    
},{ collection: 'ValueTrasportAssitances' , timestamps: true});

TrasportAssisExtraSchema.methods.toJSON = function () {
    const { __v, deleted, ...TrasportAssis } = this.toObject();
    return TrasportAssis;
}

module.exports = mongoose.model('ValueTrasportAssis', TrasportAssisExtraSchema);