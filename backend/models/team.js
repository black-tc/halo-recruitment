const mongoose = require("mongoose");

const schema = mongoose.Schema({
    fnames: { type: String, required: true },
    sname: { type: String, required: true },
    age: { type: Number, required: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    country: { type: String, required: true },
    description: {
        long: { type: String, required: true },
        short: { type: String, required: true }
    },
    social_media: {
        name: { type: String, required: false },
        profile_name: { type: String, required: false },
        link: { type: String, required: false }
    },
    image: { type: String, required: true }
}, { location: 'Team' });

// exporting the schema
module.exports = new mongoose.model('team', schema);
