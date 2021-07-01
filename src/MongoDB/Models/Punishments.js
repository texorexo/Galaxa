const { Schema, model } = require('mongoose');

const schema = new Schema({
	type: {
		type: String,
		default: 'STRIKE'
	},
	user: {
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
