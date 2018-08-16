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
					console.log("Error conecting: " + err.message);

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
				console.log("Failed to close the database: " + error.message);
			}
		)
	}
}

DB.prototype.getAllData = function(json){
	var _this = this;

	return new Promise(function (resolve, reject){
		_this.db.collection(json.pccoll, {strict: true}, function(error, collection){
			if (error){
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			}
			else{
				collection.find().sort({$natural: -1}).toArray(function(err, result){
					if(err){
						console.log("Error: " + err.message);
						reject(err.message);
					}
					else{
						var data = [];
						var timestamp = [];
						result.forEach(function(item){
							data.push(item[json.datatype][json.datakey]);
							timestamp.push(item.timestamp);
						});
						// console.log({"timestamp": timestamp, "data": data});
						resolve({"timestamp": timestamp, "data": data});	
					}
				});
			}
		});
	});
}

DB.prototype.getNData = function(json){
	var _this = this;

	return new Promise(function (resolve, reject){
		_this.db.collection(json.pccoll, {strict: true}, function(error, collection){
			if (error){
				console.log("Could not access collection: " + error.message);
				reject(error.message);
			}
			else{
				collection.find().sort({ $natural: -1}).limit(json.granularity).toArray(function(err, result){
					if(err){
						console.log("Error: " + err.message);
						reject(err.message);
					}
					else{
						var data = [];
						var timestamp = [];
						result.forEach(function(item){
							data.push(item[json.datatype][json.datakey]);
							timestamp.push(item.timestamp);
						});
						// console.log({"timestamp": timestamp, "data": data});
						resolve({"timestamp": timestamp, "data": data});	
					}
				});
			}
		});
	});
}

module.exports = DB;