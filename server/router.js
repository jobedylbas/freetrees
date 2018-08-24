const express = require('express'),
	path = require('path'),
	nodemailer = require('nodemailer'),
	routes = express.Router(),
	DB = require(path.resolve(path.join(__dirname, '..', 'db', 'dbConnection'))),
	config = require(path.resolve(path.join(__dirname, 'config.js')));

routes.get('/', function(req, res){
	res.render('index');
});

routes.post('/busca', function(req, res){
	res.json({map: '/busca'});
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
	
	const transporter = nodemailer.createTransport({
	    host: 'smtp.ethereal.email',
	    port: 587,
	    secure: false,
	    auth: {
	        user: 'wbvn3gi6by4xk6f5@ethereal.email',
	        pass: 'HjY31nvE5KEwg3qVff'
	    }
	});
	
	let mailOptions = {
		from: req.body.from,
		to: 'jobe.dylbas@gmail.com',
		subject: req.body.subject,
		text: req.body.message,
	};
	transporter.verify(function(err, success) {
		if(err){
			console.log(err);
		}
		else{
			transporter.sendMail(mailOptions, (error, info)=>{
				if(error){
					console.log(error);
				}
				else{
					console.log('email sent');
				}
			});
		}
		res.render('contact');
	});
})	

routes.get('/get_trees', function(req, res){
	let db = new DB;
	db.connect(config.defaultUri, config.defaultDatabase)
	.then(
		function(){
			return db.getAllData(config.defaultCol);
		}
	)
	.then(
		function(docs){
			return {
				'success': true,
				'trees': docs,
				'error': ''
			};
		},
		function(error){
			console.log(error);
			return {
				'success': false,
				'trees': null,
				'error': error
			}; 
		}
	)
	.then(
		function(result){
			db.close();
			res.send(result);
		}
	)

});


routes.get('/chart_data', function(req, res){
	let db = new DB;
	db.connect(config.defaultUri, config.defaultDatabase)
	.then(
		function(){
			return db.mostFreqPlants(config.defaultCol);
		}
	)
	.then(
		function(count){
			return {
				'success': true,
				'list': count,
				'error': ''
			};
		},
		function(error){
			console.log(error);
			return {
				'success': false,
				'list': 0,
				'error': error
			}
		}
	)
	.then(
		function(result){
			db.close();
			res.send(result);
		}
	)
});


module.exports = routes;