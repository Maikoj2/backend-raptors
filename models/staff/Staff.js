const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 


const StaffSchema = new schema(
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
        TypeSalary: {
            type: String,
            required: true
        },
    },
    {
        collection: 'Staff', //TODO::  changes to staff
        timestamps: true,
      

    }
);

StaffSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })
StaffSchema.plugin(mongooseDelete, {overrideMethods: 'all'})
StaffSchema.methods.toJSON = function () {
    const { __v, deleted, ...teacher } = this.toObject();
    return teacher;
}

module.exports = mongoose.model('Staff', StaffSchema);