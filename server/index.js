const express = require('express');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const path = require('path');

const http = require('http')
let server = http.createServer(app);


// initialize db
require("./loaders/dbInitializer").initialize();

// initialize sms service
require("./loaders/initializeSMS");


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//set static folder
app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://sola-parchi-dhap.herokuapp.com"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true)
    next()
})


const apis = require("./controllers/routes");
app.use('/api', apis);

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public') + '/index.html');
});


// app.get('/api', (req, res) => res.send('Hello World!'));


// app.get('/', function (req, res, next) {
//     res.sendFile(path.join(__dirname, '/public') + '/index.html');
// });



server.listen(port, () => console.log(`Example app listening on port ${port}!`))