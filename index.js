require('dotenv').config();
const express = require('express');
const unirest = require('unirest');
const twilio = require('twilio');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler');

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

function setupTextContent(jokeObject){
    let textContent =`
Wanna hear a joke? :D\n\n
${jokeObject.setup}\n\n
${jokeObject.punchline}
`
    return textContent;
}

function setupTextDetail(textContent){
    let textObject = {
        body: textContent,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.PHONE_NUMBER
    }

    return textObject;
}

function getDadJoke(jokeObject){
    var req = unirest("GET", "https://dad-jokes.p.rapidapi.com/random/joke");

    req.headers({
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "dad-jokes.p.rapidapi.com",
        "useQueryString": true
    });

    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        jokeObject.setup = res.body[0].setup;
        jokeObject.punchline = res.body[0].punchline;
    });

    return jokeObject;
}

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
