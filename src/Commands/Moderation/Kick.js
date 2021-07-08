// /* eslint-disable consistent-return */
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { create } = require('sourcebin');
const moment = require('moment');
const Punishment = require('../../MongoDB/Models/Punishments');

module.exports = class Kick extends Command {

	constructor() {
		super('kick', {
			aliases: ['boot', 'remove'],
			description: {
				content: 'kicks selected users out the server.',
				usage: '<user> [reason | predefined reason code]'
			},
			channel: 'guild',
			args: [
				{
					id: 'user',
					type: 'member',
					prompt: {
						start: 'Which user do you want to Warn? Please mention them or respond with their ID.',
						retry: 'Tough luck, that user isint found, try again.'
					}
				},
				{
					id: 'reason',
					match: 'rest',
					default: 'No reason defined'
				}
			],
			clientPermissions: ['SEND_MESSAGES']
		});
	}

	userPermissions(message) {
		if (message.member.roles.cache.has((role) => role.name === 'Ship Moderators')) {
			return 'Ship Moderators';
		}
		if (message.member.roles.cache.has((role) => role.name === 'Ship Administrators')) {
			return 'Ship Administrators';
		}
		if (message.member.roles.cache.has((role) => role.name === 'Ship Vice Captain')) {
			return 'Ship Vice Captain';
		}
		if (message.member.roles.cache.has((role) => role.name === 'Ship Captain')) {
			return 'Ship Captain';
		}
		return null;
	}

	// eslint-disable-next-line consistent-return
	async exec(message, args) {
		if (!args.user) {
			const warnEmbed = new MessageEmbed()
				.setTitle('.warn')
				.setColor('#db1c07')
				.setDescription('Warns the selected user.')
				.addFields(
					{
						name: 'Constructor', value: '**.warn <user> [reason | predefined reason code]**', inline: true
					},
					{
						name: 'Restrction Level', value: 'Staff', inline: true
					},
					{
						// eslint-disable-next-line max-len
						name: 'Entered Value', value: `**.mute ${args.user ? args.user : 'No user defined'} ${args.reason ? args.reason : 'No reason defined.'} **`
					}
				)
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL())
				.setTimestamp();
			return message.reply(
				'No users has been selected to warn. Please specify one.',
				warnEmbed
			);
		}

		if (args.user.roles.cache.has(role => role.name === 'Staff') && message.author.roles.cache.has(role => role.name === 'Ship Captain')) {
			const UserIsStaffException = new MessageEmbed()
				.setTitle('User selected is staff.')
				.setColor('#db1c07')
				.setDescription('The selected user is a staff member, therefore they are immune from being warned. \n An offical staff strike doccument is required for FOI.')
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.user.displayAvatarURL());
			message.reply('Nice one.', UserIsStaffException);
		}

		// Args Validation
		if (args.user === message.author) {
			const SeletctedUserIsAuthorError = new MessageEmbed()
				.setTitle('Exception Error')
				.setAuthor(message.authot.tag, message.author.displayAvatarURL())
				.setColor('#db1c07')
				.setDescription(`The selected user to the arguments is the same user as the author. 
				This cannot happen within this command. Please try again with another user.
					`)
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.user.displayAvatarURL());

			return message.reply(
				'SelectedUserIsAuthorExeption: The selected user to the arguments is the same user as the author.',
				SeletctedUserIsAuthorError
			);
		}

		if (!args.reason) args.reason = `No reason defined by ${message.author}.`;

		if (args.reason.match(/RI:[MVUT]:\d+/g)) {
			const ReasonIdentifierNotCurrentlySupportedException = new MessageEmbed()
				.setTitle('Reason Identifier is not currently supported.')
				.setColor('#db1c07')
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setDescription(`The reason identifier is currently not supportd yet. Wait till Texo finaly remakes the rules.`)
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			return message.reply('ReasonIdentifierNotCurrentlySupportedException: Reason Identifier not currently supported.', ReasonIdentifierNotCurrentlySupportedException);
		}

		const strikes = await Punishment.find({ user: args.user.id, createdAt: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('week').toDate() } }).exec();


		if ((strikes.length + 1) >= 5) {
			const StrikeWarning = new MessageEmbed()
				.setTitle('Selected User has reached maximum strikes')
				.setColor('#DC2626')
				.setAuthor(args.user.tag, args.user.user.displayAvatarURL())
				.setDescription('The selected user has already recieved 4 strikes within the last 2 weeks. Immediate ban to user for a month is recomended.')
				.addField('User\'s current strike count', strikes.length)
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			message.reply(StrikeWarning);
		}

		const punishment = new Punishment({
			type: 3,
			user: args.user.id,
			by: message.author.id,
			reason: args.reason
		});

		await punishment.save((err) => {
			if (err) {
				create([
					{
						content: err,
						language: 'text'
					}
				], {
					title: 'Error Exception at Warn.js',
					description: 'An error has occured at line 227 at the Mute command file. Error message and stack info is shown below.'
				}).then(result => {
					const RoleCreationErrorExeption = new MessageEmbed()
						.setTitle('RoleCreationErrorExeption: An error occured.')
						.setColor('#db1c07')
						.setDescription('An error occured while saving punishment records. More details below.')
						.addField('Bin Link', result.url)
						.setTimestamp()
						.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
					return message.reply('RoleCreationErrorExeption: An error occured.', RoleCreationErrorExeption);
				});
			}
		});

		const UserMailEmbed = new MessageEmbed()
			.setTitle('User Striked')
			.setColor('#4B5563')
			.setDescription(`You have been warned on ${message.guild.name} for the following reasons below.`)
			.addFields([
				{ name: 'Reason', value: args.reason, inline: true },
				{ name: 'Current Strike Count', value: strikes.length, inline: true },
				{ name: 'Strike counts exceeding 5 would result in a month ban.', value: '\u200b' }
			])
			.setTimestamp()
			.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());

		args.user.send('You have been warned, check the following below for more information.', UserMailEmbed);

        args.user.kick()

		const UnmuteUserSuccess = new MessageEmbed()
			.setTitle('Successfully warned user.')
			.setAuthor(args.user.user.tag, args.user.user.displayAvatarURL())
			.setColor('#10B981')
			.setDescription(`${args.user.user.tag} has been warned successfully with the Punishment ID: ${punishment._id}.`)
			.setTimestamp()
			.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
		message.channel.send(UnmuteUserSuccess);

		this.client.utilities.logger({
			type: 2,
			id: punishment._id,
			user: args.user,
			reason: args.reason,
			by: message.author,
			link: message.url
		});
	}

};
