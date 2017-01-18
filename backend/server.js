var express = require('express');
app = express(),
port = 3000,
routes = require('./api/routes/index.js'),
bodyParser = require('body-parser'),

allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
};

app.use(allowCrossDomain);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

//routes
app.use('/api', routes);

app.listen(port, function() {
  console.log("✔ Express server listening on port %d", port);
});