const express = require('express');
const mongoose = require('mongoose');


const app = express();

// Rquire Mongoose Model
const shortUrl = require('./models/shortUrl');


// Database Config
const db = require('./config/database'); 

// Connect to mongoose
mongoose.connect(db.mongoURI, {

})
	.then(() => {
		console.log('MongoDB Connected..');
	})
	.catch(err => console.log(err));



// Allows node to find static content
app.use(express.static(__dirname +'/public'));


// New Route
app.get('/new/:origUrl(*)', (req, res, next) => {

	const origUrl = req.params.origUrl;

	const regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

	var short= Math.floor(Math.random()*1000000).toString();

	const fusionURL = `glacial-reef-53856.herokuapp.com/${short}`;

	if(regex.test(origUrl)===true){
		var data = new shortUrl({
			originalUrl: origUrl,
			shorterUrl: short
		});

		data.save(err => {
			if(err){
				return res.send('Error saving to database');
			}
		});

		return res.json({original_url: origUrl, short_url: fusionURL });
	} else{
		return res.json({error: "Wrong url format, make sure you have a valid protocol and real site."})
	}

});


app.get("/:short", (req, res) => {

	const short = req.params.short;

	shortUrl.findOne({'shorterUrl': short}, (err, data) => {
			if(err){
				return res.send('Error reading database');
			}
			var l = data.originalUrl;

			if(l.indexOf("http") == -1){
				l = "http://"+l;
				res.redirect(l);
			}
	
		})

});









app.listen(process.env.PORT || 5000, () => {
	console.log('Server is running on port 5000');
});