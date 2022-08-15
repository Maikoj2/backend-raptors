const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 


const validRole = {

    values: ['USER_ROLE', 'TEACHER_ROLE'],
    message: '{VALUE} the rol is no valid'
}

const PeopleSchema = new schema({
    id: {
        type: String,
        required: true,
        unique: [true, 'the id is requered']
    },
    IdType: {
        type: String,
        required: [true, 'the type of id is requered']
    },
    Names: {
        type: String,
        required: [true, 'the names are requerided']
    },
    SureNames: {
        type: String,
        required: [true, 'the sure name is requrided ']
    },
    Gender: {
        type: String,
        required: [true, 'the Gender is requerided ']
    },
    neighborhood: {
        type: String,
        required: [false]
    },
    Address: {
        type: String,
        required: [true, 'the address is requerided']
    },
    Phone: {
        type: String,
        required: [true, 'the Phone is requerided']
    },
    occupation: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: [true, 'the Email is requeride']
    },
    EPS: {
        type: String,
        required: false
    },
    img: { 
        type: String, 
        required: false , 
        default: ' '
    },
    DateofBirth:  { 
        type: Date, 
        required: [true, 'the DateofBirth is requeride'] 
    },
    DepartamentBirth: { 
        type: String, 
        required: [true, 'the DepartamentBirth is requeride'] 
    },
    MunicipeBirth: { 
        type: String, 
        required: [true, 'the MunicipeBirth is requeride'] 
    },
    user: {
        type: schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: validRole
    }
},
{
    collection: 'peoples',
    timestamps: true,
   
    });
PeopleSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' });
PeopleSchema.plugin(mongooseDelete, {overrideMethods: 'all'});

module.exports = mongoose.model('peoples', PeopleSchema);