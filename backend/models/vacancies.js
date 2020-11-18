const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    duties: { type: String, required: true },
    where: { type: String, required: true },
    image: { type: String, required: false },
    contact: { type: String, required: false },
    posted_date: { type: String, required: false },
}, { location: 'Vacancies' });



module.exports = new mongoose.model('vacancies', schema);
