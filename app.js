/* let apiKey = {
  "Application name": "Trill",
  "API key": "b8c9f662a983905faafe02bc920630da",
  "Shared secret": "7d654ffebe42ef21e96d5cb2f95bb6a6",
  "Registered to": "ajaydubey541997"
} */


// const fs = require('fs');
// const http = require('http');
// const requests = require('requests');
// const fetchFromApi = require('./controllers/fetchFromApi');



const express = require('express');
const callRoutes = require('./routes/call');
const errorController = require('./controllers/error');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(callRoutes);

// 404
app.use(errorController.get404)


app.listen(3000);