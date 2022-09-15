// Requires
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const Path = require('../../pathResolveRout');
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
        console.log(__dirname)
        this.app.use('/', require(Path.routes));
    }

    listen() {
        /** server: http://localhost:*/
        this.app.listen(this.port, () => {
            console.log(`Express  server port ${this.port}: ONLINE`);
        });
    }


}

module.exports = Server;