const Partners = require('../models/partners');
const router = require('express').Router();
const authentication = require('./authenticate');
const jwt = require('jsonwebtoken');
const crypto = require('../config/crypto');
const config = require('../config/database');
const multer = require('multer');
const fs = require('fs')

// the multer object
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './assets/partners/images/');
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);
    }
});

// const filter
const filterFile = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
        callback(null, true); // to accept the file
    callback(null, false); // to reject the file 
}

// storage location, and only files that are equal or less than 5mb will be accepted
const upload = multer({
    storage: storage,
    // fileFilter: filterFile,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});


// route to add partner
router.post('/add', upload.single('partner_image'), crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {

    const newPartner = new Partners({
        name: req.body.name,
        description: {
            long: req.body.long,
            short: req.body.short
        },
        image: req.file.path,
        webaddress: req.body.webaddress
    });

    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            try {
                // removing the file
                fs.unlinkSync('./assets/partners/images/' + req.file.originalname);
                return next(err);
            } catch (err) {
                console.error(err)
            }
        } else {
            // add on a success 
            await newPartner.save((err, partner) => {
                if (err) return next(err);
                return res.json({ success: true, data: { msg: 'Partner saved with success' } })
            });
        }
    });
});

// router to to get partner by id
router.get('/partner/:id', async (req, res, next) => {
    await Partners.findById({ _id: req.params.id }, (err, partner) => {
        if (err) {
            return next(err);
        } else if (!partner) {
            return res.json({ success: true, data: { msg: 'Partner does not exist' } });
        } else {
            return res.json({ success: true, data: partner });
        }
    });
});

// route to get all partners
router.get('/get-all', async (req, res, next) => {
    await Partners.find({}, (err, partner) => {
        if (err) {
            return next(err);
        } else if (!partner) {
            return res.json({ success: true, data: { msg: 'Partner does not exist' } });
        } else {
            return res.json({ success: true, data: partner });
            
        }
    });
});

// router to update a partner data
router.put('/update/:id', upload.single('partner_image'), crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {
    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            return next(err);
        } else {
            const data = {
                name: req.body.name,
                description: {
                    long: req.body.long,
                    short: req.body.short
                },
                image: req.file ? req.file.path : `assets\\partners\\images\\${req.body.image}`,
                webaddress: req.body.webaddress
            }
            // update on a success 
            await Partners.updateOne({ _id: req.params.id }, data, (err, partner) => {
                if (err) {
                    return next(err);
                } else if (!partner) {
                    return res.json({ success: true, data: { msg: 'Partner does not exist' } });
                } else {
                    // replacing the back slsh with forward
                    if (req.file) {
                        try {
                            fs.unlinkSync('./assets/partners/images/' + req.body.image);
                            return res.json({ success: true, data: { msg: 'Partner updated with success' } });
                        } catch (err) {
                            console.error(err)
                        }
                    } else {
                        return res.json({ success: true, data: { msg: 'Partner updated with success' } });
                    }
                }
            });
        }
    });
});

// router to delete a member
router.post('/delete/:id', crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {
    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            return next(err);
        } else {
            // const 
            // update on a success 
            await Partners.deleteOne({ _id: req.params.id }, (err, partner) => {
                if (err) {
                    return next(err);
                } else if (!partner) {
                    return res.json({ success: true, data: { msg: 'Partner does not exist' } });
                } else {
                    return res.json({ success: true, data: { msg: 'Partner deleted with success' } });
                }
            });
        }
    });
});

// exporting the router
module.exports = router;