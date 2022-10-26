'use strict';

const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
let weatherData = require('./data/weather.json')

const port = process.env.PORT || 3002

pp.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



/* MIDDLEWARE */

app.use(cors());

app.get('/', function (req, res) {
  res.render('index', {});
});


/* PATHS */
app.get('/weather', (req, res, next) => {
  
  try {
    const { lat, lon, ...rest} = req.query
    console.log(lat)
    const cityName = req.query?.city_name
    const dataToGroom = weatherData.find(city => {
      return Math.floor(city?.lat) === Math.floor(lat) && Math.floor(city?.lon) === Math.floor(lon)
    }


    )
    const dataObject = new Forecast(dataToGroom);
    console.log(dataObject)
    const arrayToGroom = dataObject.data.map(day => {
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
    // if I have an error, this will create a new instance of the Error Object that lives in Express
    next(error);
  }
});




// app.get('*', (req, res) => {
//   res.status(404).send('This route does not exist');
// });


class Forecast {
  constructor(cityData) {
    this.data = [...cityData.data]
    this.lon = cityData.lon
    this.lat = cityData.lat
  }
}


/* ERROR HANDLE */

app.use((e, req, res, next) => {
  res.status(500).send(`${req.query.city_name} was not found!
  ${e}`);
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})