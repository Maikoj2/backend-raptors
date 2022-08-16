const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 

const MonthlypaySchema = new schema({
    id: { type: String, required: true},
    id_SignUpclass: { type: String, required: true, ref:'signUps' },
    Price:    { type: Number ,   required: true},
    DateStart: { type: Date, required: true },
    DateEnd: { type: Date, required: true },
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true  },
   
    
},{ timestamps: true, collection: 'Monthlypays'  });

MonthlypaySchema.plugin(uniquevallidator, { message: '{PATH} must be a unique' })
MonthlypaySchema.plugin(mongooseDelete, {overrideMethods: 'all'})

module.exports = mongoose.model('Monthlypays', MonthlypaySchema);