const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const treeSchema = new Schema({
	_id: Number,
	name: String,
	date: {type: Date, default: Date.now},
	type: String,
	harvesttime: String,
	lat: Number,
	long: Number,
	address: String
});

module.exports = treeSchema;