/** Name:   Carwash-Site-Server.router.js
 *  Desc:   Configures all routes for the server
 *  Author: Jimy Houlbrook
 *  Date:   26/09/2023
 */

const path = require('path');
const fs = require('fs');
const Mailer = require('./mailer');

class Router{
    /** Create router
     * 
     * @param app The express application
     */
    constructor(app){
        this.app = app;
        this.route;
        this.mailer = new Mailer()
    }

    // Routes, including Get and Post
    route(){
        this.app.get('/', (req, res) => {
            res.render('pages/home');
        });

        this.app.get('/home', (req, res) => {
            res.render('pages/home');
        });

        this.app.get('/booking', (req, res) => {
            res.render('pages/booking');
        });

        this.sendDir('./static/');
        this.sendDir('./static/images');

        this.app.post('/submitBooking', (req, res) => {
            const data = req.body
            const mail = {
                subject: `Booking ${data.time}, ${data.data}`,
                text: `Booking at ${data.time}, ${data.data} for ${data.name}, ${data.car}, ${data.size}`,
                html: `<p>Booking at ${data.time}, ${data.data} for ${data.name}, ${data.car}, ${data.size}</p>`
            }
            this.mailer.sendMail(mail);
        })

        // Return a 404 response page if page not found
        this.app.get('*', (req, res) => {
            res.render('pages/notfound');
        });
    }

    /** Send all files in directory
     *  this function does NOT read sub-directories 
     * 
     * @param {String} dir Directory 
     */
    sendDir = (dir) => {
        if(!dir)
            return;

        const files = fs.readdirSync(dir);

        for(const file of files){
            this.app.get(`/static/${file}`, (req, res) => {
                res.sendFile(path.join(__dirname, `./${dir}/${file}`));
            });
        }
    }
}

module.exports = Router;