require('dotenv').config();
const db = require('./db');
const cron = require('node-cron');
const { sendEmails } = require('./utils')


db.on('error', function (err){
  console.error(`connection error: ${err}`)
});

db.once('open', async function() {
  console.log(`\n- - - - - - \nConnected to MongoDB.Atlas\n`);
  emailer();
  // await sendEmails();
});


function emailer() {

  cron.schedule('* * * * *', async function() {
    console.log('running a task every minute');
    await sendEmails();
  });
}
