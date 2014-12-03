var express = require('express');
var bodyParser = require('body-parser');
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


app.listen(3000);