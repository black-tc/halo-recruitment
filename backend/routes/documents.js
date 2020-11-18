const router = require('express').Router();
const authentication = require('./authenticate');
const jwt = require('jsonwebtoken');
const Document = require('../models/documents');
const crypto = require('../config/crypto');
const config = require('../config/database');
const multer = require('multer');
const fs = require('fs')

// the multer object
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './assets/documents/');
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


// route to add a team member
router.post('/add', upload.single('file'), crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {

    const document = new Team({
        name: req.body.name,
        date: req.body.date,
        file: req.file.path
    });

    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            try {
                // removing the file
                fs.unlinkSync('./assets/documents/' + req.file.originalname);
                return next(err);
            } catch (err) {
                console.error(err)
            }
        } else {
            // add on a success 
            Document.save((err, document) => {
                if (err) return next(err);
                return res.json({ success: true, data: { msg: 'document saved with success' } });
            });
        }
    });

});



// router to to get team member by id
router.get('/document/:id', async (req, res, next) => {
    await Document.findById({ _id: req.params.id }, (err, document) => {
        if (err) {
            return next(err);
        } else if (!document) {
            return res.json({ success: false, msg: 'Member does not exist' });
        } else {
            return res.json({ success: true, data: member });
        }
    });
});

// route to get all members
router.get('/get-all', async (req, res, next) => {
    await Document.find({}, (err, documemnts) => {
        if (err) return next(err);
        return res.json({ success: true, data: documemnts })
    });
});

// router to update a team member data
router.put('/update/:id', upload.single('profile_image'), crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {
    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            return next(err);
        } else {
            const data = {
                date: req.body.date,
                name: req.body.name,
                file: req.file ? req.file.path : `assets\\documents\\${req.body.file}`
            }

            // update on a success 
            await Document.updateOne({ _id: req.params.id }, data, async (err, document) => {
                if (err) {
                    return next(err);
                } else if (!document) {
                    return res.json({ success: false, data: { msg: 'Document does not exist' } });
                } else {
                    // replacing the back slsh with forward
                    if (req.file) {
                        try {
                            fs.unlinkSync('./assets/documemnts/' + req.body.image);
                            return res.json({ success: true, data: { msg: 'Document updated with success' } });
                        } catch (err) {
                            console.error(err)
                        }
                    } else {
                        return res.json({ success: true, data: { msg: 'Document updated with success' } });
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
            await Document.deleteOne({ _id: req.params.id }, (err, document) => {
                if (err) return next(err);
                else if (!document) {
                    return res.json({ success: false, data: { msg: 'Document does not exist' } });
                } else {
                    return res.json({ success: true, data: { msg: 'Document deleted with success' } });
                }
            });
        }
    });
});

// exporting the router
module.exports = router;