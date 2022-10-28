'use strict';

const axios = require('axios');

let cache = require('./cache.js');

async function getWeather(req, res, next){
  try {
    // keywords
    const lat = req.query.lat;
    const lon = req.query.lon;

    //Key
    let key = 'weather-' +lat + lon;
    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
      console.log('Cache hit');
      res.status(200).send(cache[key].description);
    } else {
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
      cache[key]= {
        description: arrayToGroom,
        timestamp: Date.now()
      };
      res.status(200).send(cache[key].description);
    }
    // axios call
  } catch (error) {
    console.log(error);
    next(error);
  }

}

class CityWeather {
  constructor(cityData) {
    this.data = cityData.data;
  }
}

module.exports = getWeather;
