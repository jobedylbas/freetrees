const express = require('express');
const path = require('path');
const routes = express.Router();


routes.get('/', function(req, res){
	res.render("index");
});

module.exports = routes;