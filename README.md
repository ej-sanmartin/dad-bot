# Dad Bot
<p align="center">
<img src="https://raw.githubusercontent.com/ej-sanmartin/dad-bot/main/assets/dad-bot-banner_transparent.png")
</p>


## Description

Dad Bot is a NodeJs application that sends you a cheesy dad joke to start your day off right. By default, this application will run at 7am every day - Monday through Friday, Weekends included - but you may change that by editing the cron schedule expression.


## Purpose

Why not start the day off with a laugh, ya know?


## Prerequisites

Will need to set up a Twilio account to get the environment variables:

    - TWILIO_ACCOUNT_SID
    - TWILIO_AUTH_TOKEN
    - TWILIO_PHONE_NUMBER

Will need to set up a RapidAPI account to get the environment variables:

    - RAPID_API_KEY

You'll also need your own phone number or a target phone number to fill out the PHONE_NUMBER .env variable.


## Setup

You will need to create a folder in your local computer to place this repo and fork this so you can make changes as you see fit. Once that is done, run these lines:

`git clone [insert your git url]`

`cd dad-bot`

`npm run start`


## Tech in Use

- Express
- Twilio
- Unirest
- Cron


## Deployment Notes

[Twilio](https://wwww.twilio.com/docs/labs/serverless-toolkit/deploying "Twilio Serverless Toolkit Deployment") has its own deployment procedures if you would like to deploy on their platform. I had chosen Heroku as I have been a longtime user of their services and deployment is as simple as any NodeJs Application.

Keep in mind that Heroku puts your application to sleep if it has not been accessed after 1 hour, which may cause some problems when running this application - mainly that Dad will sleep in and miss sending you a text. To fix this, I used [Heroku Kaffeine](http://kaffeine.herokuapp.com "Heroku Kaffeine") to give Dad Bot that extra boost to wake him up every hour.

How Heroku Kaffeine works is that it will send a ping to your site every hour to keep it awake. If you want to challenge yourself, you can program your own pinging function or you can use another solution to make sure a ping is sent to your application at least once an hour or before it is time to send you your scheduled dad joke.

Since your app could be awake at all times, it will use up your Dyno Hours for the month if you are not careful. Luckily, if you have a paid account with Heroku, your Dyno Hours are in the thousands in the lowest tier which should be more than enough.


## Contributions

- Edgar Jr San Martin (Creator)

## Copyright

© Edgar Jr San Martin 2021