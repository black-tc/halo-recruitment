const Vacancy = require('../models/vacancies');
const Appplication = require('../models/jobApplications');
const router = require('express').Router();
const crypto = require('../config/crypto');
const config = require('../config/database');

// route to add a new vacancy
router.post('/add', (req, res, next) => {
    const vacancy = new Vacancy({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        duties: req.body.duties,
        where: req.body.where,
        image: req.body.imageurl,
        contact: req.body.contact,
        posted_date: req.body.posted_date

     
    });

    // add on a success 
    vacancy.save(vacancy, (err, vacancy) => {
        if (err) return res.sendStatus(400).json({ success: false, data: err });
            console.log(err)
        return res.json({ success: true, data: { msg: 'Vacancy successfully saved' } })
    });

});

// route to get all vacancies
router.get('/get-all', (req, res, next) => {
    Vacancy.find({}, (err, vacancy) => {
        if (err) return res.sendStatus(400).json({ success: false, data: err });
        return res.json({ success: true, data: vacancy });
    });
});

// route to add an application
router.post('/create-app', (req, res, next) => {
    const application = new Appplication({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        cv: req.body.cv,
        comments: req.body.comments,
        date_applied: req.body.date_applied,
        job: req.body.job

     
    });

    // add on a success 
    application.save(application, (err, application) => {
        if (err) return res.sendStatus(400).json({ success: false, data: err });
            console.log(err)
        return res.json({ success: true, data: { msg: 'Application successfully saved' } })
    });

});

    // route to get all applications
    router.get('/get-apps', (req, res, next) => {
        Appplication.find({}, (err, applications) => {
            if (err) return res.sendStatus(400).json({ success: false, data: err });
            return res.json({ success: true, data: applications }); 
        });
    });

module.exports = router