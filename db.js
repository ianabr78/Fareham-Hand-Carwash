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
        // fetches all bookings for /bookings route

        try {
            // 'bookings' is the actual collection name
            const collection = this.db.collection('bookings');
           
            //The collection object represents a MongoDB collection, and it provides methods for performing basic CRUD (Create, Read, Update, Delete) operations on documents in that collection. However, if you need to perform more complex data transformations or aggregations, such as reshaping documents, grouping, sorting, or computing new fields based on existing ones, you'll need to use the aggregation framework, which is done through the aggregate() method. 
            // This allows you to create a pipeline of stages to process your data in MongoDB

            const bookingDetails = await collection.aggregate([
                {
                    $project: {
                        //  $project is an aggregation pipeline stage used to reshape documents. It allows you to specify which fields to include or exclude from the output documents, rename fields,
                        //
                        // The fetchBookingDetails function now exclusively uses the aggregation framework to reshape the document and retrieve the required fields, including the date and time.

                        // need to build the object here, any fields needed should be listed below:

                        _id: true,
                        name: true,
                        number: true,
                        car: true,
                        size: true,
                        datetime: true, // Keep datetime for filtering
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$datetime" } }, //datetime is the field name
                        time: { $dateToString: { format: "%H:%M", date: "$datetime" } }
                    }
                }
            ]).toArray();

            // just for checking booking dates and times have been correctly stored
            console.log("Booking Details:");
            bookingDetails.forEach(booking => {
                console.log('Date:', booking.date);
                console.log('Time:', booking.time);
            });

            // the line below was used before the bookingDetails = await collection.aggregate was added
            //return await collection.find({}).toArray(); // Modify to match specific criteria if necessary
            return bookingDetails; // Return the modified booking details


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
        //You need to pass a date object and not a date string.
       // collection.findOne({ last_updated: new Date('2014-01-22T14:56:59.301Z') }, function (err, doc) {


        console.log('start: ' + startDate + ' end:' + endDate);

         // Log the query before executing
        console.log('Filter by date query:', {
            datetime: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // execute
        return await collection.find({
            date: { /// need to woerk with datetime
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
