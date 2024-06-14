const mongoose = require('mongoose');

// Define the schema for bookings
const bookingSchema = new mongoose.Schema({
    name: String,
    number: String,
    car: String,
    size: String,
    datetime: Date
}, { collection: 'bookings' }); // Specify the collection name here


// a static method for aggregation of the fields needed by a booking
// this static metho can then be used by other methods

bookingSchema.statics.aggregateBookingDetails = async function () {
    try {
        const bookingDetails = await this.aggregate([
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

// Create a model based on the schema
const Booking = mongoose.model('Booking', bookingSchema);

// Export the model
module.exports = Booking;