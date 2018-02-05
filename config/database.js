if(process.env.NODE_ENV === 'production'){
	module.exports = {
		mongoURI: 'mongodb://debbie:debbie123@ds125068.mlab.com:25068/urlshortenermicroservice'
	}
} else{
	module.exports = {
		mongoURI: 'mongodb://localhost/shortUrls'
	}
}