const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const  mongooseDelete = require('mongoose-delete'); 

const schema = mongoose.Schema; 
const DeducdedSchema = new schema({

    health: { type: Number, default: 0},
    Pension: { type: Number, default: 0},
    Solarity_background: { type: Number, default: 0  },
    source_retention: { type: Number,  default: 0},
    Total_Deducded: { type: Number,  default: 0},
     
},{ collection: 'Deducdeds', timestamps: true });

DeducdedSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })
DeducdedSchema.plugin(mongooseDelete, { overrideMethods: 'all' })
DeducdedSchema.methods.toJSON = function () {
    const { __v, deleted, ...BaseSalarys } = this.toObject();
    return BaseSalarys;
}

module.exports = mongoose.model('Deducded', DeducdedSchema);