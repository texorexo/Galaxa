const { Listener } = require('discord-akairo');
const moment = require('moment');
const chalk = require('chalk');

module.exports = class Ready extends Listener {

	constructor() {
		super('ready', {
			event: 'ready',
			emitter: 'client'
		});
	}
	async exec() {
		this.client.user.setActivity(`Galaxa 3 Beta | Current Time ${moment().format('hh:mm')}`);
		console.log(`${moment().format('MM/DD/YY hh:mm:ss')} => [${chalk.green.bold('READY')}] 🤖 Galaxa 3 is now online.`);
	}

};
