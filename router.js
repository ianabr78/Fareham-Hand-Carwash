const path = require('path');
const fs = require('fs');
const Mailer = require('./mailer');

// make sure all 'server side' JS code goes into this file and not into the .ejs which is client side

class Router {
    // Router for the express application
    constructor(app, db) { // Added db parameter
        this.app = app;
        this.db = db;
        this.mailer = new Mailer();
    }

    
    // Routes, including Get and Post
    // Make sure you add any new pages here!
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


        // imported fucntions accross different pages:
        

        this.app.get('/bookings', async (req, res) => {
            try {
                // Fetch booking details
                const bookingsData = await this.db.fetchBookingDetails(); // 
        
                // Pass the fetched booking details and new booking ID to the page
                //  req.query is a method for querying the url
                const newBookingId = req.query.newBookingId || 'defaultBookingId'; // Get the new booking ID from query params, set default if not present

                // Use the imported functions to process your data if needed
                // cant use these client side functions here!
               //const processedBookings = displayBooking(bookingsData);
               //const searchedBooking = searchBooking(bookingsData, req.query.searchValue);
                

                res.render('pages/bookings', { bookings: bookingsData, newBookingId: newBookingId });
               
            } catch (error) {
                console.error('Failed to fetch booking details:', error);
                // Handle errors - e.g., render an error page or pass an error message
                res.status(500).render('pages/bookings', { error: 'Failed to load booking details' });
            }
        
        });
        


        // for the find on the bookings.js page
        this.app.get('/api/customquery', async (req, res) => {
            // so here req and res are the html client side request and the server (db.js) reposne
            // these just have to match the objects created below, the names could change
            ///api/customquery is just a convention used (see utils.js call to this route)

            try {
                
                //const results = await db.customQuery(req.query.criteria || {});
                // the line above does not work becasue db is not within the scope of this function its set up in its own class and can only be referred to that way there

                const id = req.query.id; // Extract the id query parameter from the request object
                console.log('id being searched for is:' + id);

                //const results = await this.db.customQuery( { "_id": ObjectId(id) } ); // where _id matches the id from the bookings mongo collection
                const results = await this.db.customQuery({ "_id": id }); // id is a string at this point

                res.json(results);
            } catch (error) {
                res.status(500).json({ error: 'Failed to execute custom query' });
            }
        }); // end

        
        // ALL DATE FILTERS

        this.app.get('/api/filterBookings', async (req, res) => {

            const filter = req.query.filter; // Extract the id query parameter from the request object where query is a method qurying the URL

            // setup the dates
            const startDate = new Date();
            const endDate = new Date(startDate);


            endDate.setDate(startDate.getDate() + 1); // default

            // setup start and end dates:
            if (filter === "month") {
                endDate.setDate(startDate.getDate() + 30);
                console.log("filtering weekly..."); 
                } // end this week bookings
            
            if (filter === "week") {
                endDate.setDate(startDate.getDate() + 7);
                console.log("filtering weekly..."); 
                } // end this week bookings

            if (filter === "today") {
                console.log("filtering today..."); 
                endDate.setDate(startDate.getDate() + 1);
                } // end todays bookings
              
            // call the DB method and render:

            try {            
            const bookingsData = await this.db.filterByDate({ "startDate": startDate, "endDate" : endDate }); //               
            res.render('pages/bookings', { bookings: bookingsData });
            }       
            
            catch (error) { res.status(500).json({ error: 'Failed to filter todays bookings' }); }

        }); //end route

        //

        this.sendDir('./static/');
        this.sendDir('./static/images');

        // POST requests from booking page

        this.app.post('/submitBooking', async (req, res) => {

            const data = req.body; // data posted in JSON format by booking page

            try {
                // try and code block if theres and error this is returned bt 'catch'

                // post to database
                //await this.db.addBookingDetails(data); // depracated
                // By awaiting this operation and capturing the 'result', you can then use that information as needed.
                
                const result = await this.db.addBookingDetails(data);

                //let bookingId; // Declare bookingId variable for use accross the if block

                //get the last booking ID added
                if (result) {
                    //const bookingId = result.insertedId; // Get the ID of the inserted booking
                    // The insertedId property is the result object returned by insertOne 
                    // Proceed with further operations using bookingId
                    //console.log("bookingId:"+bookingId);

                    res.json({ success: true, _id: result.insertedId }); 
                     console.log('Booking added successfully');
                    
                } else {
                    // Handle the case where result is undefined or null
                    res.status(500).json({ success: false, message: 'Failed to add booking' });
                }
                


                
                //This assigns the value of the bookingId variable to the _id key in the JSON object. 
                //JSON response indicating the success of the booking operation along with the ID of the newly inserted booking
                // not needed as we are redirecting anyway
                //res.json({ success: true, _id: bookingId }); 
                
               // res.redirect('/bookings');
                //console.log('Booking added successfully');

                //alert("Booking added successfully!"); // dont use alerts client side
                //res.redirect('/bookings'); re direct removed now done in booking page
                //res.render('pages/bookings', { bookings: bookingsData });
                //return; // Ensure no further code execution


            } catch (error) {

                console.error('Error adding booking to MongoDB:', error);
                //alert("Booking not added!");
                res.status(500).json({ success: false, message: 'Failed to add booking' });
            }

            /*
            // also email confirmation
            try {
            const mail = {
                subject: `Booking ${data.time}, ${data.date}`,
                text: `Booking at ${data.time}, ${data.date} for ${data.name}, ${data.car}, ${data.size}`,
                html: `<p>Booking at ${data.time}, ${data.date} for ${data.name}, ${data.car}, ${data.size}</p>`
                
            };
            this.mailer.sendMail(mail);

             } catch (error) {
                console.error('Error sending email', error);
                res.status(500).json({ success: false, message: 'Failed to send confirmation' });
            }

            //console.log(mail);
            */


        });

        // Show a page if url not found
        this.app.get('*', (req, res) => {
            res.render('pages/notfound');
        });
    }

    /** Send all files in directory
     *  this function does NOT read sub-directories 
     * 
     * @param {String} dir Directory 
     */
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
