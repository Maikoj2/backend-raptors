// Requires
const  express = require('express');
const  bodyParser = require('body-parser')
const  cors = require('cors');
const  dbConnection  = require('./config/mongo');
    



const  app = express();
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use( cors() )


//  bd conection
dbConnection()


/**
 * dinamic rutes
 */
app.use('/', require('./Routes'));


/** server: http://localhost:*/
app.listen(3000, () => {
    console.log('Express  server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});
