'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const axios = require('axios');

const port = process.env.PORT || 3002;

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('Welcome to my server!');
});

app.get('/weather', async (req, res, next) => {
  try {
    // keywords
    const lat = req.query.lat;
    const lon = req.query.lon;

    // axios call
    let weatherData = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&units=i&days=5`);
    console.log(weatherData);


    const weatherObj = new CityWeather(weatherData);
    console.log(weatherObj.data.data);
    const arrayToGroom = weatherObj.data.data.map(day => {
      return ({
        date: day.datetime,
        description: `Low of ${day.low_temp}F, high of ${day.high_temp}F, with ${day.weather.description}`
      });
    });
    const dataToSend= {
      description: arrayToGroom

    };
    res.status(200).send(dataToSend);
  } catch (error) {
    console.log(error);
    next(error);
  }
});



class CityWeather {
  constructor(cityData) {
    this.data = cityData.data;
  }
}


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
