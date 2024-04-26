const cron = require('node-cron');
const { clearOldOtps } = require("./task");


// cron.schedule('* * * * *', () => { time durataion is 1minute  5 star ka matlb min hours month   year weak
cron.schedule('0 0 * * *', () => {          //here the time duration is at 12 am at night means it will run at 12 oclock at night

    console.log('Checking and clearing old OTPs...');
    clearOldOtps();
});
