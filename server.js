'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3002;
const getMovies = require('./modules/movies');
const weather = require('./modules/weather');
const app = express();

app.get('/weather', weatherHandler);
app.get('/movies', getMovies);

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to my server!');
});

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  weather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

app.get('*', (req, res) => {
  res.status(404).send('This route is not found');
});

app.use((e, req, res, next) => {
  res.status(500).send(`${req.query.city_name} not found!!!
  ${e}`);
});


app.listen(PORT, () => console.log(`Server up on ${PORT}`));
