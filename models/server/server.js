// Requires
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT || 3000;
        /** midellware */
        this.midellware();
        /** routes */
        this.routes();


    };
    midellware() {
        this.app.use(express.static('public'));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cors())
    }

    routes() {
        /** dinamic rutes */
        this.app.use('/', require('../../Routes'));
    }

    listen() {
        /** server: http://localhost:*/
        this.app.listen(this.port, () => {
            console.log(`Express  server port ${this.port}: ONLINE`);
        });
    }


}

module.exports = Server;