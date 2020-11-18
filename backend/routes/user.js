const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('../config/crypto');
const config = require('../config/database');
// rotues
router.post('/register', async (req, res, next) => {
    let user = new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        company: req.body.company,
        Email: req.body.Email,
        Cell: req.body.Cell,
        Password: req.body.Password
    });

    // add user
    await User.addUser(user, (err, user) => {
        try{
        if (err) {
            next(err);
        }
        return res.json({ type: 'response', data: { success: true, msg: 'User successfully registered' } });
    
    }
    catch (error){
        console.log(err)
    }
});
});

// rotues
router.post('/login', async (req, res, next) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }

    await User.getUserByUsername(user.username, async (err, userdata) => {
        console.log(user.username)
        console.log(user.password)
        if (err) return next(err);
        // await User.getUserByUsername(user.username,  (err, userdata) => {
        //     if (err) return next(err);
          User.comparePassword(user.password, userdata.Password, (err, match) => {
            if (err) {
                return next(err);
            } else if (match) {
                const token = jwt.sign({ userdata }, config.secret, {
                    //1 wek in seconds this to force the use to log in after every week, that is when the token
                    //gets expired
                    expiresIn: "2h"
                });

                let encryptedToken = `${crypto.randomValues()}${crypto.encrypt(token)}`;

                // console.log(randomValues(), `ENCRYPTED ${encryptedToken}`, `TOKEN HERE ${token}`);

                // return res.json({ success: true, data: encryptedToken });
                return res.json({
                    success: true,
                    token: token,
                    user: {
                        // id: user._id,
                        username: userdata.username,
                        
                        office: userdata.location,
                       
                    }
                });

            } else {
                return res.json({ success: false, data: { msg: 'Wrong password ' } });
            }

        });
    });
// });
});

//email validation 
router.post("/Email", (req, res, next) => {

    User.getEmail(req.body.email, (err, user) => {
        if (err) {
            res.status(500).json({ success: false, err: err });
        } else if (!user) {
            res.status(200).json({ success: true, match: false, });
        } else if (user) {
            res.status(200).json({ success: true, match: true });
        }
    });
});

module.exports = router;