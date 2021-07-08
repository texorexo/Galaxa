const { Schema, model } = require('mongoose');

const schema = new Schema({
	type: {
		type: String,
		default: 0
	},
	user: {
		type: Number,
		required: true
	},
	by: {
		type: Number,
		required: true
	},
	reason: {
		type: String,
		default: 'No reason defined'
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

module.exports = model('punishments', schema);
