'use strict';

const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
let weatherData = require('./data/weather.json')

const port = process.env.PORT || 3002

app.use(cors());

app.get('/', (req, res)  => {
  res.status(200).send('Welcome to my server!');
});


app.get('/weather', (req, res, next) => {
  
  try {
    const { lat, lon, ...rest} = req.query
    console.log(lat)
    const cityName = req.query?.city_name
    const dataToGroom = weatherData.find(city => {
      return Math.floor(city?.lat) === Math.floor(lat) && Math.floor(city?.lon) === Math.floor(lon)
    }

    )
    const dataObj = new CityWeather(dataToGroom);
    console.log(dataObj)
    const arrayToGroom = dataObj.data.map(day => {
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