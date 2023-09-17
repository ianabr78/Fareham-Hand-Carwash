/** Name:   Carwash-Site-Server.main.js
 *  Date:   16/09/2023
 *  Author: Jimy Houlbrook
 */

const express = require('express');
const path =  require('path');
const favicon = require('serve-favicon');

const Router = require('./router');

class Server{
    // Initialise server
    constructor(){
        // Get env vars
        require('dotenv').config();

        // Create express application
        this.app = express();
        this.hostName = process.env.HOST_NAME;
        this.port = process.env.PORT;
        
        // Middleware for favicon & Parsing json in POST requests
        this.app.use(favicon(path.join(__dirname, 'favicon.ico')));
        this.app.use(express.json());

        // Set view engine to EJS
        this.app.set('view engine', 'ejs');

        // Initialise router before calling runtime
        this.router = new Router(this.app);
        this.runtime();        
    }

    // Server runtime
    runtime(){
        // Routes for server
        this.router.route();
        this.app.listen(this.port, () => {
            console.log(`Connect too: ${this.hostName}:${this.port}`);
        });
    }
}

new Server()