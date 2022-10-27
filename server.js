'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');
const port = process.env.PORT || 3002;

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to my server!');
});

app.get('/weather', getWeather);

app.get('/movies', getMovies);


//  Errors

app.get('*', (req, res) => {
  res.status(404).send('This route is not found');
});

app.use((e, req, res, next) => {
  res.status(500).send(`${req.query.city_name} not found!!!
  ${e}`);
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
