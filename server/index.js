const express = require('express');
const bodyParser = require('body-parser');
const MongoDB = require('./mongo');
const Routes = require('./Routes');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

app.use(function(req, res, next) {
	const origin = req.headers.origin;

	res.header('Access-Control-Allow-Origin', origin);
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");

	next();
});

const mongo = new MongoDB();
mongo.init();

const router = new Routes({ app, mongo });
router.init();

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);