const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema; 
const  mongooseDelete = require('mongoose-delete'); 
const AccruedSchema = new schema({

    Days_worked: { type: Number, default: 0, require: true},
    basic_accrued: { type: Number, default: 0, require: true},
    id_ExtraHours:    { type: String ,ref: 'ExtraHour', required: true},
    commission: { type: Number, default: 0},
    bonus: { type: Number, default: 0},
    transportation_assistance: { type: Number ,default: 0},
    Total_With_assistance: { type: Number, default: 0},
    Total_Without_assistance: { type: Number, default: 0},
 
   
    
},{ collection: 'Accrueds' , timestamps: true});

AccruedSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })
AccruedSchema.plugin(mongooseDelete, { overrideMethods: 'all' })
AccruedSchema.methods.toJSON = function () {
    const { __v, deleted, ...Accrued } = this.toObject();
    return Accrued;
}

module.exports = mongoose.model('Accrued', AccruedSchema);