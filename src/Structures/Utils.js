const chalk = require('chalk');
const { MessageEmbed } = require('discord.js');
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

	formatDuration(miliseconds) {
		return moment.duration(miliseconds);
	}

	async logger({ id, type, reason, user, by, link }) {
		const channel = this.client.channels.cache.get('700248536570265670');
		const embed = new MessageEmbed();
		switch (type) {
			case 0:
				embed.setTitle('⚠ User Striked');
				embed.setAuthor(by.tag, by.user.displayAvatarURL());
				embed.setColor('#FACC15');
				embed.addFields([
					{ name: 'Punishmend Id', value: id, inline: true },
					{ name: 'Punishment Type', value: 'Strike', inline: true },
					{ name: 'Punished User', value: user.tag, inline: true },
					{ name: 'Punisher', value: by.tag, inline: true },
					{ name: 'Punishment Reason', value: reason, inline: true },
					{ name: 'Message Link', value: `[Teleport me there, Galaxa](${link})`, inline: true }
				]);
				embed.setTimestamp();
				embed.setFooter('Galaxa 3 | Under GPLv3', this.client.displayAvatarURL());
				channel.send(embed);
				break;
			case 1:
				embed.setTitle('🔇 User Muted');
				embed.setAuthor(by.tag, by.user.displayAvatarURL());
				embed.setColor('#4B5563');
				embed.addFields([
					{ name: 'Punishmend Id', value: id, inline: true },
					{ name: 'Punishment Type', value: 'Mute', inline: true },
					{ name: 'Punished User', value: user.tag, inline: true },
					{ name: 'Punisher', value: by.tag, inline: true },
					{ name: 'Message Link', value: `[Teleport me there, Galaxa](${link})`, inline: true }
				]);
				embed.setTimestamp();
				embed.setFooter('Galaxa 3 | Under GPLv3', this.client.displayAvatarURL());
				channel.send(embed);
				break;
			case 2:
				embed.setTitle('🔊 User Unmuted');
				embed.setAuthor(by.tag, by.user.displayAvatarURL());
				embed.setColor('#10B981');
				embed.addFields([
					{ name: 'Punishment Type', value: 'Unmute', inline: true },
					{ name: 'Unmuted User', value: user.tag, inline: true },
					{ name: 'Unmuter', value: by.tag, inline: true },
					{ name: 'Unmute Reason', value: reason, inline: true },
					{ name: 'Message Link', value: `[Teleport me there, Galaxa](${link})`, inline: true }
				]);
				embed.setTimestamp();
				embed.setFooter('Galaxa 3 | Under GPLv3', this.client.displayAvatarURL());
				channel.send(embed);
				break;
			case 3:
				embed.setTitle('👢 User Kicked');
				embed.setAuthor(by.tag, by.user.displayAvatarURL());
				embed.setColor('#F59E0B');
				embed.addFields([
					{ name: 'Punishmend ID', value: id, inline: true },
					{ name: 'Punishment Type', value: 'Kick', inline: true },
					{ name: 'Punished User', value: user.tag, inline: true },
					{ name: 'Punisher', value: by.tag, inline: true },
					{ name: 'Punishment Reason', value: reason, inline: true },
					{ name: 'Message Link', value: `[Teleport me there, Galaxa](${link})`, inline: true }
				]);
				embed.setTimestamp();
				embed.setFooter('Galaxa 3 | Under GPLv3', this.client.displayAvatarURL());
				channel.send(embed);
				break;
			case 4:
				embed.setTitle('🔨 User Softbanned');
				embed.setAuthor(by.tag, by.user.displayAvatarURL());
				embed.setColor('#DC2626');
				embed.addFields([
					{ name: 'Punishmend ID', value: id, inline: true },
					{ name: 'Punishment Type', value: 'Kick', inline: true },
					{ name: 'Punished User', value: user.tag, inline: true },
					{ name: 'Punisher', value: by.tag, inline: true },
					{ name: 'Punishment Reason', value: reason, inline: true },
					{ name: 'Message Link', value: `[Teleport me there, Galaxa](${link})`, inline: true }
				]);
				embed.setTimestamp();
				embed.setFooter('Galaxa 3 | Under GPLv3', this.client.displayAvatarURL());
				channel.send(embed);
				break;
		}
	}

};
