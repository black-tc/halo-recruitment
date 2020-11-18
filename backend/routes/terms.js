const Terms = require('../models/terms');
const router = require('express').Router();
const authentication = require('./authenticate');
const jwt = require('jsonwebtoken');
const crypto = require('../config/crypto');
const config = require('../config/database');

// route to add a term
router.post('/add', crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {
    const newTerm = new Terms({
        name: req.body.data.name,
        date: req.body.data.date,
        description: {
            long: req.body.data.description.long,
            short: req.body.data.description.short
        }
    });

    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            return next(err);
        } else {
            // add on a success 
            await newTerm.save((err, terms) => {
                if (err) return next(err);
                return res.json({ success: true, data: { msg: 'Term saved with success' } })
            });
        }
    });

});

// route to get all terms
router.get('/get-all', async (req, res, next) => {
    await Terms.find({}, (err, terms) => {
        if (err) return next(err);
        res.json({ success: true, data: terms })
    });
});

// route to get by id
router.get('/term/:id', async (req, res, next) => {
    await Terms.findById({ _id: req.params.id }, (err, term) => {
        if (err) {
            return next(err);
        } else if (!term) {
            return res.json({ success: false, data: { msg: 'Term does not exist ' } });
        } else {
            return res.json({ success: true, data: term });
        }
    });
});


// route to update term
router.put('/update/:id', crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {
    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            return next(err);
        } else {

            // update on a success 
            const updateTerm = {
                name: req.body.data.name,
                date: req.body.data.date,
                description: {
                    long: req.body.data.description.long,
                    short: req.body.data.description.short
                }
            };

            await Terms.updateOne({ _id: req.params.id }, updateTerm, (err, term) => {
                if (err) {
                    return next(err);
                } else if (!term) {
                    return res.json({ success: false, data: { msg: 'Term does not exist ' } });
                } else {
                    return res.json({ success: true, data: { msg: 'Term updated with success' } });
                }
            });
        }
    });
});

// route to delte a term
router.post('/delete/:id', crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {
    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            return next(err);
        } else {
            // const 
            // update on a success 
            await Terms.deleteOne({ _id: req.params.id }, (err, term) => {
                if (err) {
                    return next(err);
                } else if (!term) {
                    return res.json({ success: false, data: { msg: 'Term does not exist ' } });
                } else {
                    return res.json({ success: true, data: { msg: 'Term deleted with success' } });
                }
            });
        }
    });
});

// exporting the router
module.exports = router;