const router = require('express').Router();
const authentication = require('./authenticate');
const jwt = require('jsonwebtoken');
const Team = require('../models/team');
const crypto = require('../config/crypto');
const config = require('../config/database');
const multer = require('multer');
const fs = require('fs')

// the multer object
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './assets/team/images/');
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
router.post('/add', upload.single('profile_image'), crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {

    const member = new Team({
        fnames: req.body.fnames,
        sname: req.body.sname,
        age: req.body.age,
        category: req.body.category,
        country: req.body.country,
        department: req.body.department,
        description: {
            long: req.body.long,
            short: req.body.short
        },
        social_media: {
            name: req.body.social_media_name,
            profile_name: req.body.profile_name,
            link: req.body.social_media_link
        },
        image: req.file.path
    });

    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            try {
                // removing the file
                fs.unlinkSync('./assets/team/images/' + req.file.originalname);
                return next(err);
            } catch (err) {
                console.error(err)
            }
        } else {
            // add on a success 
            member.save((err, member) => {
                if (err) return next(err);
                return res.json({ success: true, data: { msg: 'Team member saved with success' } });
            });
        }
    });


});

// router to to get team member by id
router.get('/member/:id', async (req, res, next) => {
    await Team.findById({ _id: req.params.id }, (err, member) => {
        if (err) {
            return next(err);
        } else if (!member) {
            return res.json({ success: false, msg: 'Member does not exist' });
        } else {
            return res.json({ success: true, data: member });
        }
    });
});

// route to get all members
router.get('/get-all', async (req, res, next) => {
    await Team.find({}, (err, members) => {
        if (err) return next(err);
        return res.json({ success: true, data: members })
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
                fnames: req.body.fnames,
                sname: req.body.sname,
                age: req.body.age,
                category: req.body.category,
                country: req.body.country,
                department: req.body.department,
                description: {
                    long: req.body.long,
                    short: req.body.short
                },
                social_media: {
                    name: req.body.social_media_name,
                    profile_name: req.body.profile_name,
                    link: req.body.social_media_link
                },
                image: req.file ? req.file.path : `assets\\taem\\images\\${req.body.image}`
            }

            // update on a success 
            await Team.updateOne({ _id: req.params.id }, data, async (err, member) => {
                if (err) {
                    return next(err);
                } else if (!member) {
                    return res.json({ success: false, data: { msg: 'Member does not exist' } });
                } else {
                    // replacing the back slsh with forward
                    if (req.file) {
                        try {
                            fs.unlinkSync('./assets/team/images/' + req.body.image);
                            return res.json({ success: true, data: { msg: 'Team member updated with success' } });
                        } catch (err) {
                            console.error(err)
                        }
                    } else {
                        return res.json({ success: true, data: { msg: 'Team member updated with success' } });
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
            await Team.deleteOne({ _id: req.params.id }, (err, member) => {
                if (err) return next(err);
                else if (!member) {
                    return res.json({ success: false, data: { msg: 'Member does not exist' } });
                } else {
                    return res.json({ success: true, data: { msg: 'Member deleted with success' } });
                }
            });
        }
    });
});

// exporting the router
module.exports = router;