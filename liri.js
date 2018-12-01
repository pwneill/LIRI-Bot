require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");

var fs = require("fs");

var inquirer = require("inquirer");

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var moment = require("moment");

var songQuery = "";

var movieQuery = "";

var bandQuery = "";

var newLine = "\n ---------------------------------------\n";

var input = "";

function selection() {
  inquirer
    .prompt([
      {
        type: "list",
        message:
          "Welcome to LIRI Bot! Please select one of the following options",
        choices: [
          "spotify-this-song",
          "concert-this",
          "movie-this",
          "do-what-it-says"
        ],
        name: "app"
      }
    ])
    .then(function(answers) {
      if (answers.app === "do-what-it-says") {
        doRandom();
        return;
      } else {
         app = answers.app;
        inquirer
          .prompt([
            {
              message: "What would you like to search?",
              name: "input"
            }
          ])
          .then(function(response) {
            input = response.input;
            appSelect(app);
          });
      }
    });
}

function appSelect(app) {
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

// // checks to see if input is null and assigns a default value if it is
function checkInput() {
  if (input) {
    songQuery = input;
    movieQuery = input;
    bandQuery = input;
  } else {
    songQuery = "The Sign Ace of Base";
    movieQuery = "Mr. Nobody";
    bandQuery = "Pixies";
  }
}

function timestamp() {
  var time = moment()
    .local()
    .format("MM/DD/YYYY HH:mm");
  var timeStamp = String(
    "\n Search Time: " + time + "\n" + " Search Parameter: " + input
  );

  fs.appendFileSync("./log.txt", timeStamp, function(err) {
    if (err) throw err;
  });
}

function logEntry(entry) {
  var newEntry = Object.values(entry);
  newEntry = String(newEntry).replace(/,/g, " ");

  fs.appendFileSync("./log.txt", newLine, function(err) {
    if (err) throw err;
  });
  fs.appendFileSync("./log.txt", newEntry, function(err) {
    if (err) throw err;
  });
  fs.appendFileSync("./log.txt", newLine, function(err) {
    if (err) throw err;
  });
  console.log("Your data was written to file!");
}

function bandsInTownAPI() {
  timestamp();

  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        bandQuery +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      response.data.forEach(function(result) {
        var concert = result.venue;
        var date = moment(result.datetime).format("MM/DD/YYYY");

        var concertEntry = {
          Venue: " Venue: " + concert.name,
          Location:
            "\n " +
            concert.city +
            " " +
            concert.region +
            " " +
            concert.region +
            " " +
            concert.country,
          Date: "\n " + date
        };

        logEntry(concertEntry);

        console.log(
          newLine +
            concertEntry.Venue +
            concertEntry.Location +
            concertEntry.Date +
            newLine
        );
      });
    });
}

function spotifyAPI() {
  timestamp();

  spotify
    .search({
      type: "track",
      query: songQuery,
      limit: 1
    })
    .then(function(response, err) {
      if (err) console.log(err);
      var songArr = response.tracks.items[0];

      var songEntry = {
        Artist: " Artist: " + songArr.artists[0].name,
        Song_Name: "\n" + " Song Name: " + songArr.name,
        Preview_URL: "\n" + " Preview: " + songArr.preview_url,
        Album: "\n" + " Album: " + songArr.album.name
      };

      logEntry(songEntry);

      console.log(
        newLine +
          songEntry.Artist +
          songEntry.Song_Name +
          songEntry.Preview_URL +
          songEntry.Album +
          newLine
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

      var movieEntry = {
        Title: " Title: " + movie.Title,
        Year: "\n" + " Year: " + movie.Year,
        IMDB_Rating: "\n " + movie.Ratings[0].Value + "(IMDB)",
        Rotten_Tomatoes_Rating:
          "\n " + movie.Ratings[1].Value + " (Rotten Tomatoes)",
        Filmed_in: "\n Filmed in: " + movie.Country,
        Summary: "\n Summary: " + movie.Plot,
        Actors: "\n Starring: " + movie.Actors
      };

      timestamp();
      logEntry(movieEntry);

      console.log(
        newLine +
          movieEntry.Title +
          movieEntry.Year +
          movieEntry.IMDB_Rating +
          movieEntry.Rotten_Tomatoes_Rating +
          movieEntry.Filmed_in +
          movieEntry.Summary +
          movieEntry.Actors +
          newLine
      );
    });
}

function doRandom() {
  var randomArr = [];
  fs.readFile("./random.txt", "utf8", function(err, data) {
    if (err) {
      throw err;
    } else {
      randomArr = data.split(",");
      input = randomArr[1];
      app = randomArr[0]
      appSelect(app);
    }
  });
}

selection();
