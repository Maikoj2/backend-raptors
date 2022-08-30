const  { Schema , model} = require('mongoose');

const payModechema = new Schema({

    payMode: { type: String, required: [true, ' the payMode is required']}
    
})


module.exports = model('payMode', payModechema)