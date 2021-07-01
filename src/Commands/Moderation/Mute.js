// /* eslint-disable consistent-return */
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { create } = require('sourcebin');
const ms = require('ms');
const Punishment = require('../../MongoDB/Models/Punishments');

module.exports = class extends Command {

	constructor() {
		super('mute', {
			aliases: ['mute', 'sush', 'silence'],
			args: [
				{
					id: 'user',
					type: 'member'
				},
				{
					id: 'duration',
					type: 'lowercase'
				},
				{
					id: 'reason',
					match: 'rest'
				}
			],
			clientPermissions: ['MANAGE_ROLES', 'SEND_MESSAGES'],
			category: 'Moderation',
			description: 'Mute users in the server.',
			argumentDefaults: {
				prompt: {
					retries: 2,
					time: 5000,
					start: 'Extra arguments are required, please enter them now.'
				}
			}
		});
	}

	condition(message) {
		if (
			!message.member.roles.cache.some(
				(role) => role.name === 'Ship Moderators'
			)
		) {
			return 'Ship Moderators';
		} else if (
			!message.member.roles.cache.some(
				(role) => role.name === 'Ship Administrators'
			)
		) {
			return 'Ship Administrators';
		} else if (
			!message.member.roles.cache.some(
				(role) => role.name === 'Ship Vice Captain'
			)
		) {
			return 'Ship Vice Captain';
		} else if (
			!message.member.roles.cache.some((role) => role.name === 'Ship Captain')
		) {
			return 'Ship Captain';
		} else { return null; }
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

		if (args.duration) args.duration = '1h';

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

		const muteRole = message.guild.roles.cache.get(role => role.find('Muted'));
		const verifiedRole = message.guild.roles.cache.get(role => role.find('Space Cadets'));

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

		const strikes = Punishment.get({ user: args.user.id }).gte(Date.now()).lt(Date.now() - (7 * 24 * 60 * 60));

		if (strikes.length >= 4) {
			const StrikeWarning = new MessageEmbed()
				.setTitle('Selected User has reached 4 strikes')
				.setColor('#FBBF24')
				.setAuthor(args.member.tag, args.member.displayAvatarURL())
				.setDescription('The selected user has already recieved 4 strikes within the last 2 weeks. Suggested to kick the user.')
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3');
			message.reply(StrikeWarning);
		} else if (strikes.length >= 5) {
			const StrikeWarning = new MessageEmbed()
				.setTitle('Selected User has reached maximum strikes')
				.setColor('#FBBF24')
				.setAuthor(args.member.tag, args.member.displayAvatarURL())
				.setDescription('The selected user has already recieved 4 strikes within the last 2 weeks. Immediate ban to user for a month is recomended.')
				.setTimestamp()
				.setFooter('Galaxa 3 | Under GPLv3');
			message.reply(StrikeWarning);
		}

		if (args.member.roles.cache.find(muteRole)) {
			const UserAlreadyMutedExeption = new MessageEmbed()
				.setTitle('UserAlreadyMutedException: User already has the `Muted` role.')
				.setColor('#db1c07')
				.setDescription('The user has already been muted. Please select an unmuted user and try again.')
				.setTimestamp()
				.setAuthor('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			return message.reply('UserAlreadyMutedException: User already has the `Muted` role.', UserAlreadyMutedExeption);
		}

		if (!args.member.roles.cache.find(verifiedRole)) {
			const UserNotVerifiedException = new MessageEmbed()
				.setTitle('UserNotVerifiedException: User is not verified')
				.setColor('#db1c07')
				.setDescription('The user you selected does not have been verified.')
				.setTimestamp()
				.setAuthor('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			return message.reply('UserNotVerifiedException: User is not verified.', UserNotVerifiedException);
		}

		const punishment = new Punishment({
			type: 'MUTE',
			user: args.member.id,
			reason: args.reason
		});

		args.member.roles.remove(verifiedRole);
		args.member.roles.add(muteRole);

		const MuteUserSuccess = new MessageEmbed()
			.setTitle('Successfully muted user.')
			.setAuthor(args.member.tag, args.member.displayAvatarURL())
			.setColor('#10B981')
			.setDescription(`${args.member.tag} has been muted successfully with the Punishment ID: ${punishment._id}`)
			.setTimestamp()
			.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
		message.channel.send(MuteUserSuccess);

		this.util.logger(message, {
			type: 'MUTE',
			user: args.member,
			reason: ms(args.duration),
			by: message.author
		});

		setTimeout(() => {
			args.member.roles.remove(muteRole);
			args.member.roles.add(verifiedRole);
		}, ms(args.duration));
	}

};
