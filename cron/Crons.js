const cron = require('node-cron');
const { clearOldOtps } = require("./task");


cron.schedule('* * * * *', () => {
    console.log('Checking and clearing old OTPs...');
    clearOldOtps();
});
