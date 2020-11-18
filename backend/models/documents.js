const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: { type: String, required: true },
    file: { type: String, required: true},
    date: { type: String, required: true },
}, { location: 'Documents' });

module.exports = new mongoose.model('documents', schema);
