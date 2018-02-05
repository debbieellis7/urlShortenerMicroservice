const express = require('express');
const mongoose = require('mongoose');




// Rquire Mongoose Model
const shortUrl = require('./models/shortUrl');

const app = express();


// Database Config
const db = require('./config/database'); 

// Connect to mongoose
mongoose.connect(db.mongoURI, {

})
	.then(() => {
		console.log('MongoDB Connected..');
	})
	.catch(err => console.log(err));




// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');


// Allows node to find static content
app.use(express.static(__dirname +'/public'));


// New Route
app.get('/new/:origUrl(*)', (req, res, next) => {

	const origUrl = req.params.origUrl;

	const regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

	var short= Math.floor(Math.random()*1000000).toString();


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

		return res.json({ original_url: origUrl, short_url: `https://boiling-forest-38085.herokuapp.com/${short}` });
	} 
	
	return res.json({ error: "Wrong url format, make sure you have a valid protocol and real site." });
	

});


app.get('/:numLink', (req, res) => {
	const numLink = req.params.numLink;

	shortUrl.findOne({'shorterUrl': numLink}, (err, data) => {
		if(err){
			console.log("an error in database connection finding shortUrl");
		}
		var l = data.originalUrl;

		if(l.indexOf("http") == -1){l = "http://"+l}
			res.redirect(l);
	});

	return res.json({ error: "This url is not on the database." });

});



app.listen(process.env.PORT || 5000, () => {
	console.log('Server is running on port 5000');
});