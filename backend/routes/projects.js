const Projects = require('../models/projects');
const router = require('express').Router();
const authentication = require('./authenticate');
const jwt = require('jsonwebtoken');
const crypto = require('../config/crypto');
const config = require('../config/database');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// the multer object
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let type = file.mimetype;
        if (file) {
            if (type === 'image/jpg' || type === 'image/png') {
                callback(null, './assets/projects/images');
            } else if (type === 'application/pdf') {
                callback(null, './assets/projects/docs');
            }
        }
    },
    filename: (req, file, callback) => {
        if (file) {
            callback(null, `${file.originalname}`);
        }
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


// route to add a project
router.post('/add', upload.array('files'), crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {

    const project = new Projects({
        name: req.body.name,
        start_date: req.body.start_date,
        finish_date: req.body.finish_date,
        duration: req.body.duration,
        description: {
            long: req.body.long,
            short: req.body.short
        },
        // location: {
        country: req.body.country,
        //     coords: {
        //         lat: req.body.data.location.coords.lat,
        //         lon: req.body.data.location.coords.lon
        //     },
        // },
        investment: req.body.investment,
        progress: req.body.progress,
        image: req.files[0].path,
        document: req.files[1].path
    });


    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            try {
                // removing the file
                fs.unlinkSync('./assets/projects/images/' + req.files[0].originalname);
                fs.unlinkSync('./assets/projects/docs/' + req.files[1].originalname);
                return next(err);
            } catch (err) {
                console.error(err)
            }
        } else {
            // add on a success 
            await project.save((err, project) => {
                if (err) return next(err);
                return res.json({ success: true, data: { msg: 'Project saved with success' } })
            });
        }
    });

});

// route to get all project
router.get('/get-all', async (req, res, next) => {
    await Projects.find({}, (err, projects) => {
        if (err) return next(err);
        return res.json({ success: true, data: projects })
    });
});

// route to get by id
router.get('/project/:id', async (req, res, next) => {
    await Projects.findById({ _id: req.params.id }, (err, project) => {
        if (err) {
            return next(err);
        } else if (!project) {
            return res.json({ success: false, data: { mss: 'Project does not exist' } });
        } else {
            return res.json({ success: true, data: project });
        }
    });
});
// route to get by id
router.get('/bycountry/:country', async (req, res, next) => {
    await Projects.find({ country: req.params.country }, (err, project) => {
        if (err) {
            return next(err);
        } else if (!project) {
            return res.json({ success: false, data: { mss: 'Project does not exist' } });
        } else {
            return res.json({ success: true, data: project });
        }
    }); 
});


// route to update project
router.put('/update/:id', upload.array('files'), crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {

    let igmpath = '';
    let docpath = '';

    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            return next(err);
        } else {


            // console.log(req.body)


            if (req.files.length > 0) {
                if (req.files.length === 1) {
                    if (req.files[0].mimetype === 'application/pdf') {
                        docpath = req.files[0] !== undefined && req.files[0] !== '' ? req.files[0].path : `assets\\projects\\docs\\${req.body.document}`;
                        igmpath = `assets\\projects\\images\\${req.body.image}`;
                    } else if (req.files[0].mimetype === 'image/jpg' || req.files[0].mimetype === 'image/png') {
                        igmpath = req.files[0] !== undefined && req.files[0] !== '' ? req.files[0].path : `assets\\projects\\images\\${req.body.image}`;
                        docpath =  `assets\\projects\\docs\\${req.body.document}`;
                    }
                } else {
                    docpath = req.files[1] !== undefined && req.files[1] !== '' ? req.files[1].path : `assets\\projects\\docs\\${req.body.document}`;
                    igmpath = req.files[0] !== undefined && req.files[0] !== '' ? req.files[0].path : `assets\\projects\\images\\${req.body.image}`;
                }
            }else {
                docpath =  `assets\\projects\\docs\\${req.body.document}`;
                igmpath = `assets\\projects\\images\\${req.body.image}`;
            }

            const data = {
                name: req.body.name,
                start_date: req.body.start_date,
                finish_date: req.body.finish_date,
                duration: req.body.duration,
                description: {
                    long: req.body.long,
                    short: req.body.short
                },
                // location: {
                country: req.body.country,
                //     coords: {
                //         lat: req.body.data.location.coords.lat,
                //         lon: req.body.data.location.coords.lon   
                //     },
                // },
                investment: req.body.investment,
                document: docpath,
                progress: req.body.progress,
                image: igmpath
            }

            // console.log(data)

            // console.log(req.files);

            // update on a success 
            await Projects.updateOne({ _id: req.params.id }, data, (err, project) => {
                if (err) {
                    return next(err);
                } else if (!project) {
                    return res.json({ success: false, data: { mss: 'Project does not exist' } });
                } else {
                    // replacing the back slsh with forward
                    if (req.files.length > 0) {
                        try {
                            if (req.files.length === 1) {
                                if (req.files[0].mimetype === 'application/pdf') {
                                    fs.unlinkSync('./assets/projects/docs/' + req.body.document);
                                } else if (req.files[0].mimetype === 'image/jpg' || req.files[0].mimetype === 'image/png') {
                                    fs.unlinkSync('./assets/projects/images/' + req.body.image);
                                }
                            } else {
                                fs.unlinkSync('./assets/projects/docs/' + req.body.document);
                                fs.unlinkSync('./assets/projects/images/' + req.body.image);
                            }

                            return res.json({ success: true, data: { msg: 'Project updated with success' } });
                        } catch (err) {
                            console.error(err)
                        }
                    } else {
                        return res.json({ success: true, data: { msg: 'Project updated with success' } });
                    }
                }
            });
        }
    });
});

// route to delete a project
router.post('/delete/:id', crypto.veryfyDecryption, authentication.authenticated, (req, res, next) => {
    // verify the token
    jwt.verify(req.token, config.secret, async function (err, data) {
        if (err) {
            return next(err);
        } else {
            // update on a success 
            await Projects.deleteOne({ _id: req.params.id }, (err, project) => {
                if (err) {
                    return next(err);
                } else if (!project) {
                    return res.json({ success: true, data: { msg: 'Project does not exist' } });
                } else {
                    return res.json({ success: true, data: { msg: 'Project deleted with success' } });
                }
            });
        }
    });
});

// route the download pdf file
router.post('/file', async (req, res, next) => {
    try {
        await res.sendFile(path.join(__dirname, `../assets/projects/docs/${req.body.fname}`));
    } catch (error) {
        next(error)
    }
});

module.exports = router;