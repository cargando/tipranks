const {DynaEmailSender} = require("dyna-email-sender");
const dayjs = require('dayjs');

const CrmEvent = require('../models/CrmEvent.model');
const Events = require('../models/const');

const sender = new DynaEmailSender({
  host: 'smtp.ethereal.email',
  port: 587,
  tls: false,
  username: 'info@my-company.com',
  password: 'pass-matters',
  allowInvalidCertificates: false,
});


const emailText = {
  [Events.VISIT_PAGE]: 'Your registration is just around the corner!',
  [Events.BUY_PAGE]: 'Your TipRanks plan is still in your cart!',
  [Events.PAYMENT_FAILURE]: 'Complete your purchase with this 20% coupon.',
}

const TIME_TO_WAIT = {
  [Events.VISIT_PAGE]: 20,
  [Events.BUY_PAGE]: 15,
  [Events.PAYMENT_FAILURE]: 10,
}




async function sendEmails() {
  function pushDoc(doc, phase) {
    const now = dayjs();
    const timeDiff = now.diff(dayjs(doc.Timestamp), 'minute');


    if (TIME_TO_WAIT[phase] <= timeDiff ) {
      listByPhases[phase].push({
        id: doc._id,
        email: doc.UserEmail
      });
    }

  }

  const listByPhases = {
    [Events.VISIT_PAGE]: [],
    [Events.BUY_PAGE]: [],
    [Events.PAYMENT_FAILURE]: [],
  }


  const list = await CrmEvent.find(
    { $or: [
        { EmailSent: { $exists: false}},
        { EmailSent: { $eq: 0}}
      ] }
  ).exec();

  list.forEach(function (doc){
    pushDoc(doc, doc.EventType);
  });

  for (const [key, value] of Object.entries(listByPhases)) {
    console.log(`${key}: ${value}`);
    const emails = value.map((item) => item.email);
    const ids = value.map((item) => item.id);
    spam(key, emails);
    markSentEmailUsers(key, ids);
  }

}



async function markSentEmailUsers(phase, idList) {

  const res = await CrmEvent.updateMany({
    _id: { $in: idList }
  },
    {
      EmailSent: 1,
      EmailSentPhase: phase,
    });

  return {
    matched: res.n,
    updated: res.nModified,
  };
}

async function spam(phase, mails) {
  sender.send({
    fromTitle: 'TipRanks',
    fromAddress: 'info@TipRanks.com',
    toAddress: mails,
    subject: emailText[phase],
    text: emailText[phase],
    html: '<b>Hello world</b>',
  })
    .catch((error) => {
      console.log('Email send failed', {error});
    });

}


module.exports = {
  sendEmails,
  markSentEmailUsers,
  spam
};
