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


            console.log('filtered criteria passed by filterByDate: ' + filterCriteria);

            // Aggregate booking details within the date range
            const bookingDetails = await Booking.aggregateBookingDetails(filterCriteria);


            
            // this was working but not returning the dates
            /* const filteredBookings = await Booking.find()
                .where('datetime').gte(startDate).lte(endDate)
                .exec();
            */    
            

            // just a check of how many records returned
            //const count = filteredBookings.length;
            //console.log('filterByDate bookings found:', count);

            // need to use this somewhere



            //return filteredBookings;

            return bookingDetails;

        } catch (err) {
            console.error('Error filtering bookings by date:', err);
            throw err;
        }
    }

    async filterByBookingID(findCriteria) {

        try {
            console.log('filtering by BookingID:', findCriteria);

            //const filterCriteria = { _id: mongoose.Types.ObjectId(id) };
            // this not needed as set up as id object in the router

            const bookingDetails = await Booking.aggregateBookingDetails(findCriteria);

            return bookingDetails;
        } catch (err) {
            console.error('Error filtering booking by ID:', err);
            throw err;
        }
    }



    

    async close() {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

module.exports = Database;