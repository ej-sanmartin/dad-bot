const unirest = require('unirest');

function setupTextContent(jokeObject){
    if(jokeObject == null) throw new Error('Null or no object passed into setupTextContent function.');

    let textContent =`
Wanna hear a joke? :D\n\n
${jokeObject.setup}\n\n
${jokeObject.punchline}
`
    return textContent;
}

function setupTextDetail(textContent){
    if(jokeObject == null) throw new Error('Null or no object passed into setupTextDetail function.');

    let textObject = {
        body: textContent,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.PHONE_NUMBER
    }
    return textObject;
}

function getDadJoke(jokeObject){
    if(jokeObject == null) throw new Error('Null or no object passed into getDadJoke function.');

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

module.exports = {
    setupTextContent: setupTextContent,
    setupTextDetail: setupTextDetail,
    getDadJoke: getDadJoke
}