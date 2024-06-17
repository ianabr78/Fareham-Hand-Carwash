const mongoose = require('mongoose');
//const Booking = mongoose.model('./models/Booking', bookingSchema, 'bookings'); //specify to mongoos which collection (didnt need this in node/j)
const Booking = require('./models/Booking');

class Database {
    constructor() {
        mongoose.connect('mongodb+srv://fhamcwash2:zjEqxsEInK6ER200@fareham-hand-carwash.7wrs3jo.mongodb.net/fhcw', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        this.db.once('open', () => {
            console.log('Connected to MongoDB...');
        });
    }

    

    //

    async fetchBookingDetails() {
        try {

            // aggregate only used to set defaults and manuipulate the date fields the line below would be more simple
            //const bookingDetails = await Booking.find({}).exec();

            const count = await Booking.countDocuments().exec();
            console.log("Bookings Count:", count);

            const bookingDetails = await Booking.aggregateBookingDetails();
           

            //console.log("Booking Details:", bookingDetails); // Log fetched details
            //const bookingCount = await Booking.countDocuments().exec();
            //console.log('Number of bookings:', bookingCount); // log a count of the object for debug

            /*
            bookingDetails.forEach(booking => {
                console.log('Date:', booking.date);
                console.log('Time:', booking.time);
            });
            */

            return bookingDetails;
        } catch (err) {
            console.error('Error fetching booking details:', err);
            throw err;
        }
    }


    async addBookingDetails(data) {
        try {
            const newBooking = new Booking(data);
            const result = await newBooking.save();
            console.log('result of addingBookingDetails:', result);
            return result;
        } catch (err) {
            console.error('Error inserting booking details:', err);
            throw err;
        }
    }

    async filterByDate(startDate, endDate) {
        try {


            console.log('filteringByDates: ' + startDate + ' to ' + endDate);

            const filterCriteria = {
                datetime: { $gte: startDate, $lte: endDate }
            };

            // Aggregate booking details within the date range
            const bookingDetails = await Booking.aggregateBookingDetails(filterCriteria);


            /*
            this was working but not returning the dates
            const filteredBookings = await Booking.find()
                .where('datetime').gte(startDate).lte(endDate)
                .exec();
                
            */

            // just a check of how many records returned
            const count = filteredBookings.length;
            console.log('filterByDate bookings found:', count);

            // need to use this somewhere
            //const bookingDetails = await Booking.aggregateBookingDetails();


            //return filteredBookings;

            return bookingDetails;

        } catch (err) {
            console.error('Error filtering bookings by date:', err);
            throw err;
        }
    }

    async customQuery(criteria) {
        try {
            if (criteria._id) {
                criteria._id = mongoose.Types.ObjectId(criteria._id);
            }

            console.log('Criteria object:', criteria);

            const bookingDetails = await Booking.find(criteria).exec();
            return bookingDetails;
        } catch (err) {
            console.error('Error executing custom query:', err);
            throw err;
        }
    }

    async close() {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

module.exports = Database;