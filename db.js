const { MongoClient, ObjectId } = require("mongodb"); // Import ObjectId along with MongoClient


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


    async filterByDate(startDate, endDate) {
    try {

        const collection = this.db.collection('bookings');

        // the dated need conversion for use in mongoDB:
       // startDate = startDate.toISOString();
       // endDate = endDate.toISOString();


        console.log('start: ' + startDate + ' end:' + endDate);

         // Log the query before executing
        console.log('Filter by date query:', {
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // execute
        return await collection.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).toArray();

        //return result; // redundant but would workits not fine becasue the error I gave you before lte is not defined


    } catch (err) {
        console.error('Error filtering bookings for this week:', err);
        throw err;
    }
}

    // working
    async customQuery(criteria) {
        try {

             // Convert string _id to ObjectId if present in criteria
             // This line converts the _id field in the criteria object from a string to an ObjectId, 
             // which is necessary for MongoDB to perform the query correctly.
             // When querying by _id, MongoDB expects the _id field to be of type ObjectId.
            if (criteria._id) {
            // The _id field in the criteria object is transformed from a string to an ObjectId using new ObjectId(criteria._id).
            criteria._id = new ObjectId(criteria._id); 
            // The line criteria._id = new ObjectId(criteria._id) converts the _id field from a string to an ObjectId instance as expected by Mongo
            // see the first line where ObjectId is imported to mongo
            }

            // console.log ('ID being searched for in the db class is: ' + criteria);
            // this is an object so will report to the console just as Oject : object - it needs to be a string representation as below
            
            console.log('Criteria object:', criteria);
            // console.log('ID being searched for is: ' + JSON.stringify(criteria));

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
