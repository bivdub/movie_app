var express = require('express');
var bodyParser = require('body-parser');
var db = require('./models/index.js')
app = express();

var request = require('request');
// request('http://www.google.com', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body) // Print the google web page.
//   }
// })
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index');
})

app.get('/search', function(req, res) {
	var title = req.query.title;
	request('http://www.omdbapi.com/?s='+title, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);

			res.render('search', {stuff: data});
		}
	})

})

app.get('/movies/:id', function(req, res) {
	var id = req.params.id;
	request('http://www.omdbapi.com/?i='+id+"&tomatoes=true&", function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);

			res.render('movies', data);
		}
	})
})


app.post('/browse', function (req, res) {
	console.log(req.body.imdbCode);
	imdbCode = req.body.imdbCode;
	db.Movie.findOrCreate({where: {imdb_code: imdbCode}}).done(function (error, data, created) {
		console.log('created');
		if(created) {
			console.log('here2');
			request('http://www.omdbapi.com/?i='+imdbCode, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var movieData = JSON.parse(body);
					data.title = movieData.Title;
					data.year = movieData.Year;
					data.save().done(function (error, data) {
						var data = db.Movie.findAll().done(function(error, data) {
						res.render('browse', {data: data});
						})					
					})
				}
			})
		} else {
			console.log(db);
			var data = db.Movie.findAll().done(function(error, data) {
				res.render('browse', {data: data});
			})

		}
	})
})




app.get('/browse', function(req, res) {
	var data = db.Movie.findAll().done(function(error, data) {
		res.render('browse', {data: data});
	})
})

app.listen(3000);