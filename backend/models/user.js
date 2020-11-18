const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

//creating a user schema for users table collection
const schema = mongoose.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    company: { type: String, required: true },
    Cell: { type: String, required: true },
    Email: { type: String, required: true, lowercase: true },
    Password: { type: String, required: true }
}, { location: 'adminUsers' });

// create variable user
schema.plugin(uniqueValidator);
const User =  module.exports = mongoose.model("adminusers", schema);

// creating function to get user by id
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.getUser = function (user, callback) {
    User.find(user, callback);
};

//get user by username
module.exports.getUserByUsername = function (Email, callback) {
    const query = { Email: Email };
    User.findOne(query, callback);
};

//get user by email
module.exports.getEmail = function (Email, callback) {
    const query = { Email: Email };
    User.findOne(query, callback);
};

// add user fuction
module.exports.addUser = function (user, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        //creating the hash password
        bcrypt.hash(user.Password, salt, (err, hash) => {
            //setting the user password to the created has variable
            if (err) throw err;
            user.Password = hash;
            user.save(callback);
        });
    });
};

module.exports.updatePassword = function (_id, password, callback) {
    User.updateOne({ _id: _id }, password, callback)
}

module.exports.comparePassword = function (candidateP, hash, callback) {
    //comparing the two password
    bcrypt.compare(candidateP, hash, (err, match) => {
        try {
            if (err) {
                callback(err);
            }
            callback(null, match);

        } catch (error) {
            callback(error)
        }
    });
}
