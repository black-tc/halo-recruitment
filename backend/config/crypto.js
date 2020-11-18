'use strict';
const crypto = require('crypto');

const ENCRYPTION_KEY = 'MYEYttFOAstAghAAAAzBHgJUOgsCWEsR'; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16


const arrayLetters = ["HXxD", "DXsw", "eSWw", "ESGd", "sFCs", "WFZZ", "ZZgd", "DEGS", "DGSW", "DHHH", "Gsgs"];




// function uploadMulter(req, res, next) {
//      upload.single('profile_image');
//      next();
// }

// function that will generate a randon number and concat it with letters
function randomValues() {
    // getting a random value from the array
    const randomFromArray = arrayLetters[Math.floor(Math.random() * arrayLetters.length) + 0];
    // generating a random number between zero and 50000
    const number = Math.floor(10000 + Math.random() * 50000);
    // return the values
    return `${randomFromArray}${number}`;
}


function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');

}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();

}

//route to dicrypt the token
async function veryfyDecryption(req, res, next) {
    // get the data
    const data = req.body.token;

    if (data !== undefined && data !== null) {
        // get the random values
        let encrypToken = '';
        // get the random value
        let ranVal1 = '';
        await data
            .split('')
            .forEach((value, i) => {
                if (i < 9) {
                    return ranVal1 += value;
                } else {
                    return encrypToken += value;
                }
            });
        // substring from the ranVal1
        const ranVal2 = await ranVal1.substr(0, 4);
        // filtering the value from the array
        const word = arrayLetters.filter(val => val === ranVal2);
        // meking the filter function ruturned a valid result
        if (word.length !== 0 && word !== undefined) {
            // atach the con
            req.headers.authorization = 'Bearer ' + decrypt(encrypToken);
            next();
        } else {
            // send a forbiden status, this guy tryna hack ? 😏😏😏
            return res.sendStatus(403);
        }
    } else {
        return res.sendStatus(500).json({success: false, msg: 'not token provided'});
    }

}

module.exports = { decrypt, encrypt, randomValues, veryfyDecryption };