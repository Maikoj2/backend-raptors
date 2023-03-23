const mongoose = require('mongoose');



const dbConnection = () => {
    const DB_URI = process.env.DB_URI
    let  nameColletions
    mongoose.connect(DB_URI, { dbName: 'raptorsDatabase',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
    }, (err, res) => {
        if (err) return console.log('****** ERROR CONECTION  ******' , err);
        return  console.log('****** CONECTION SUCCESSFULLY ******')
    });

}
const getNameColletios = () => {
     return mongoose.connection.db.listCollections().toArray();

}


module.exports = { dbConnection , getNameColletios}