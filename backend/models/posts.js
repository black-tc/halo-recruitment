const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    comments: { type: String, required: true },
    likes: { type: Number, required: true },
}, { location: 'Posts' });

module.exports = new mongoose.model('posts', schema);
