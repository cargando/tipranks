const dayjs = require('dayjs');

const CrmEvent = require('../models/CrmEvent.model');
const Events = require('../models/const');
const {TIME_TO_WAIT} = require('./dictionaris');
const {spam} = require('./mailer');


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


module.exports = {
  sendEmails,
  markSentEmailUsers,
};
