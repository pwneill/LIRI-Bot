require("dotenv").config();

var keys = require("./keys.js");

var axios = require("axios");

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var moment = require("moment")

var app = process.argv[2];

var input = process.argv[3];


function userApp() {
  switch (app) {
    case "spotify-this-song":
      spotifyAPI();
      break;
    case "concert-this":
      bandsInTownAPI();
      break;
  }
}

function bandsInTownAPI() {
  concertArr = []
  axios
  .get("https://rest.bandsintown.com/artists/"+input+"/events?app_id=codingbootcamp").then(
    function(response) {
      response.data.forEach(function(concert) {
        concertArr.push(concert)
        console.log(concertArr.length)
      })
    }
  );
  
  // This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:

  //    * Name of the venue

  //    * Venue location

  //    * Date of the Event (use moment to format this as "MM/DD/YYYY")
}

function spotifyAPI() {
  var songQuery = "";
  if (input) {
    songQuery = input;
  } else {
    songQuery = "The Sign Ace of Base";
  }

  spotify
    .search({
      type: "track",
      query: songQuery,
      limit: 1
    })
    .then(function(response, err) {
      if (err) console.log(err);
      var songArr = response.tracks.items[0];
      console.log(songArr);
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
userApp()
