require('dotenv').config();
const db = require('./db');
const CrmEvent = require('./models/CrmEvent.model');
const Events = require('./models/const');

db.on('error', function (err){
  console.error(`connection error: ${err}`)
});

db.once('open', function() {
  console.log(`\n- - - - - - \nConnected to MongoDB.Atlas\n`);
  // addSome();
  addSome();
});


function addSome() {



  CrmEvent.insertMany([
    {
      EventType: Events.PAYMENT_FAILURE,
      UserEmail: "user150@gmail.com",
      Timestamp: new Date(),
    },
    {
      EventType: Events.PAYMENT_SUCCESS,
      UserEmail: "user500@gmail.com",
      Timestamp: new Date(),
    },
    {
      EventType: Events.VISIT_PAGE,
      UserEmail: "user300@gmail.com",
      Timestamp: new Date(),
    }
  ]).then(function() {
    console.log("Data inserted")
  }).catch(function(error) {
    console.log(error);
  });

}
