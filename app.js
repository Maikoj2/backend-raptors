// Requires
require('dotenv').config()

const  {dbConnection}  = require('./config/mongo');
const { Server } = require('./models');
const server = new Server();



//  bd conection
dbConnection()

server.listen() 