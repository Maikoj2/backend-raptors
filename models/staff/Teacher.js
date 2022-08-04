const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;


const TeacherSchema = new schema(
    {
        _id: {
            type: String,
            ref: 'peoples',
        },
        id_BaseSalary: {
            type: String,
            ref: 'sueldosBase',
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
        _id: false ,
        versionKey: false,

    }
);

TeacherSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })

module.exports = mongoose.model('Teachers', TeacherSchema);