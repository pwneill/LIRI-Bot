require("dotenv").config();

var axios = require("axios");

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var input = process.argv[2];

var track = process.argv[3];

var songQuery = ''

function songSearch () {
  if (track) {
    songQuery = track
  } else {
    songQuery = "The Sign Ace of Base"
  }
}

songSearch()

if (input === "spotify-this-song") {
  spotify.search({ 
      type: "track", 
      query: songQuery,
      limit: 1 
    }).then(function(response, err) {
      if (err) console.log(err) 
      var songArr = response.tracks.items[0];
      console.log(songArr)
      console.log(
        "\n ---------------------------------------\n" +
        "Artist: "+songArr.artists[0].name+"\n"+
        "Song Name: "+songArr.name+"\n"+
        "Spotify Preview: "+songArr.preview_url+"\n"+
        "Album: "+songArr.album.name+
        "\n ---------------------------------------\n")
    })
}