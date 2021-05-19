require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cron = require('cron');
const cookieParser = require('cookie-parser');
const path = require('path');
const { setupTextContent,
        setupTextDetail,
        getDadJokeAsync } = require('./utils.js');

// init express and set up static folders, template engine
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('sanitize').middleware);
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.set('view engine', 'ejs');

// start the server listening for requests, using deployment option's port or locally
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running..."));

// displays something interesting for the heroku page
app.get('/', (req, res) => {
    res.clearCookie('name', { path: '/' }, { httpOnly: true });
    res.render('index');
});

app.get('/punchline', (req, res) => {
    let context = { name: req.cookies.name };
    res.render('punchline', { data: context });
});

//saves sanitized input into a cookie
app.post('/punchline-send', (req, res) => {
    let name = req.bodyString('name');
    res.cookie('name', name, { httpOnly: true });
    res.redirect('/punchline');
});

// init Twilio
let accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
let authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = twilio(accountSid, authToken);

/*
    set cron time right below, default is every day at 7:00am
    Reminder for how it is formatted:
       *      *            *              *          *
    minute  hour    day of the month    month   day of the week
*/
let cronScheduleExpression = '0 7 * * 0-6';

// Starts this program at 7am. Then cron will re-run the text program every day
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