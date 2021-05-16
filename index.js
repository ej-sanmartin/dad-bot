require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler');
const cron = require('cron');
const { setupTextContent,
        setupTextDetail,
        getDadJokeAsync } = require('./utils.js');

// init express
const app = express();
app.use(express.json());

// start the server listening for requests, using deployment option's port or locally
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running..."));

// init Twilio
let accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
let authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = twilio(accountSid, authToken);

// lets text be sent once a day
const scheduler = new ToadScheduler();
const task = new AsyncTask(
    'simple task',
    async () => {
        try {
            let dadJoke = {};
            getDadJokeAsync(function(error, res){
                if(error != null){
                    console.error(`Error setting dadJokeObject: \t ${error}`)
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
    },
    (err) => { console.error(`Error ocurred running this daily task: ${err}`); }
);
const job = new SimpleIntervalJob({ seconds: 10 }, task)

// Starts this program at 7am. Then toad-scheduler will re-run the text program every day
let CronJob = cron.CronJob;
let startJob = new CronJob('* 55 14 * * *', function(){
    console.log('Cron Job starting');
    scheduler.addSimpleIntervalJob(job);
}, null, true, 'America/New York');
startJob.start();
 