const express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	bodyParser = require('body-parser');

app = express();

const config = require(path.resolve(path.join(__dirname,'server','config.js'))),
	routes = require(path.resolve(path.join(__dirname,'server','router.js')));

app.set('view engine', 'ejs');

app.set('views', path.resolve(path.join(__dirname, 'views')));
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(favicon(path.join(__dirname, 'public', 'img','favicon.ico')));

app.use('/', routes);

app.listen(config.port);
console.log("server online");