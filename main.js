const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const Router = require('./router');

const { MongoClient } = require('mongodb');


class Server {
    // initialise the server
    constructor() {

        //get local vars
        require('dotenv').config();

        this.app = express();
        this.hostName = process.env.HOST_NAME;
        this.port = process.env.PORT;

        this.app.use(favicon(path.join(__dirname, '/static/favicon.ico')));
        this.app.use(express.json());

        // Set view engine to EJS
        this.app.set('view engine', 'ejs');

        this.uri = process.env.MONGODB_URI;
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });

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

    async init() {
        try { this.client.connect();
            console.log('Connected to MongoDB...');
            this.db = this.client.db('fhcw');

            this.router = new Router(this.app, this.db);
            this.route
            await.route();

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