require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");

var fs = require("fs");

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var moment = require("moment");

var app = process.argv[2];

var input = process.argv[3];

var songQuery = "";

var movieQuery = "";

function userApp(userInput) {
  checkInput();

  switch (userInput) {
    case "spotify-this-song":
      spotifyAPI();
      break;
    case "concert-this":
      bandsInTownAPI();
      break;
    case "movie-this":
      omdbAPI();
      break;
    case "do-what-it-says":
      doRandom();
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
          "\n" +
          "Rotten Tomatoes Rating: " +
          movie.Ratings[1].Value +
          "\n" +
          "Filmed in: " +
          movie.County +
          "\n" +
          "Plot summary:" +
          movie.Plot +
          "\n" +
          "Actors: " +
          movie.Actors +
          "\n ---------------------------------------\n"
      );
    });
}

function doRandom() {
  var randomArr = []
  fs.readFile("./random.txt", 'utf8', function(err, data) {
    if (err) {
      throw err;
    } else {
      randomArr = data.split(",")
      userApp(randomArr[0])
    }
  });
}

userApp(app);
