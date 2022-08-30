const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 
const estadosValidos = {

    values: ['PAGO', 'NO_PAGO'],
    message: '{VALUE} invalid status'
};

const LoanSchema = new schema({

    idPeople: { type: String, ref: 'peoples' ,required: true},
    description: { type: String, default:' ', required: false },
    valueToPay: { type: Number, required: true },
    Date: { type: Date, required: true },
    status: { type: String, required: true, default: 'NO_PAGO', enum: estadosValidos },
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true  },
   
    
},{timestamps: true, collection: 'loans' });

LoanSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })
LoanSchema.plugin(mongooseDelete, {overrideMethods: 'all'})
LoanSchema.methods.toJSON = function () {
    const { __v, deleted, ...people } = this.toObject();
    return people;
}

module.exports = mongoose.model('loan', LoanSchema);