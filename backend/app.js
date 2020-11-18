// const Joi = require('joi'); // for input validation
const cors = require('cors'); // for input validation
const express = require('express'); // the express engine
const path = require('path'); // path to accres path in the seystem
const bodyParser = require('body-parser'); // the body parser to parse the request
const mongoose = require('mongoose'); // mongoose engine to connecto to the databse
const config = require('./config/database'); // the database configuration
const app = express(); // the actual app
// const passport = require('passport'); // passport for authentication purposes
// const csp = require(`helmet-csp`);

// the pa 

// using the enviroment port of the 5200 as defult
const port = process.env.PORT || 5200;

// use mogoose
try {
    // //connect to the mongo database
    mongoose.connect(config.database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
        .catch(error => console.log(error));
} catch (error) {
    console.log(error)
}

// check if we are connect 
mongoose.connection.on('connected', () => {
    console.log('connected to mongo database');
});

//eching if ther are any erros
mongoose.connection.on('error', (err) => {
    console.log(`connection failed, reason being, ${err}`);
});

// use body parser 
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json());




// making some folder publicly accesable
app.use('/static', express.static('./assets/partners/images/'));
app.use('/static', express.static('./assets/team/images/'));
app.use('/static', express.static('./assets/projects/images/'));
app.use('/static', express.static('./assets/docs/'));
//use npm cors middleware
app.use(cors());

// routes here
//declaring the users route
// const authentication = require('./routes/authenticate');

// require users file
const user = require('./routes/user');
// require users file
const terms = require('./routes/terms');
// team route
const team = require('./routes/team');
// project route
const projects = require('./routes/projects');
// parterns route
const partners = require('./routes/partners');
// applications route
const applications = require('./routes/applications');
// vacancies route
const vacancies = require('./routes/vacancies');

// use users route
app.use('/user', user);
// use trems route
app.use('/terms', terms);
// 
app.use('/team', team);

app.use('/applications', applications);

app.use('/partners', partners);

app.use('/projects', projects);

app.use('/vacancies', vacancies);



//start server
app.listen(port, () => {
    console.log(`SERVER STARTED ON PORT :: ${port}`);
});