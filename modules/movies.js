'use strict';

const axios = require('axios');

let cache = require('./cache.js');


async function getMovies(req, res, next){
  try {
    // keywords
    const cityName = req.query.city_name;

    // Key
    let key = 'movies-' + cityName;
    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
      console.log('Cache hit');
      res.status(200).send(cache[key].data);
    } else {
    // axios call
      let movieData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${cityName}&include_adult=false`);
      console.log(movieData);
      let movieObj = new Movie(movieData);
      const arrayToGroom = movieObj.data.data.results.map(movie => {
        return ({
          title: movie.original_title,
          overview: movie.overview,
          averageVotes: movie.vote_average,
          totalVotes: movie.vote_count,
          img: movie.poster_path,
          popularity: movie.popularity,
          releaseDate: movie.release_date,
        });
      });
      cache[key]= {
        timestamp: Date.now(),
        data: arrayToGroom
      };
      res.status(200).send(cache[key].data);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

class Movie {
  constructor(movieData){
    this.data = movieData;
  }
}

module.exports = getMovies;
