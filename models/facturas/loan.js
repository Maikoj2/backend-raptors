const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 
const estadosValidos = {

    values: ['PAGO', 'NO_PAGO'],
    message: '{VALUE} no es un rol valido'
};

const LoanSchema = new schema({
    id: {
        type: String,
    },
    id_SignUpclass: { type: String, ref: 'signUps' ,required: true},
    description: { type: String, default:' ', required: false },
    valueToPay: { type: Number, required: true },
    Date: { type: Date, required: true },
    status: { type: String, required: true, default: 'NO_PAGO', enum: estadosValidos },
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true  },
   
    
},{timestamps: true, collection: 'loans' });

LoanSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })
LoanSchema.plugin(mongooseDelete, {overrideMethods: 'all'})

module.exports = mongoose.model('loans', LoanSchema);