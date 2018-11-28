require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var moment = require("moment");

var app = process.argv[2];

var input = process.argv[3];

var songQuery = "";

var movieQuery = "";

function userApp() {
  checkInput();

  switch (app) {
    case "spotify-this-song":
      spotifyAPI();
      break;
    case "concert-this":
      bandsInTownAPI();
      break;
    case "movie-this":
      omdbAPI();
      break;
  }
}

function bandsInTownAPI() {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        input +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      response.data.forEach(function(result) {
        var concert = result.venue;
        var date = moment(result.datetime).format("MM/DD/YYYY");
        console.log(
          "\n ---------------------------------------\n" +
            "Venue: " +
            concert.name +
            "\n" +
            "Location: " +
            concert.city +
            " " +
            concert.region +
            " " +
            concert.country +
            "\n" +
            "Date: " +
            date +
            "\n ---------------------------------------\n"
        );
      });
    });
}

// checks to see if input is null and assigns a default value if it is
function checkInput() {
  if (input) {
    songQuery = input;
    movieQuery = input;
  } else {
    songQuery = "The Sign Ace of Base";
    movieQuery = "Mr. Nobody";
  }
}

function spotifyAPI() {
  spotify
    .search({
      type: "track",
      query: songQuery,
      limit: 1
    })
    .then(function(response, err) {
      if (err) console.log(err);
      var songArr = response.tracks.items[0];
      console.log(
        "\n ---------------------------------------\n" +
          "Artist: " +
          songArr.artists[0].name +
          "\n" +
          "Song Name: " +
          songArr.name +
          "\n" +
          "Spotify Preview: " +
          songArr.preview_url +
          "\n" +
          "Album: " +
          songArr.album.name +
          "\n ---------------------------------------\n"
      );
    });
}

function omdbAPI() {
  axios
    .get(
      "http://www.omdbapi.com/?t=" +
        movieQuery +
        "&y=&plot=short&apikey=trilogy"
    )
    .then(function(response) {
      var movie = response.data;
      console.log(
        "\n ---------------------------------------\n" +
          "Title: " +
          movie.Title +
          "\n" +
          "Year: " +
          movie.Year +
          "\n" +
          "IMDB Rating: " +
          movie.Ratings[0].Value +
          "\n ---------------------------------------\n"
      );
    });
}

userApp();

// This will output the following information to your terminal/bash window:

// ```
//   * Title of the movie.
//   * Year the movie came out.
//   * IMDB Rating of the movie.
//   * Rotten Tomatoes Rating of the movie.
//   * Country where the movie was produced.
//   * Language of the movie.
//   * Plot of the movie.
//   * Actors in the movie.
// ```
