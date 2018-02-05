if(process.env.NODE_ENV === 'production'){
	module.exports = {
		mongoURI: 'mongodb://loremepsum:loremepsum73@ds225078.mlab.com:25078/urlshorteneryes'
	}
} else{
	module.exports = {
		mongoURI: 'mongodb://localhost/shortUrls'
	}
}