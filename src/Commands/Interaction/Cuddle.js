const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Yiffy = require('yiffy');
const yiffy = new Yiffy();

module.exports = class extends Command {

	constructor() {
		super('cuddle', {
			aliases: ['cuddle'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['SEND_MESSAGES'],
			typing: true,
			description: 'Cuddle someone in the server!',
			category: 'Interaction'
		});
	}

	// eslint-disable-next-line consistent-return
	async exec(message, args) {
		const user = message.mentions.members.first() || args.slice(0).join(' ');
		const responses = [`${user} got scard so ${message.author} cuddled them to sleep!`,
			`${message.author} unfortunately cuddled ${user} to death.`,
			`${user} got scared watching the movie, so ${message.author} cuddled them for comfort.`];

		if (!user || user === '') {
			const errorMsg = new MessageEmbed()
				.setTitle('<:galaxa3noentry:840205043822231562> **Nothing to cuddle.**')
				.setColor('#DC2626')
				.setDescription('Oh, it seems someone is lonely and have no one to cuddle, look at you. You little loner. Try again but now select a user or something after the command.')
				.setFooter('Galaxa 3', this.client.user.avatarURL())
				.setTimestamp();

			return message.channel.send(errorMsg).then(msg => setTimeout(() => msg.delete, 30000));
		}

		if (user === message.author) {
			const fool = new MessageEmbed()
				.setTitle('<:galaxa3noentry:840205043822231562> Bruh')
				.setColor('#DC2626')
				.setDescription('You cant just cuddle yourself, you lonely or someting? Venting... could uh... help.')
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
                [<:galaxa3crosslink:840203738219937862> Report Broken Image](${res.reportURL})`)
				.setImage(res.url)
				.setFooter('Galaxa 3 | API by yiff.rest', this.client.user.avatarURL())
				.setTimestamp();

			message.channel.send(embed);
		});
	}

};
