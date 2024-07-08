const mongoose = require('mongoose');

// Define the schema for bookings
const bookingSchema = new mongoose.Schema({
    name: String,
    number: String,
    car: String,
    size: String,
    datetime: Date,
}, { collection: 'bookings' }); // Specify the collection name here


// a static method for aggregation of the fields needed by a booking
// this static metho can then be used by other methods

bookingSchema.statics.aggregateBookingDetails = async function (filterCriteria) {
    
    console.table(filterCriteria);
    try {

        // Check if criteria is a date range or an ID
        // this allows one aggregate function to be used rather that more lines of code

        console.log('Bookings.js filterCriteria._id: ' + filterCriteria._id);

        let matchStage = { $match: {} };// Initialize match stage


        // different filters require different match conditions
        if (filterCriteria._id) {
            // dont forget the new (below)
            

            // below was previously working
            //matchStage = { $match: { _id: new mongoose.Types.ObjectId(filterCriteria._id) } };

            //updated below to resolve an error with depracattion in use of ObjectID in the above
            const ObjectId = mongoose.Types.ObjectId;
            matchStage = { $match: { _id: new ObjectId(String(filterCriteria._id)) } };


            console.log('Bookings.js filterCriteria set for id: ' + filterCriteria._id);

        } else if (filterCriteria.datetime) {
            matchStage = { $match: filterCriteria };
            console.log('Bookings.js filterCriteria set for dates (not id)');
        }


        const bookingDetails = await this.aggregate([
            
            matchStage, // contains the match criteria as specified above

            {
                $project: {
                    _id: true,
                    name: { $ifNull: ["$name", "Unknown"] },
                    number: { $ifNull: ["$number", ""] },
                    car: { $ifNull: ["$car", "Unknown"] },
                    size: { $ifNull: ["$size", ""] },
                    datetime: { $ifNull: ["$datetime", new Date()] },
                    date: { $dateToString: { format: "%Y-%m-%d", date: { $ifNull: ["$datetime", new Date()] } } },
                    time: { $dateToString: { format: "%H:%M", date: { $ifNull: ["$datetime", new Date()] } } }
                }
            }
        ]).exec();

        console.log('Bookings.js returning bookingDetails for: ' + bookingDetails[0].name);
        return bookingDetails;
    } catch (err) {
        console.error('Bookings.js Error aggregating booking details:', err);
        throw err;
    }




};

bookingSchema.statics.updateBookingDetails = async function (filterCriteria, updatedData) {
    try {
        const result = await this.updateOne(filterCriteria, updatedData);
        return result;
    } catch (err) {
        console.error('Error updating booking details:', err);
        throw err;
    }
};

// Create a model based on the schema
const Booking = mongoose.model('Booking', bookingSchema);

// Export the model
module.exports = Booking;