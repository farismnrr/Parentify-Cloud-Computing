const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
);

const countdowns = {};

function startCountdown(phoneNumber) {
    countdowns[phoneNumber] = 60; // Countdown duration in seconds
    const intervalId = setInterval(() => {
        countdowns[phoneNumber]--;
        if (countdowns[phoneNumber] <= 0) {
            clearInterval(intervalId);
            delete countdowns[phoneNumber]; // Countdown finished, allow sending OTP again
        }
    }, 1000);
}

module.exports = {
    client,
    countdowns,
    startCountdown,
    // You can export other functions or variables here if needed
};
