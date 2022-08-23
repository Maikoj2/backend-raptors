const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema; 
const  mongooseDelete = require('mongoose-delete'); 
const AttendanceSchema = new schema({

    id: { type: String, required: true},
    id_SignUpclass: { type: String, required: true, ref:'signUps' },
    Date: { type: Date, required: true  },
    Attendance: { type: Boolean, required: true },
    pay: { type: Boolean, required: true },
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true  },
   
    
},{ timestamps: true, collection: 'Attendances' });

AttendanceSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })
AttendanceSchema.plugin(mongooseDelete, {overrideMethods: 'all'})

module.exports = mongoose.model('Attendances', AttendanceSchema);