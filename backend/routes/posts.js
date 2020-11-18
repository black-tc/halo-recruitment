const crypto = require('../config/crypto');
const config = require('../config/database');

// route to add an application
router.post('/add', (req, res, next) => {
    const application = new Application({
        fnames: req.body.fnames,
        surname: req.body.surname,
        category: req.body.category,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone
    });

    // add on a success 
    application.save(application, (err, application) => {
        if (err) return res.sendStatus(400).json({ success: false, data: err });
            console.log(err)
        return res.json({ success: true, data: { msg: 'Application saved with success' } })
    });

});