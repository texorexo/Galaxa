const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');


module.exports = class Ping extends Command {

	constructor() {
		super('ping', {
			aliases: ['ping', 'latency', 'pong'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['SEND_MESSAGES'],
			typing: true,
			description: 'This provides the ping of the bot',
			category: 'Utilities'
		});
	}

	async exec(message) {
		const msg = await message.channel.send('Pinging...');
		const latency = msg.createdTimestamp - message.createdTimestamp;

		let color;
		if (latency <= 20) color = 'GREEN';
		if (latency >= 20) color = 'ORANGE';
		if (latency >= 100) color = 'RED';

		const embed = new MessageEmbed()
			.setTitle('🏓 Pong!')
			.setColor(color)
			.setDescription(`Galaxa Latency: \`${latency}ms\` \nDiscord Latency: \`${Math.round(this.client.ws.ping)}ms\`.`)
			.setFooter('Galaxa | Under GPLv3', this.client.user.displayAvatarURL())
			.setTimestamp();
		msg.edit(embed);
	}

};
