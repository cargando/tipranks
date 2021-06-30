const {DynaEmailSender} = require("dyna-email-sender");
const {emailText} = require('./dictionaris')

const sender = new DynaEmailSender({
  host: 'smtp.ethereal.email',
  port: 587,
  tls: false,
  username: 'info@my-company.com',
  password: 'pass-matters',
  allowInvalidCertificates: false,
});


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
  sender,
  spam,
}
