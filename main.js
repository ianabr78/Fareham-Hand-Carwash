const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const Database = require('./db'); // Adjust path as necessary
const Router = require('./router'); // Assuming you have a router defined

class Server {
    constructor() {
        require('dotenv').config();

        this.app = express();
        this.hostName = process.env.HOST_NAME || 'localhost';
        this.port = process.env.PORT || 3000;

        this.app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
        this.app.use(express.json());
        this.app.set('view engine', 'ejs');

        this.db = new Database(); // Initialize the Database instance
        this.init();
    }

    async init() {
        try {
            // No need to call this.db.connect() here
            console.log('Connected to MongoDB...');

            const router = new Router(this.app, this.db); // Pass the db instance to the Router
            router.route();

            this.app.listen(this.port, () => {
                console.log(`Server listening on ${this.hostName}:${this.port}`);
            });
        } catch (err) {
            console.error('Error initializing server:', err);
            process.exit(1); // Exit with error code 1
        }
    }
}

new Server();