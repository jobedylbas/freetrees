const express = require('express');
const path = require('path');
const routes = express.Router();


routes.get('/', function(req, res){
	res.render("index");
});

routes.post('/busca', function(req, res){
	res.json({map: "/busca"});
});

routes.get('/download', function(req, res){
	res.render('download');
});

routes.get('/about', function(req, res){
	res.render('about');
});

routes.get('/stats', function(req, res){
	res.render('stats');
});

routes.get('/contact', function(req, res){
	res.render('contact')
})

module.exports = routes;