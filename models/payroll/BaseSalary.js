const mongoose = require('mongoose');
const  mongooseDelete = require('mongoose-delete'); 
const schema = mongoose.Schema;
const BaseSalarySchema = new schema({

    position: { type: String, required: [true, 'the position is required'] },
    BaseSalary: { type: Number, required: [true, 'the base salary is required'] },
    valuePerHour: { type: Number, required: [true, ' the value per hour is required'] },
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true }

}, {
    collection: 'BaseSalarys', timestamps: true,
}

);
BaseSalarySchema.plugin(mongooseDelete, { overrideMethods: 'all' })
BaseSalarySchema.methods.toJSON = function () {
    const { __v, deleted, ...BaseSalarys } = this.toObject();
    return BaseSalarys;
}

module.exports = mongoose.model('BaseSalary', BaseSalarySchema);