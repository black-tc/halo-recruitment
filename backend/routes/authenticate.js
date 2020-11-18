
module.exports.authenticated = function (req, res, next) {
    const bearerHeader = req.headers['authorization']; // getting the bearer header
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        return res.sendStatus(403);
    }
}

