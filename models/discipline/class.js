const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 

const ClassSchema = new schema({
    

    Names: { type: String, required: true},
    id_discipline: { type: schema.Types.ObjectId , ref: 'disciplines', required: [true, 'the id_discipline is required'] },
    id_teacher: { type: String , ref: 'Staff', required: true },
    DateStart: { type: Date, required: [true, 'the date start is required'] },
    DateEnd: { type: Date, required: [true, 'the date end is required'] },
    schedule: { type: String, required: [true, 'the schedule is required'] },
    Place: { type: String, required: [true, 'the place is required']},
    HourStart: { type: String, required: [true, 'the hour start is required'] },
    HourEnd: { type: String, required: [true, 'the hour end is required'] },
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true  },
   
    
},{ collection: 'classes', timestamps: true, });

ClassSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' });
ClassSchema.plugin(mongooseDelete, {overrideMethods: 'all'});
ClassSchema.methods.toJSON = function () {
    const { __v, deleted, ...User } = this.toObject();
    return User;
};

module.exports = mongoose.model('classes', ClassSchema);