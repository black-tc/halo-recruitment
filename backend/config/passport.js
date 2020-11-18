const pspStraregy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getByEmail, getById) {
    const authenticate = (email, password) => {
        getByEmail(async (email, result) => {
            if (result == null) return done(null, false, { message: 'Email provided does not exist in our system' });
            try {
                if (await bcrypt.compare(password, result.password)) {
                    return done(null, user);
                }
            } catch(e){
                done(e)
            }
        })
    }

    // using the local strategy from passport in the app
    passport.use(new pspStraregy({ usernameField: 'email' }, authenticate));
    // serialise the user session
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(
        null, getById(id)
    ));
}

module.exports = initialize;        