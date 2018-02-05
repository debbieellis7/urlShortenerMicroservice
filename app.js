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



// Allows node to find static content
app.use(express.static(__dirname +'/public'));


// New Route
app.get('/new/:origUrl(*)', (req, res, next) => {

	const origUrl = req.params.origUrl;

	//const regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;


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

		return res.json({ original_url: origUrl, short_url: `http://localhost:5000/${short}` });
	} 
	
	return res.json({ error: "Wrong url format, make sure you have a valid protocol and real site." });
	

});


app.get('/:numLink', (req, res) => {
	var numLink = req.params.numLink;

	shortUrl.findOne({"shorterUrl": numLink}, (err, data) => {
		if(err) throw err;

		if(data){
			res.redirect(data.originalUrl);
		}
		//var re = new RegExp("^(http|https)://", "i");
		//var stringToCheck = data.originalUrl;

		//if(re.test(stringToCheck)){
		//	
		//} else{
		//	res.redirect('http://' + data.originalUrl);
		//}
	});


});



app.listen(process.env.PORT || 5000, () => {
	console.log('Server is running on port 5000');
});