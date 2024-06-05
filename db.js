const { MongoClient } = require("mongodb");

class Database {
    constructor() {
        this.uri = "mongodb+srv://fhamcwash2:zjEqxsEInK6ER200@fareham-hand-carwash.7wrs3jo.mongodb.net/?retryWrites=true&w=majority&appName=Fareham-Hand-Carwash";
        this.client = new MongoClient(this.uri, {
            tlsAllowInvalidCertificates: true // For testing purposes only
        });
        
        this.db = null;
    }

    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db('fhcw'); //fhcw is the datsabase name, not the username (as defined in .env)
            console.log('Connected to MongoDB...');
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            throw err;
        }
    }

    async fetchBookingDetails() {
        try {
            // 'bookings' is the actual collection name
            const collection = this.db.collection('bookings');
            return await collection.find({}).toArray(); // Modify to match specific criteria if necessary
        } catch (err) {
            console.error('Error fetching booking details:', err);
            throw err;
        }
    }

    async addBookingDetails(data) {
        try {
            const collection = this.db.collection('bookings');
            const result = await collection.insertOne(data);
            // if we dont use await collection.insertOne(data) then whole object can be returned
            return result; // Return the result of insertOne
           
        } catch (err) {
            console.error('Error inserting booking details:', err);
            throw err;
        }
    }

    async customQuery(criteria) {
        try {
            const collection = this.db.collection('bookings');
            return await collection.find(criteria).toArray();
        } catch (err) {
            console.error('Error executing custom query:', err);
            throw err;
        }
    }

    async close() {
        await this.client.close();
    }

    
}

module.exports = Database;
