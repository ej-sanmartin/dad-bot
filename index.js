require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cron = require('cron');
const path = require('path');
const { setupTextContent,
        setupTextDetail,
        getDadJokeAsync } = require('./utils.js');

// init express
const app = express();
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.set('view engine', 'ejs');

// start the server listening for requests, using deployment option's port or locally
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running..."));

// displays something for the heroku page
app.get('/', (req, res) => {
    res.render('index');
});

// init Twilio
let accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
let authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = twilio(accountSid, authToken);

/*
    set cron time right below, default is every day at 7:00am
    Reminder for how it is formatted
       *      *            *              *          *
    minute  hour    day of the month    month   day of the week
*/
let cronScheduleExpression = '0 7 * * 0-6';

// Starts this program at 7am. Then toad-scheduler will re-run the text program every day
let CronJob = cron.CronJob;
let job = new CronJob(cronScheduleExpression, async function(){
    console.log('Cron Job starting');
    try {
        let dadJoke = {};
        getDadJokeAsync(function(error, res){
            if(error != null){
                console.error(`Error setting dadJokeObject: \t ${error}`);
            } else {
                dadJoke.setup = res.setup;
                dadJoke.punchline = res.punchline;
                let textContent = setupTextContent(dadJoke);
                let text = setupTextDetail(textContent);
                client.messages.create(text);
            }
        });
    } catch(err){
        console.error(`Error ocurred trying to text you: ${err}`);
    }
}, null, true, 'America/New_York');
job.start();