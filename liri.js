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

var newLine = "\n ---------------------------------------\n";

function userApp(userInput) {
  // writeLog();
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

// Checks to see if a log already exists and creates one if it doesn't
// function writeLog() {
//   fs.stat("./log.txt", function(err) {
//     if (err) {
//       console.log("No log exists. Writing log...");
//       fs.writeFile("log.txt", err, function() {
//         console.log("The file has been created");
//       });
//     }
//   });
// }

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

function timestamp () {

  var time = moment().local().format("MM/DD/YYYY HH:mm")
  var timeStamp = String("\n Search Time: " + time + "\n" + " Search Parameter: " + input)

  fs.appendFileSync("./log_file/log.txt", timeStamp, function(err) {
    if (err) throw err;
  });
}

function logEntry(entry) {
  var newEntry = Object.values(entry);
  newEntry = String(newEntry).replace(/,/g, " ");

  fs.appendFileSync("./log_file/log.txt", newLine, function(err) {
    if (err) throw err;
  });
  fs.appendFileSync("./log_file/log.txt", newEntry, function(err) {
    if (err) throw err;
  });
  fs.appendFileSync("./log_file/log.txt", newLine, function(err) {
    if (err) throw err;
  })
  console.log("Your data was written to file!");
}

function bandsInTownAPI() {

  timestamp()

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

        var concertEntry = {
          Venue: " Venue: " + concert.name,
          Location:
          "\n " +
          concert.city + " " +
          concert.region + " " +
          concert.region + " " +
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

  timestamp()

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
      
      timestamp()
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
      userApp(randomArr[0]);
    }
  });
}

userApp(app);
