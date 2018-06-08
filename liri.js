require("dotenv").config();

var liriCommand = process.argv[2];

var searchTerm = process.argv.slice(3).join(" ");

var twitterCommand = "my-tweets";

var spotifyCommand = "spotify-this-song";

var movieCommand = "this-movie";

var fsCommand = "do-what-it-says";



function fsRead() {
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        for (var i = 0; i < dataArr.length; i++) {
            dataArr[i] = dataArr[i].trim();
        }

        runSpotify(dataArr[1]);

    });
}


function runMovie(searchTerm) {

    var request = require('request');

    request(`http://www.omdbapi.com/?apikey=trilogy&t=${searchTerm}`, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred

        var dataMovie = JSON.parse(body);

        console.log(`Title: ${dataMovie.Title}\n`);
        console.log(`Year: ${dataMovie.Year}\n`);
        console.log(`IMDB Rating: ${dataMovie.imdbRating}\n`);
        console.log(`Rotten Tomatoes Rating: ${dataMovie.Ratings[1].Value}\n`);
        console.log(`Country: ${dataMovie.Country}\n`);
        console.log(`Language: ${dataMovie.Language}\n`);
        console.log(`Plot: ${dataMovie.Plot}\n`);
        console.log(`Actors: ${dataMovie.Actors}\n`);

    });
};


function runSpotify(searchTerm) {
    var Spotify = require('node-spotify-api');

    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

    spotify.search({ type: 'track', query: searchTerm }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`Song: ${data.tracks.items[0].name}\n`);
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}\n`);
        console.log(`Album: ${data.tracks.items[0].album.name}\n`);
        console.log(`Preview link: ${data.tracks.items[0].preview_url}\n`);
    });
}


function runTwiiter() {
    var Twitter = require('twitter');

    var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    var params = { screen_name: 'UCI Liri App' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                // console.log(tweets);
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
                console.log(`----------------------------------------\n`)
            }
        }
    });
};


if (liriCommand == twitterCommand) {
    runTwiiter();
} else if (liriCommand == spotifyCommand) {
    if (searchTerm != "") {
        runSpotify(searchTerm);
    } else {
        runSpotify(`The Sign`);
    }
} else if (liriCommand == movieCommand) {
    if (searchTerm != "") {
        runMovie(searchTerm);
    } else {
        runMovie(`Mr Nobody`);
    }
} else if (liriCommand == fsCommand) {
    fsRead();
} else {
    console.log('Please enter valid command.')
}

