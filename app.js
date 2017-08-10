var bodyParser = require('body-parser');
var express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

var user = require('./routes/user');
var patient = require('./routes/patient');
var test = require('./routes/test');

app.use('/user', user);
app.use('/patient', patient);
app.use('/test', test);

app.get('/', function(req, res, next){
    res.json('INVALID ENDPOINT');
})

app.listen(port, function(){
    console.log('Server started on port: ' + port);
})

