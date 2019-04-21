const express = require('express'),
	path = require('path'),
	nodemailer = require('nodemailer'),
	routes = express.Router(),
	DB = require(path.resolve(path.join(__dirname, '..', 'db', 'dbConnection'))),
	config = require(path.resolve(path.join(__dirname, 'config.js'))),
	rp = require('request-promise');

routes.get('/', function(req, res){
	res.render('index');
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

routes.get('/get-trees', function(req, res){
	let db = new DB;
	db.connect(config.defaultUri, config.defaultDatabase)
	.then(
		function(){
			return db.getAllLocations(config.locationsCol);
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


routes.get('/chart-data', function(req, res){
	let db = new DB;
	db.connect(config.defaultUri, config.defaultDatabase)
	.then(
		function(){
			return db.getFreqPlants(config.locationsCol);
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

routes.post('/g-popup-inf', function(req, res){
	let db = new DB;
	db.connect(config.defaultUri, config.defaultDatabase)
	.then(
		function(){
			//console.log();
			return db.getName(req, config.locationsCol);
		}
	)
	.then(
		function(sample){
			//console.log(sample);
			return db.getInfo({'body': sample}, config.plantsInfoCol);
	})
	.then(
		function(info){
			console.log(info);
			return {
				'success': true,
				'item': info,
				'error': ''
			};
		},
		function(error){
			console.log(error);
			return {
				'success': false,
				'item': {
					'name': '',
					'harvesttime': '',
					'sciname': '',
					'link': ''
				},
				'error': error
			}
		}
	)
	.then(
		function(result){
			// console.log(result.list);
			db.close();
			res.render('popup', result);
		}
	)
});


routes.post('/g-plant-inf', function(req, res){
	let db = new DB;
	db.connect(config.defaultUri, config.defaultDatabase)
	.then(
		function(){
			return db.getInfo(req, config.plantsInfoCol);
		}
	)
	.then(
		function(info){
			return {
				'success': true,
				'item': info,
				'error': ''
			};
		},
		function(error){
			return {
				'success': false,
				'item': '',
				'error': error
			}
		}
	)
	.then(
		function(result){
			db.close();
			res.send(result);
	})
});

// 404 Error
routes.get('*', function(req, res){
  res.render('404');
});



module.exports = routes;
