var express 	= require('express'),
	app 		= express(),
	port 		= 3000,
	routes 		= require('./api/routes/index.js'),
	bodyParser 	= require('body-parser'),
	multer  	= require('multer'),

allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, token");
  next();
};

app.use(allowCrossDomain);
// parse application/json
app.use(bodyParser.json({limit: '50mb'}));
// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/json'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended : true}));

//static folder (files)
app.use(express.static('public'));

//routes

app.use('/api', routes);

app.listen(port, function() {
  console.log("✔ Express server listening on port %d", port);
});