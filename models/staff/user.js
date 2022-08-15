const  mongoose = require('mongoose');
const  uniquevallidator = require('mongoose-unique-validator');
const  schema = mongoose.Schema;

const  rolesValidos = {

    values: ['ADMIN_ROLE', 'USER_ROLE', 'TEACHER_ROLE'],
    message: '{VALUE} not a valid role'
}

const  userSchema = new schema(
    {
        id: {
            type: String,
        },

        Name: 
        { 
            type: String, 
            required: [true, 'the name is necessary'] 
        },
        email: 
        { 
            type: String, 
            unique: true, 
            required: [true, 'the email is necessary'] 
        },
        password: 
        { 
            type: String, 
            required: [true, 'the passsword  is necessary'] 
        },
        img: 
        { 
            type: String, 
            required: false 
        },
        role: 
        { 
            type: String, 
            required: true, 
            default: 'USER_ROLE', 
            enum: rolesValidos 
        },
        // google: { type: Boolean, default: false }
    }, 
    {
        timestamps: true,
        collection: 'Users' 
    }
);

userSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })

module.exports = mongoose.model('Users', userSchema);