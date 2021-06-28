const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB, { useUnifiedTopology: true, useNewUrlParser: true});

module.exports = mongoose.connection;

