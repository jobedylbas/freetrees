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
							data.push({'lat': item.lat, 'long': item.long, 'emoji': item.emoji});
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
							_id: { name: '$name', color: '$color'}, count:{$sum:1}
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
						//console.log(result);
						for (data in result){
						 	count = count + result[data].count;
						}

						if(result.length > 5)
							result.slice(0,5);

						resolve(result);
					}
				})
			}
		});
	});
}

DB.prototype.getInfo = function(query, coll){
	var _this = this;
	return new Promise(function (resolve, reject){
		_this.db.collection(coll, {strict: true}, function(error, collection){
			if(error){
				console.log('Could not access collection: ' + error.message);
				reject(error.message);
			}
			else{

				collection.findOne(query.body,
					function(err, res){
						if(err){
							console.log(err);
							reject('Error finding data: '+ err.message);
						}
						if(res){
							resolve(
								{
									'name': res.name,
									'harvesttime': res.harvestseason,
									'sciname': res.sciname,
									'url': res.url
								}

							);
						}
						else{
							reject('Data not find.');
						}
					});
			}
		});
	});
}


DB.prototype.getName = function(query, coll){
	var _this = this;
	return new Promise(function (resolve, reject){
		_this.db.collection(coll, {strict: true}, function(error, collection){
			if(error){
				console.log('Could not access collection: ' + error.message);
				reject(error.message);
			}
			else{
				collection.findOne(
					{
						$and: [
							{'lat': parseFloat(query.lat)},
							{'long': parseFloat(query.long)}]
					},
					function(err, res){
						if(err){
							console.log(err);
							reject('Error finding data:' + err.message);
						}
						if(res){
							// console.log(res);
							resolve({'name': res.name});
						}
						else{
							// console.log(res)
							reject('Data not find.');
						}
					});
			}
		});
	});
}

module.exports = DB;
