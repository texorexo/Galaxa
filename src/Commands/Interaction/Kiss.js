const Yiffy = require('yiffy');
const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');
const yiffy = new Yiffy();

module.exports = class extends Command {

	constructor() {
		super('kiss', {
			args: ['kiss', 'kith', 'smooch', 'mwah'],
			description: 'Kiss someone you love!',
			category: 'Interaction',
			usage: '<user>'
		});
	}

	// eslint-disable-next-line consistent-return
	async exec(message, args) {
		const user = message.mentions.members.first() || args.slice(0).join(' ');
		const responses = [`${message.author} kissed ${user} deeply.`, `${message.author} gave ${user} a smooch on the lips!`, `${message.author} gave a quick kiss to ${user}.`];

		if (!user || user === '') {
			const errorMsg = new MessageEmbed()
				.setTitle('<:galaxa3noentry:840205043822231562> **Nothing to kiss.**')
				.setColor('#DC2626')
				.setDescription('I am not a nincompoop, you have no one to kiss, you sad little loner. Try again but now select a user or something after the command.')
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

		yiffy.furry.kiss('json').then((res) => {
			let artistParsed;
			if (res.artists !== []) {
				artistParsed = res.artists.slice(0).join(', ');
			} else { artistParsed = undefined; }

			const embed = new MessageEmbed()
				.setColor('#E11D48')
				.setAuthor(`${artistParsed ? `Art by ${artistParsed}` : 'No artist known in image..'}.`, 'https://cdn.discordapp.com/attachments/762534497136279582/840208900401922068/Frame_10.png')
				.setDescription(`*${responses[Math.floor(Math.random() * responses.length)]}*
                
                [<:galaxa3link:840203738185465857> Get Direct Link](${res.shortURL})
                [<:galaxa3link:840203738185465857>Report Broken Image](${res.reportURL})`)
				.setImage(res.url)
				.setFooter('Galaxa 3 | API by yiff.rest', this.client.user.avatarURL())
				.setTimestamp();

			message.channel.send(embed);
		});
	}

};
