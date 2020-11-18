const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: { type: String, required: true },
    description: {
        long: { type: String, required: true },
        short: { type: String, required: true }
    },
    image: { type: String, required: false },
    webaddress: { type: String, required: false },
}, { location: 'Partners' });

module.exports = new mongoose.model('partners', schema);
