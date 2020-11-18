const Application = require('../models/applications');
const router = require('express').Router();
const authentication = require('./authenticate');
const jwt = require('jsonwebtoken');
const crypto = require('../config/crypto');
const config = require('../config/database');

// route to add an application
router.post('/add', (req, res, next) => {
    const application = new Application({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        comments: req.body.comments,
        email: req.body.email,
        phone: req.body.phone,
        date_applied: req.body.date_applied
    });

    // add on a success 
    application.save(application, (err, application) => {
        if (err) return res.sendStatus(400).json({ success: false, data: err });
            console.log(err)
        return res.json({ success: true, data: { msg: 'Application saved with success' } })
    });

});

// router to to get application by id
router.get('/application/:id', (req, res, next) => {
    Application.findById({ _id: req.params.id }, (err, application) => {
        if (err) {
            return res.sendStatus(400).json({ success: false, data: err });
        } else if (!application) {
            return res.json({ success: true, data: { msg: 'Application does not exist' } });
        } else {
            return res.json({ success: true, data: application });
        }
    });
});

// route to get all application
router.get('/get-all', (req, res, next) => {
    Application.find({}, (err, application) => {
        if (err) return res.sendStatus(400).json({ success: false, data: err });
        return res.json({ success: true, data: application });
    });
});

// router to update a application data
router.put('/update/:id', crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {
    // verify the token
    jwt.verify(req.token, config.secret, function (err, data) {
        if (err) {
            return res.json({ success: false, data: 'user not authenticate', err: err });
        } else {
            const data = {
                firstname: req.body.data.firstname,
                lastname: req.body.data.lastname,
                date_applied: req.body.data.date_applied,
                comments: req.body.data.comments,
                email: req.body.data.email,
                phone: req.body.data.phone
            }
            // update on a success 
            Application.updateOne({ _id: req.params.id }, data, (err, application) => {
                if (err) {
                    return res.sendStatus(400).json({ success: false, data: err });
                } else if (!application) {
                    return res.json({ success: false, data: { msg: 'Application does not exist' } });
                } else {
                    return res.json({ success: true, data: { msg: 'Application updated with success' } });
                }
            });
        }
    });
});

// router to delete an application
router.post('/delete/:id', crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {
    // verify the token
    jwt.verify(req.token, config.secret, function (err, data) {
        if (err) {
            return res.json({ success: false, data: 'user not authenticate', err: err });
        } else {
            // const 
            // update on a success 
            Application.deleteOne({ _id: req.params.id }, (err, application) => {
                if (err) {
                    return res.sendStatus(400).json({ success: false, data: err });
                } else if (!application) {
                    return res.json({ success: true, data: { msg: 'Application does not exist' } });
                } else {
                    return res.json({ success: true, data: { msg: 'Application deleted with success' } });
                }
            });
        }
    });
});

// exporting the router
module.exports = router;