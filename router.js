const path = require('path');
const fs = require('fs');
const Mailer = require('./mailer');

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
            res.render('pages/booking');
        });

        this.app.get('/bookings', async (req, res) => {
            try {
                
                const bookingsData = await this.db.fetchBookingDetails();
                const newBookingId = req.query.newBookingId || 'defaultBookingId';
                console.trace('Inside GET /bookings'); // Log trace message
                res.render('pages/bookings', { bookings: bookingsData, newBookingId: newBookingId });
            } catch (error) {
                console.error('Failed to fetch booking details:', error);
                res.status(500).render('pages/bookings', { error: 'Failed to load booking details' });
            }
        });

        this.app.get('/api/customquery', async (req, res) => {
            try {
                const id = req.query.id;
                const results = await this.db.customQuery({ "_id": id });
                res.json(results);
            } catch (error) {
                res.status(500).json({ error: 'Failed to execute custom query' });
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
                console.log('booking data: ' + bookingsData);
                res.render('pages/bookings', { bookings: bookingsData, newBookingId: 'defaultBookingId' });
            } catch (error) {
                console.error('Failed to filter bookings:', error);
                res.status(500).json({ error: 'Failed to filter bookings' });
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