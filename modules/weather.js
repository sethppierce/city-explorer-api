'use strict';

const axios = require('axios');


async function getWeather(req, res, next){
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
}

class CityWeather {
  constructor(cityData) {
    this.data = cityData.data;
  }
}

module.exports = getWeather;
