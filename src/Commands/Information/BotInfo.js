const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class BotInfo extends Command {

	constructor() {
		super('botinfo', {
			aliases: ['botinfo', 'galaxa'],
			description: 'Gets information about the bot.'
		});
	}

	async exec(message) {
		const discordEmbed = new MessageEmbed()
			.setTitle('Info about Galaxa')
			.setColor('#3B82F6')
			.setDescription('Galaxa is a custom Discord bot specialized for the functions for THe Furry Galaxy. With mooderation, fun, interacation commands adn more to come.')
			.addFields(
				{ name: 'Current Version', value: '3.0.1b', inline: true },
				{ name: 'Current DiscordJS verion', value: '12.15.3', inline: true },
				{ name: 'Current Node JS Version', value: process.version.match(/^v(\d+\.\d+)/)[1], inline: true },
				{ name: 'Current Uptime', value: `${ms(this.client.uptime)}`, inline: true },
				{ name: 'Discord Latency Ping', value: this.client.ws.ping, inline: true }
			)
			.setTimestamp()
			.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());

		return message.channel.send(discordEmbed);
	}

};
