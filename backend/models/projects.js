const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: { type: String, required: true },
    start_date: { type: String, required: true },
    finish_date: { type: String, required: true },
    duration: { type: String, required: true },
    description: {
        long: { type: String, required: true },
        short: { type: String, required: true }
    },
    // location: {
    country: { type: String, required: true },
    image: { type: String, required: false },
    document: { type: String, required: false },
    // coords: {
    //     lat: { type: Number, required: true },
    //     lon: { type: Number, required: true }
    // },
    // },
    investment: { type: String, required: true },
    progress: { type: String, require: false }
}, { location: 'Projects' });

// exporting the schema
module.exports = new mongoose.model('projects', schema);