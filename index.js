require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler');
const schedule = require('node-schedule');
const { setupTextContent,
        setupTextDetail,
        getDadJoke } = require('./utils.js');

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
            dadJoke = await getDadJoke(dadJoke);
            let textContent = setupTextContent(dadJoke);
            let text = setupTextDetail(textContent);
            client.messages.create(text);
        } catch(err) {
            console.error(`Error ocurred while sending the text message: ${err}`);
        }
    },
    (err) => { console.error(`Error ocurred running this daily task: ${err}`); }
);
const job = new SimpleIntervalJob({ days: 1 }, task)

scheduler.addSimpleIntervalJob(job);

// const startJob = schedule.scheduleJob('* * 7 * * *', scheduler.addSimpleIntervalJob(job));
