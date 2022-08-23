const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 


const TeacherSchema = new schema(
    {
        id: {
            type: String,
            ref: 'peoples',
        },
        id_BaseSalary: {
            type: String,
            ref: 'BaseSalary',
            required: true
        },
        profession: {
            type: String,
            required: true
        },
    },
    {
        collection: 'Teachers',
        timestamps: true,
      

    }
);

TeacherSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })
TeacherSchema.plugin(mongooseDelete, {overrideMethods: 'all'})
TeacherSchema.methods.toJSON = function () {
    const { __v, deleted, ...teacher } = this.toObject();
    return teacher;
}

module.exports = mongoose.model('Teachers', TeacherSchema);