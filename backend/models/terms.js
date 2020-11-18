const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: { type: String, required: true },
    description: {
        long: { type: String, required: true },
        short: { type: String, required: true }
    },
    date: { type: String, required: true },
}, { location: 'Terms' });

module.exports = new  mongoose.model('terms', schema);
