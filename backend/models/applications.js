const mongoose = require("mongoose");

const schema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    comments: { type: String, required: true },
    date_applied: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
}, { location: 'JobApplications' });


// create variable user
module.exports = new mongoose.model("jobapplications", schema);

