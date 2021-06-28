const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CrmEventModel = new Schema({
  EventType: String,
  UserEmail: String,
  Timestamp: Date,
  EmailSent: Number,
  EmailSentPhase: String,
});

module.exports = mongoose.model('CrmEvent', CrmEventModel);
