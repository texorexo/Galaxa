const Yiffy = require('yiffy');
const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');
const yiffy = new Yiffy();

module.exports = class extends Command {

	constructor() {
		super('hug', {
			aliases: ['hug'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['SEND_MESSAGES'],
			typing: true,
			description: 'Hug someone in the server!',
			category: 'Interaction'
		});
	}

	async exec(message, args) {
		const user = message.mentions.members.first() || args.slice(0).join(' ');
		const responses = [
			`${message.author} walked up to ${user} and gave them a big hug.`,
			`${message.author} sneaked up behind ${user} and gave them a big hug from behind.`,
			`${message.author} ran towards ${user} and hugged them tightly.`,
			`${message.author} cheered up ${user} with a big, warm hug.`,
			`${message.author} smiled and gave ${user} a friendly hug.`];

		if (!user || user === '') {
			const errorMsg = new MessageEmbed()
				.setTitle('<:galaxa3noentry:840205043822231562> **Nothing to hug.**')
				.setColor('#DC2626')
				.setDescription('I am not a nincompoop, you have gived a nil value to find a person to hug. Try again but now select a user or something after the command.')
				.setFooter('Galaxa 3', this.client.user.avatarURL())
				.setTimestamp();

			return message.channel.send(errorMsg).then(msg => setTimeout(() => msg.delete, 30000));
		}

		if (user === message.author) {
			const fool = new MessageEmbed()
				.setTitle('<:galaxa3noentry:840205043822231562> Bruh')
				.setColor('#DC2626')
				.setDescription('You cant just hug yourself, you lonely or someting? Venting... could uh... help.')
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			message.channel.send(fool).then(msg => setTimeout(() => msg.delete, 30000));
		}

		yiffy.furry.hug('json').then((res) => {
			let artistParsed;
			if (res.artists !== []) {
				artistParsed = res.artists.slice(0).join(', ');
			} else { artistParsed = undefined; }

			const embed = new MessageEmbed()
				.setColor('#E11D48')
				.setAuthor(`${artistParsed ? `Art by ${artistParsed}` : 'No artist known in image..'}.`, 'https://cdn.discordapp.com/attachments/762534497136279582/840208900401922068/Frame_10.png')
				.setDescription(`*${responses[Math.floor(Math.random() * responses.length)]}* 
                
                [<:galaxa3link:840203738185465857> Get Direct Link](${res.shortURL})
                <:galaxa3crosslink:840203738219937862> [Report Broken Image](${res.reportURL})`)
				.setImage(res.url)
				.setFooter('Galaxa 3 | API by yiff.rest', this.client.user.avatarURL())
				.setTimestamp();

			message.channel.send(embed);
		});
	}

};
