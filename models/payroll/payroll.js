const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const  mongooseDelete = require('mongoose-delete'); 

const schema = mongoose.Schema; 
const PayrollSchema = new schema({

    id_staff:    { type: String ,ref: 'Staff', required: true},
    id_Deducted:    { type: String ,ref: 'Deducded', required: true},
    id_accrued:    { type: String ,ref: 'Accrued', required: true},
    Date: { type: Date, requeride: true},
    Net_total: { type: Number,  default: 0},
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true  },

    
},{ collection: 'Payrolls' , timestamps: true});

PayrollSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })
PayrollSchema.plugin(mongooseDelete, { overrideMethods: 'all' })
PayrollSchema.methods.toJSON = function () {
    const { __v, deleted, ...Payrolls } = this.toObject();
    return Payrolls;
}

module.exports = mongoose.model('Payroll', PayrollSchema);