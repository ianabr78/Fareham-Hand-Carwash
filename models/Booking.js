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

        console.log('filterCriteria._id: ' + filterCriteria._id);

        let matchStage = { $match: {} };// Initialize match stage


        // different filters require different match conditions
        if (filterCriteria._id) {
            // dont forget the new (below)
            matchStage = { $match: { _id: new mongoose.Types.ObjectId(filterCriteria._id) } };
            console.log('filterCriteria are set for id: ' + filterCriteria.id);

        } else if (filterCriteria.datetime) {
            matchStage = { $match: filterCriteria };
            console.log('filterCriteria are set for dates');
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

        return bookingDetails;
    } catch (err) {
        console.error('Error aggregating booking details:', err);
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