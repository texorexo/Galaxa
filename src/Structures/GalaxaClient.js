const { AkairoClient, ListenerHandler, CommandHandler } = require('discord-akairo');
const Util = require('./Utils');
const { join } = require('path');
const moment = require('moment');
const chalk = require('chalk');
const mongoose = require('mongoose');

module.exports = class GalaxaClient extends AkairoClient {

	constructor(options = {}) {
		super(
			{
				ownerID: ['540853382269894667', '679864181226602503', '840742590889984011']
			},
			{
				partials: ['USER', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'MESSAGE']
			}
		);

		this.utilities = new Util(this);

		this.validate(options);

		this.CommandHandler = new CommandHandler(this, {
			// eslint-disable-next-line no-process-env
			prefix: '.',
			blockBots: true,
			blockClient: true,
			allowMention: true,
			defaultCooldown: 5000,
			clientUtil: true,
			directory: join(__dirname, '..', 'Commands')
		});

		this.ListenerHandler = new ListenerHandler(this, {
			directory: join(__dirname, '..', 'Listeners')
		});

		this.CommandHandler.useListenerHandler(this.ListenerHandler);
		this.CommandHandler.loadAll();
		this.ListenerHandler.loadAll();
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Client options should be only an object.');

		if (!options.token) throw new Error('No token has found, a token is needed for the bot to work.');
		this.token = options.token;


		if (!options.prefix) this.prefix = '.';
		if (typeof options.prefix !== 'string') throw new TypeError('The provided string must be a string.');
		this.prefix = options.prefix;
	}

	async start(token = this.token) {
		await mongoose.connect('mongodb+srv://dbAdmin:hcsg8pCdlISFehFu@galaxa.lmcuv.mongodb.net/main?retryWrites=true&w=majority', {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}).then(() => {
			console.log(`${moment().format('MM/DD/YY hh:mm:ss')} => [${chalk.blue.bold('CONNECTED')}] 🔌 Connected to the database.`);
		});

		super.login(token);
	}

};
