const path = require('path');
const fs = require('fs');
const ObjectId = require('mongodb').ObjectId;
const Mailer = require('./mailer');
const mongoose = require('mongoose');

class Router {
    constructor(app, db) {
        this.app = app;
        this.db = db;
        this.mailer = new Mailer();
    }

    route() {
        // GET requests
        this.app.get('/', (req, res) => {
            res.render('pages/home');
        });

        this.app.get('/home', (req, res) => {
            res.render('pages/home');
        });

        this.app.get('/booking', (req, res) => {



            // allowing polulated OR blank
              const booking = {
                    id: req.query.id || '',
                    name: req.query.name || '',
                    date: req.query.date || '',
                    time: req.query.time || '',
                    car: req.query.car || ''
                };
                res.render('pages/booking', { booking });
            
        });


        this.app.post('/updateBooking', async (req, res) => {
            try {
                const { id, name, date, time, car } = req.body;
        
                // Ensure id is a valid ObjectId before attempting update
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ success: false, message: 'Invalid booking ID' });
                }
        
                // MongoDB ObjectId instantiation
                const ObjectId = mongoose.Types.ObjectId;

                 // Define filter criteria and updated data
                const filterCriteria = { _id: new ObjectId(String(id)) }; // Adjust as per your data structure

                console.log("router.js updateBooking for: " + name);
                const updatedData = { name, date, time, car }; // Adjust fields as needed

        
                // Call the static method to update booking details
                // Update operation
                const result = await Booking.updateBookingDetails(filterCriteria, updatedData);
        
                res.json({ success: true });
                
        
            } catch (error) {
                console.error('Error updating booking:', error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });



        this.app.get('/bookings', async (req, res) => {
            try {
                const filterCriteria = {}; 
                console.log('Bookings route');
                console.log('filtered criteria passed by bookings route');

                const startDate = new Date();
                const endDate = new Date(startDate);
                startDate.setDate(startDate.getDate() - 999);
                endDate.setDate(endDate.getDate() + 999);


                const bookingsData = await this.db.filterByDate(startDate, endDate);
                const newBookingId = req.query.newBookingId || 'defaultBookingId';
                console.trace('Inside GET bookings'); // Log trace message
                res.render('pages/bookings', { bookings: bookingsData, newBookingId: newBookingId });
            } catch (error) {
                console.error('Failed to fetch booking details:', error);
                res.status(500).render('pages/bookings', { error: 'Failed to load booking details' });
            }
        });


        //for finding specific ID
        this.app.get('/api/findByID', async (req, res) => {
            try {

                
                const id = req.query.id;
                console.log('router.js /api/findByID id is: ' + id);
           

                //const filterID = { _id: new ObjectId(id) };
                //updated below to resolve an error with depracattion in use of ObjectID in the above
                

                const ObjectId = mongoose.Types.ObjectId;
                const filterID = { _id: new ObjectId(String(id)) };

                const bookingsData = await this.db.filterByBookingID(filterID);

                if (bookingsData.length === 0) {

                    console.log('router.js no bookingsData');
                    return res.status(404).json({ error: 'No booking found' });
                    

                } else {

                    /////// filterByBookingID() 
                    
                    console.log('router.js returning booking data:', bookingsData[0]);
                    
                    // this returnd to js
                    res.json({ booking: bookingsData, newBookingId: 'defaultBookingId' });
                    

                    // this would work if not called from cleint side:
                    // res.render('pages/booking', { booking: bookingsData[0], newBookingId: 'defaultBookingId' });


                    ////res.json(results);
                    //res.render('pages/booking');
                    // res . renter not needed as utils.js is expecting a JSON reponse
                    
                }
             

            } catch (error) {
                res.status(500).json({ error: 'Failed to execute findByID' });
                console.error('Error in findByID route:', error);
            }
        });

        


        this.app.get('/api/filterBookings', async (req, res) => {
            const filter = req.query.filter;
            const startDate = new Date();
            const endDate = new Date(startDate);

            if (filter === "all") {
                endDate.setDate(endDate.getDate() + 360);
            } else if (filter === "month") {
                    endDate.setDate(endDate.getDate() + 30);
            } else if (filter === "week") {
                endDate.setDate(endDate.getDate() + 7);
            } else if (filter === "today") {
                endDate.setDate(endDate.getDate() + 1);
            }

            try {
                const bookingsData = await this.db.filterByDate(startDate, endDate);
                console.log('booking data returned ');
                res.render('pages/bookings', { bookings: bookingsData, newBookingId: 'defaultBookingId' });
            } catch (error) {
                console.error('Failed to filter bookings:', error);
                res.status(500).json({ error: 'Failed to filter bookings' });
            }
        });


        // UPDATE

        this.app.get('/api/updateBooking', async (req, res) => {
            try {
                const { id, name, date, time, car } = req.query;
        
                // Ensure id is a valid ObjectId before attempting update
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ success: false, message: 'Invalid booking ID' });
                }
                
        
                // MongoDB ObjectId instantiation
                const ObjectId = mongoose.Types.ObjectId;
        
                // Define filter criteria and updated data
                const filterCriteria = { _id: new ObjectId(String(id)) };
                const updatedData = { name, date, time, car }; // Adjust fields as needed
        
                // Call the db class - also better for security
                const result = await db.updateBooking(id, updatedData);
        
                if (result.ok === 1) {
                    res.json({ success: true });
                } else {
                    res.status(500).json({ success: false, message: 'Failed to update booking' });
                }
        
            } catch (error) {
                console.error('Error updating booking:', error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });



        // POST requests
        this.app.post('/submitBooking', async (req, res) => {
            const data = req.body;
            data.datetime = new Date(data.datetime);

            try {
                const result = await this.db.addBookingDetails(data);
                if (result && result._id) {
                    res.json({ success: true, _id: result._id }); // Send the _id of the saved document
                    console.log('insertedId used in Router.js: ', result._id); // Log the _id for verification
                } else {
                    res.status(500).json({ success: false, message: 'Failed to add booking' });
                }
            } catch (error) {
                console.error('Error adding booking to MongoDB:', error);
                res.status(500).json({ success: false, message: 'Failed to add booking' });
            }
        });

        // Serve static files
        this.sendDir('./static/');
        this.sendDir('./static/images');

        // Handle undefined routes
        this.app.get('*', (req, res) => {
            res.render('pages/notfound');
        });
    }

    

    sendDir(dir) {
        if (!dir) return;

        const files = fs.readdirSync(dir);

        for (const file of files) {
            this.app.get(`/static/${file}`, (req, res) => {
                res.sendFile(path.join(__dirname, dir, file));
            });
        }
    }
}

module.exports = Router;