const express = require('express'),
	path = require('path'),
	nodemailer = require('nodemailer'),
	routes = express.Router();

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
});

routes.post('/contact', function(req, res){
	
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'xxx@xx.com',
			pass: 'xxx'
		}
	});
	
	let mailOptions = {
		from: req.body.from,
		subject: req.body.subject,
		text: req.body.message,
	};

	transporter.sendMail(mailOptions, (error, info)=>{
		if(error){
			res.render('contact');
		}
		else{
			res.render('contact');
		}
	});
});


module.exports = routes;