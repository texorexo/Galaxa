// /* eslint-disable consistent-return */
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { create } = require('sourcebin');
const moment = require('moment');
const ms = require('ms');
const Punishment = require('../../MongoDB/Models/Punishments');

module.exports = class Mute extends Command {

	constructor() {
		super('mute', {
			aliases: ['mute', 'sush', 'silence'],
			description: {
				content: 'Mutes selected users in the server.',
				usage: '<user> [duration, defaults to 1 hour] [reason]'
			},
			channel: 'guild',
			args: [
				{
					id: 'user',
					type: 'member',
					prompt: {
						start: 'Which user do you want to mute? Please mention them or respond with their ID.',
						retry: 'Tough luck, that user isint found, try again.'
					}
				},
				{
					id: 'duration',
					type: 'lowercase',
					default: '1h'
				},
				{
					id: 'reason',
					match: 'rest',
					default: 'No reason defined'
				}
			],
			clientPermissions: ['MANAGE_ROLES', 'SEND_MESSAGES']
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
			const muteEmbed = new MessageEmbed()
				.setTitle('mute')
				.setColor('#db1c07')
				.setDescription('Mutes the selected user.')
				.addFields(
					{
						name: 'Constructor', value: '**.mute <user> [duration] [reason | predefined reason code]**', inline: true
					},
					{
						name: 'Restrction Level', value: 'Staff', inline: true
					},
					{
						// eslint-disable-next-line max-len
						name: 'Entered Value', value: `**.mute ${args.user ? args.user : '!! No user defined !!'} ${args.duration ? args.duration : '1 hour'} ${args.reason ? args.reason : 'No reason defined.'} **`
					}
				)
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL())
				.setTimestamp();
			return message.reply(
				'No users has been selected to mute. Please specify one.',
				muteEmbed
			);
		}

		if (args.user.roles.cache.has(role => role.name === 'Staff') && message.author.roles.cache.has(role => role.name === 'Ship Captain')) {
			const UserIsStaffException = new MessageEmbed()
				.setTitle('User selected is staff.')
				.setColor('#db1c07')
				.setDescription('The selected user is a staff member, therefore they are immune from being Warned. Nice one though.')
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

		if (!args.duration) args.duration = '1h';

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

		const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
		const verifiedRole = message.guild.roles.cache.find(role => role.name === 'Space Cadets');

		if (!muteRole) {
			try {
				message.guild.roles.create({
					data: {
						name: 'Muted',
						color: '#818386',
						hoisted: true
					}
				});
			} catch (error) {
				create([
					{
						content: error,
						language: 'text'
					}
				], {
					title: 'Error Exception at Mute.js',
					description: 'An error has occured at line 138 at the Mute command file. Error message and stack info is shown below.'
				}).then(result => {
					const RoleCreationErrorExeption = new MessageEmbed()
						.setTitle('RoleCreationErrorExeption: An error occured.')
						.setColor('#db1c07')
						.setDescription('An error occured while making a new Mute role when the bot didin\'t saw one. More details below.')
						.addField('Bin Link', result.url)
						.setTimestamp()
						.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
					return message.reply('RoleCreationErrorExeption: An error occured.', RoleCreationErrorExeption);
				});
			}
		}

		if (!verifiedRole) {
			const NoVerifyRoleException = new MessageEmbed()
				.setTitle('NoVerifyRoleException: No Verify command detected')
				.setColor('#db1c07')
				.setDescription('No Verify roles has been found in the server. Please create one and try again.')
				.setTimestamp()
				.setAuthor('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			return message.reply('NoVerifyRoleException: No Verify Role found.', NoVerifyRoleException);
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
		} else if ((strikes.length + 1) >= 4) {
			const StrikeWarning = new MessageEmbed()
				.setTitle('Selected User has reached 4 strikes')
				.setColor('#FBBF24')
				.setAuthor(args.user.tag, args.user.user.displayAvatarURL())
				.setDescription('The selected user has already recieved 4 strikes within the last 2 weeks. Suggested to kick the user.')
				.addField('User\'s current strike count', strikes.length)
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			message.reply(StrikeWarning);
		}

		if (args.user.roles.cache.has(muteRole.id)) {
			const UserAlreadyMutedExeption = new MessageEmbed()
				.setTitle('UserAlreadyMutedException: User already has the `Muted` role.')
				.setColor('#db1c07')
				.setDescription('The user has already been muted. Please select an unmuted user and try again.')
				.setTimestamp()
				.setAuthor('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			return message.reply('UserAlreadyMutedException: User already has the `Muted` role.', UserAlreadyMutedExeption);
		}

		if (!args.user.roles.cache.has(verifiedRole.id)) {
			const UserNotVerifiedException = new MessageEmbed()
				.setTitle('UserNotVerifiedException: User is not verified')
				.setColor('#db1c07')
				.setDescription('The user you selected does not have been verified.')
				.setTimestamp()
				.setAuthor('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			return message.reply('UserNotVerifiedException: User is not verified.', UserNotVerifiedException);
		}

		const punishment = new Punishment({
			type: 1,
			user: args.user.id,
			by: message.author.id,
			reason: args.reason
		});

		await args.user.roles.remove(verifiedRole);
		await args.user.roles.add(muteRole);

		await punishment.save((err) => {
			if (err) {
				create([
					{
						content: err,
						language: 'text'
					}
				], {
					title: 'Error Exception at Mute.js',
					description: 'An error has occured at line 217 at the Mute command file. Error message and stack info is shown below.'
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
			.setTitle('User Muted')
			.setColor('#4B5563')
			.setDescription(`You have been muted on ${message.guild.name} for the following reasons below.`)
			.addFields([
				{ name: 'Reason', value: args.reason, inline: true },
				{ name: 'Duration', value: `in ${this.client.utilities.formatDuration(ms(args.duration))}`, inline: true },
				{ name: 'Current Strike Count', value: strikes.length, inline: true },
				{ name: 'Strike counts exceeding 5 would result in a month ban.', value: '\u200b' }
			])
			.setTimestamp()
			.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());

		args.user.send('You have been muted, check the following below for more information.', UserMailEmbed);

		const MuteUserSuccess = new MessageEmbed()
			.setTitle('Successfully muted user.')
			.setAuthor(args.user.user.tag, args.user.user.displayAvatarURL())
			.setColor('#10B981')
			.setDescription(`${args.user.user.tag} has been muted successfully with the Punishment ID: ${punishment._id}, and would last in ${this.client.utilities.formatDuration(ms(args.duration))}`)
			.setTimestamp()
			.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
		message.channel.send(MuteUserSuccess);

		this.client.utilities.logger({
			type: 1,
			id: punishment._id,
			user: args.user,
			reason: args.reason,
			by: message.author,
			link: message.url
		});

		setTimeout(() => {
			if (!args.user.roles.cache.has(muteRole.id) && args.user.roles.cache.has(verifiedRole.id)) return;

			const UserUnmuteMailEmbed = new MessageEmbed()
				.setTitle('User Muted')
				.setColor('#059669')
				.setDescription(`You have been unmuted on ${message.guild.name} for the following reasons below.`)
				.addFields([
					{ name: 'Reason', value: 'Galaxa Auto Ummute', inline: true }
				])
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());

			args.user.send('You have been unmuted, check the following below for more information.', UserUnmuteMailEmbed);

			this.client.utilities.logger({
				type: 2,
				id: punishment._id,
				user: args.user,
				reason: 'Galaxa Auto Unmute',
				by: this.client.user,
				link: message.url
			});

			args.user.roles.remove(muteRole);
			args.user.roles.add(verifiedRole);
		}, ms(args.duration));
	}

};
