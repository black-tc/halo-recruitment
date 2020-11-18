const mongoose = require("mongoose");

const applicationsSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    date_applied: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    cv: { type: String, required: false },
    comments: { type: String, required: true },
    job: { type: String, required: true },
}, { location: 'JobApplications' });


module.exports = new mongoose.model('jobApplications', applicationsSchema);