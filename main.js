/** Name:   Carwash-Site-Server.main.js
 *  Date:   16/09/2023
 *  Author: Jimy Houlbrook
 */

const express = require('express');
const path =  require('path');

const Router = require('./router');

class Server{
    // Initialise server
    constructor(){
        // Get env vars
        require('dotenv').config();

        this.app = express();
        this.hostName = process.env.HOST_NAME;
        this.port = process.env.PORT;
        
        this.app.use(express.json());

        // Set view engine to EJS
        this.app.set('view engine', 'ejs');

        this.router = new Router(this.app);
        this.runtime();        
    }

    // Server runtime
    runtime(){
        this.router.route();

        this.app.listen(this.port, () => {
            console.log(`Connect too: ${this.hostName}:${this.port}`);
        });
    }
}

new Server()