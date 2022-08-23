const  { Schema , model} = require('mongoose');

const Roleschema = new Schema({

    role: { type: String, required: [true, ' the rol is required']}
    
})


module.exports = model('role', Roleschema)