'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
let weatherData = require('./data/weather.json');
const app = express();

const port = process.env.PORT || 3002

app.use(cors());

app.get('/', (req, res)  => {
  res.status(200).send('Welcome to my server!');
});


app.get('/weather', (req, res, next) => {
  
  try {
    const { lat, lon, ...rest} = req.query
    const cityName = req.query?.city_name
    const dataToGroom = weatherData.find(city => {
      return Math.floor(city?.lat) === Math.floor(lat) && Math.floor(city?.lon) === Math.floor(lon)
    })
    
    const weatherObj = new CityWeather(dataToGroom);
    const arrayToGroom = weatherObj.data.map(day => {
      return ({
        date: day.datetime,
        description: `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`
      })
    })
    const dataToSend = {
      description: arrayToGroom
    }
    res.status(200).send(dataToSend);
  } catch (error) {
    next(error);
  }
});



class CityWeather {
  constructor(cityData) {
    this.lon = cityData.lon
    this.lat = cityData.lat
    this.data = [...cityData.data]
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
  console.log(`Listening on port ${port}`)
})