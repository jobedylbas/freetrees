/* importing o Mongodb */
var MongoClient = require('mongodb').MongoClient;

function DB(){
	this.client = null;
	this.db = null;
}

DB.prototype.connect = function(uri, dbName){
	var _this = this;

	return new Promise(function(resolve, reject){
		if (_this.db){
			resolve();
		}
		else{
			var __this = _this;

			MongoClient.connect(uri, { useNewUrlParser: true })
			.then(
				function(database){
					__this.client = database;
					__this.db = database.db(dbName);
					resolve();
				},
				function(err){
					console.log('Error conecting: ' + err.message);

					reject(err.message);
				}
			)
		}
	})
}

DB.prototype.close = function(){
	if(this.client){
		this.client.close()
		.then(
			function(){},
			function(error){
				console.log('Failed to close the database: ' + error.message);
			}
		)
	}
}

DB.prototype.getAllLocations = function(coll){
	var _this = this;

	return new Promise(function (resolve, reject){
		_this.db.collection(coll, {strict: true}, function(error, collection){
			if (error){
				console.log('Could not access collection: ' + error.message);
				reject(error.message);
			}
			else{
				collection.find().toArray(function(err, result){
					if(err){
						console.log('Error: ' + err.message);
						reject(err.message);
					}
					else{
						data = [];
						result.forEach(function(item){
							data.push({'lat': item.lat, 'long': item.long});
						});
						resolve(data);	
					}
				});
			}
		});
	});
}

DB.prototype.getFreqPlants = function(coll){
	var _this = this;
	return new Promise(function (resolve, reject){
		_this.db.collection(coll, {strict: true}, function(error, collection){
			if(error){
				console.log('Could not access collection: ' + error.message);
				reject(error.message);
			}
			else{
				collection.aggregate([
					{
						$group:{
							_id: '$name', count:{$sum:1}
						},

					},
					{
						$sort:{
							'count': -1
						}
					}
				]).toArray(function(err, result){
					if(error){
						console.log('Error sampling data: '+ error.message);
						reject(error.message);
					}
					else{
						let count = 0;
						for (data in result){
							count = count + result[data].count;
						}

						if(result.length > 7)
							result.slice(0,7);

						resolve(result);
					}
				})
			}
		});
	});
}

DB.prototype.getInfo = function(req, coll){
	var _this = this;
	return new Promise(function (resolve, reject){
		_this.db.collection(coll, {strict: true}, function(error, collection){
			if(error){
				console.log('Could not access collection: ' + error.message);
				reject(error.message);
			}
			else{
				collection.find({}, {lat: req.lat, long: req.long}).toArray(function(err, result){
					if(err){
						console.log('Error finding data: '+ err.message);
						reject(err.message);
					}
					else{
						console.log(result)
						if(result.length === 0){
							reject('Empty search.')
						}
						else{
							resolve(
								{
									'name': result[0].name,
									'harvesttime': result[0].harvesttime,
									'cientificname': result[0].scientficname,
									'link': result[0].link
								}
							);	
						}
					}
				})
			}
		});
	});
}

module.exports = DB;