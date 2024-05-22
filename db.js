const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://fhamcwash:A3aikqyL94qbgyrV@fareham-hand-carwash.7wrs3jo.mongodb.net/?retryWrites=true&w=majority&appName=Fareham-Hand-Carwash";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB...');
        return client.db('fhcw');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

module.exports = connectDB;