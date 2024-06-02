const { MongoClient } = require('mongodb');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const Database = require('./db');  // make sure these match the class names used
const Router = require('./router');

class Server {
    constructor() {
        require('dotenv').config();

        this.app = express();
        this.hostName = process.env.HOST_NAME || 'localhost';
        this.port = process.env.PORT || 3000;

        this.app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
        this.app.use(express.json());
        this.app.set('view engine', 'ejs');

        this.db = new Database();
        this.init();
    }

    async init() {
        try {
            await this.db.connect();
            console.log('Connected to MongoDB...');

            this.router = new Router(this.app, this.db); // Pass the db instance from the Database class
            this.router.route();

            this.app.listen(this.port, () => {
                console.log(`Connected to: ${this.hostName}:${this.port}`);
            });
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            throw err;
        }
    }
}

new Server();
