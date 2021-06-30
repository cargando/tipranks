const Events = require('../models/const');

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

module.exports = {
  emailText,
  TIME_TO_WAIT,
}
