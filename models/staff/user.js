const  mongoose = require('mongoose');
const  schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 


const  userSchema = new schema(
    {
       
        Names:  {  type: String, required: [true, 'the name is necessary'] },
        email:  { type: String, unique: true, required: [true, 'the email is necessary']  },
        password:  {  type: String,  required: [true, 'the passsword  is necessary'] },
        img: { type: String, required: false },
        role:  { type: String,  required: true }
    }, 
    {
        timestamps: true,
        collection: 'Users' 
    }
);

userSchema.plugin(mongooseDelete, {overrideMethods: 'all'});
userSchema.methods.toJSON = function () {
    const { __v, password, deleted, ...User } = this.toObject();
    return User;
}

module.exports = mongoose.model('Users', userSchema);