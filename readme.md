# Fareham Hand Carwash Website
## Installation
Use Node Package Manager (npm) to install the required packages

```bash
npm install
```

It is also important to ensure you configure a 'dotenv' file for testing. Create a file called `.env` & configure the following
```
HOST_NAME=127.0.0.1
PORT=3000
EMAIL=an email that can work with nodemailer
EMAIL_PASS=passwordforemail
```
While I have yet to test the functionality of the emailing system this should work. I am planning to configure it with an email configured with the web server.

## Usage
To start the server to test functionality run the command
```bash
npm run start
```