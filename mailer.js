/** Name:   Carwash-Site-Server.mailer.js
 *  Desc:   Class containing code for mailing bookings to relevent person(s)
 *  Author: Jimy Houlbrook
 *  Date:   17/09/2023
 */

// In theory all this code should work but i do not currentlyhave an email that will work with nodemailer

const nodemailer = require('nodemailer');

class Mailer{
    // Class to send emails
    constructor(){
        require('dotenv').config();

        // create reusable transporter object using the default SMTP transport
        this.transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
            secure: true,
        });

        // Sender and reviever will stay the same so reusable object works again
        this.mailData = {
            from: process.env.EMAIL,
            to: process.env.RECIEVER,   
        };
    }

    /** Send email to recipient
     * 
     * @param {Object} mail Contains the subject, plaintext & html of email, which is set from the POST
     */
    sendMail(mail){
        this.mailData.subject = mail.subject
        this.mailData.text = mail.text
        this.mailData.html = mail.html

        this.transporter.sendMail(this.mailData, (err, info) => {
            if(err){
                console.error(err);
                return;
            }
            console.log(info);
        })
    }
}

module.exports = Mailer;