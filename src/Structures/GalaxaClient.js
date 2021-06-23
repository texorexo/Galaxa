const { AkairoClient, ListenerHandler, CommandHandler } = require('discord-akairo');
const { join } = require('path');

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

		// this.on('message', async (message) => {
		// 	const MentionRegex = RegExp(`^<@!${this.user.id}>$`);
		// 	const MentionPrefixRegex = RegExp(`^<@!${this.user.id}> `);

		// 	if (!message.guild || message.author.bot) return;

		// 	if (message.content.match(MentionRegex)) message.channel.send(`Hi! My name is Galaxa! Pleasure to meet you. My current prefix is \`${this.prefix}\``);

		// 	const prefix = message.content.match(MentionPrefixRegex) ? message.content.match(MentionPrefixRegex)[0] : this.prefix;

		// 	// eslint-disable-next-line no-unused-vars
		// 	const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		// 	const command = this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases.get(cmd.toLowerCase()));
		// 	if (command) {
		// 		command.run(message, args);
		// 	}
		// });

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
		super.login(token);
	}

};
