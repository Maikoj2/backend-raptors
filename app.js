// Requires
require('dotenv').config()
require('module-alias/register')
const  {dbConnection}  = require('./config/mongo');
const { Server } = require('@models');
const server = new Server();



//  bd conection
dbConnection()

server.listen() 