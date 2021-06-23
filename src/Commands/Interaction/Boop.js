const Yiffy = require('yiffy');
const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');
const yiffy = new Yiffy();


module.exports = class extends Command {

	constructor() {
		super('boop', {
			aliases: ['boop', 'bap'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['SEND_MESSAGES'],
			typing: true,
			args: [
				{
					id: 'user',
					type: 'member'
				}
			],
			description: 'Boop someone, for some reason that I do not care about!',
			category: 'Interaction'
		});
	}

	// eslint-disable-next-line consistent-return
	async exec(message, args) {
		const { user } = args;
		const responses = [
			`${message.author} slowly came up to ${user} and booped em! >~<`,
			`${message.author} booped ${user} while they were sleeping! Sneaky...`,
			`${message.author} stared at ${user} and booped them the instant ${user} stared back!`
		];

		if (!user || user === '') {
			const errorMsg = new MessageEmbed()
				.setTitle('<:galaxa3noentry:840205043822231562> **Nothing to boop.**')
				.setColor('#DC2626')
				.setDescription('I am not a nincompoop, you have gived a nil value to find a person to be booped. Try again but now select a user or something after the command.')
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayavatarURL())
				.setTimestamp();

			return message.channel.send(errorMsg).then(msg => setTimeout(() => msg.delete, 30000));
		}

		if (user === message.author) {
			const fool = new MessageEmbed()
				.setTitle('<:galaxa3noentry:840205043822231562> Bruh')
				.setColor('#DC2626')
				.setDescription('You cant just boop yourself, that is physically imposible.')
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			message.channel.send(fool).then(msg => setTimeout(() => msg.delete, 30000));
		}

		yiffy.furry.boop('json').then((res) => {
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
