const  mongoose = require('mongoose');
const  uniquevallidator = require('mongoose-unique-validator');
const  schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 
const  DiscipineSchema = new schema({

    Names: { type: String, required: [true, 'el nombre es necesario'] },
    valuePerHour: { type: Number, required: true},
    valuePerMonth: { type: Number, required: true},
},
{ 
    timestamps: true,
    collection: 'disciplines',
});

DiscipineSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' });
DiscipineSchema.plugin(mongooseDelete, {overrideMethods: 'all'});
DiscipineSchema.methods.toJSON = function () {
    const { __v, deleted, ...User } = this.toObject();
    return User;
}


module.exports = mongoose.models.disciplines ||mongoose.model('disciplines', DiscipineSchema);