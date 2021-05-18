const unirest = require('unirest');

function setupTextContent(jokeObject){
    if(jokeObject == null) throw new Error('Null or no object passed into setupTextContent function.');

    let textContent =`Hey, it's Dad-Bot.\n
Wanna hear a joke? :D\n\n
${jokeObject.setup}\n\n
${jokeObject.punchline}
`
    return textContent;
}

function setupTextDetail(textContent){
    if(textContent == null) throw new Error('Null or no object passed into setupTextDetail function.');

    let textObject = {
        body: textContent,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.PHONE_NUMBER
    }
    return textObject;
}

async function getDadJokeAsync(callback){
    unirest("GET", "https://dad-jokes.p.rapidapi.com/random/joke")
    .headers({
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "dad-jokes.p.rapidapi.com",
        "useQueryString": true
    })
    .end(function (res){
        if (res.error){
            console.error(`Error getting joke: ${res.error}`);
            callback(res.error, null);
        } else {
            console.log("Fetching joke successful");
            callback(null, res.body.body[0]);
        }
    });
}

module.exports = {
    setupTextContent: setupTextContent,
    setupTextDetail: setupTextDetail,
    getDadJokeAsync: getDadJokeAsync
}