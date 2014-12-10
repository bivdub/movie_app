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
		// console.log(JSON.parse(body));
		if (JSON.parse(body).Response == 'False') {
			res.render('no_results');
		}
		if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);

			res.render('search', {stuff: data});
		}
	})

})

app.get('/movies/:id', function(req, res) {
	var id = req.params.id;
	request('http://www.omdbapi.com/?i='+id+"&tomatoes=true&", function(error, response, body) {
		// console.log(body);
		if (JSON.parse(body).Response == 'False') {
			res.render('error');
		} else if (!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			// console.log(data);
			var imdb = data.imdbID;
			db.movie.find({where: {imdb_code: imdb}}).then(function(movieInfo) {
				if (movieInfo!= null) {
					var commentId = movieInfo.dataValues.id;
				}
				console.log(commentId);
				db.comment.findAll({where: {movieId: commentId}}).then(function(comment) {
					console.log(comment);
					console.log(data);
					if (comment==[]) {
						res.render('movies',{data: data, comment:''});
					} else {
					res.render('movies', {data: data, comment: comment});
					}
				})
				// res.render('movies', {data: data, comment: ''});

			})
			// db.comment.findAll({where: {: comment.movieId}}).spread(function(comment, created) {
			// 	res.render('movies', {data: data, comment: comment});
			// 	if (!created) {
			// 		res.render('movies', data);
			// 	}
			// })
		}
	})
})


// app.post('/browse', function (req, res) {
// 	// console.log(req.body.imdbCode);
// 	imdbCode = req.body.imdbCode;
// 	db.movie.findOrCreate({where: {imdb_code: imdbCode}}).done(function (error, data, created) {
// 		if(created) {
// 			// console.log('here2');
// 			request('http://www.omdbapi.com/?i='+imdbCode, function(error, response, body) {
// 				if (!error && response.statusCode == 200) {
// 					var movieData = JSON.parse(body);
// 					data.title = movieData.Title;
// 					data.year = movieData.Year;
// 					data.save().done(function (error, data) {
// 						var data = db.movie.findAll().done(function(error, data) {
// 						res.render('browse', {data:data});
// 						})					
// 					})
// 				}
// 			})
// 		} else {
// 			// console.log(db);
// 			var data = db.movie.findAll().done(function(error, data) {
// 				res.render('browse', {data: data});
// 			})

// 		}
// 	})
// })

app.post('/browse', function (req, res) {

	db.movie.findOrCreate({where: {imdb_code: req.body.imdb_code}}).done(function (error, data, created) {
		if(created) {
			data.title = req.body.title;
			data.year = req.body.year;
			data.save().done(function (error, data) {
				var data = db.movie.findAll().done(function(error, data) {
					res.send({something:'ok'});
				})					
			})
		} else {
			console.log(db);
			var data = db.movie.findAll().done(function(error, data) {
				res.send({something:'ok'});
			})

		}
	})
})

app.post('/comment', function (req, res) {
	console.log('body', req.body);
	db.movie.findOrCreate({where: {imdb_code: req.body.imdbCode}}).spread(function(movie, created) {
		if(created) {
			movie.title = req.body.title;
			movie.year = req.body.year;
			movie.save().done(function (error, data) {
	  			movie.createComment({content: req.body.comment}).then(function(data) {
	    			res.render('comment', {something:'yay'});
	  			});
			})
		} else {
			movie.createComment({content: req.body.comment}).then(function(data) {
	    	res.render('comment', {something:'yay'});
	  		})
	  	}
	})
})

app.delete('/browse/:id', function (req, res) {

	db.movie.destroy({where: { id: req.params.id}}).then(function(data) {
		console.log('here');
		res.send({something: 'something'});
	})
});

app.get('/browse', function(req, res) {
	var data = db.movie.findAll().done(function(error, data) {
		res.render('browse', {data: data});
	})
})

app.listen(3000);