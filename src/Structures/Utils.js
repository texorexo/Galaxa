const chalk = require('chalk');
const moment = require('moment');

module.exports = class Util {

	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
	}

	// get directory() {
	// 	return `${path.dirname(require.main.filename)}${path.sep}`;
	// }

	// async loadCommands() {
	// 	return glob(`${this.directory}commands/**/*.js`).then(commands => {
	// 		for (const commandFile of commands) {
	// 			delete require.cache[commandFile];
	// 			const { name } = path.parse(commandFile);
	// 			const File = require(commandFile);
	// 			if (!this.isClass(File)) throw new TypeError(`The ${name} command needs to export a class!`);
	// 			const command = new File(this.client, name.toLowerCase());
	// 			if (!(command instanceof Command)) throw new Error(`Commadn ${name} must be an instance of a Command to be a command.`);
	// 			this.client.commands.set(command.name, command);

	// 			if (command.aliases.length) {
	// 				for (const alias of command.aliases) {
	// 					this.client.aliases.set(alias, command.name);
	// 				}
	// 			}
	// 		}
	// 	});
	// }

	async log(type, message) {
		switch (type) {
			case 'info':
				console.log(`[${moment().format('MM/DD/YY hh:mm:ss')}] => [${chalk.blue.bold('INFO')}] ${message}`);
				break;
			case 'success':
				console.log(`[${moment().format('MM/DD/YY hh:mm:ss')}] => [${chalk.green.bold('SUCCESS')}] ${message}`);
				break;

			case 'warn':
				console.log(`[${moment().format('MM/DD/YY hh:mm:ss')}] => [${chalk.orange.bold('WARN')}] ${message}`);
				break;
		}
	}

};
