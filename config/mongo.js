const mongoose = require('mongoose');



const dbConnection = () => {
    const DB_URI = process.env.DB_URI
    
    mongoose.connect(DB_URI, { dbName: 'raptorsDatabase',
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err, res) => {

        if (!err) {
            console.log('****** CONECTION SUCCESSFULLY ******')
        } else {
            console.log('****** ERROR CONECTION  ******' , err);

        }
    });

}

module.exports = dbConnection