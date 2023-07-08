const mongoose = require('mongoose');

const votesSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  votes: [
    {
      type: String,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const People = mongoose.model('Votes', votesSchema);

module.exports = People;
