/** Name:   Carwash-Site-Server.router.js
 *  Desc:   Configures all routes for the server
 *  Author: Jimy Houlbrook
 *  Date:   26/09/2023
 */

const path = require('path');
const fs = require('fs');

class Router{
    /** Create router
     * 
     * @param app The express application
     */
    constructor(app){
        this.app = app;
        this.route;
    }

    // Routes, including Get and Post
    route(){
        this.app.get('/', (req, res) => {
            res.render('pages/home');
        });

        this.sendDir('./static/')
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