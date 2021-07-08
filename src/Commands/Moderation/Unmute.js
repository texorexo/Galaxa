// /* eslint-disable consistent-return */
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Punishment = require('../../MongoDB/Models/Punishments');

module.exports = class Unmute extends Command {

	constructor() {
		super('unmute', {
			aliases: ['unmute', 'unsilence'],
			description: {
				content: 'Ummutes selected users in the server.',
				usage: '<user> [reason]'
			},
			channel: 'guild',
			args: [
				{
					id: 'user',
					type: 'member',
					prompt: {
						start: 'Which user do you want to Unmute? Please mention them or respond with their ID.',
						retry: 'Tough luck, that user isi\'nt found, try again.'
					}
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
			const unmuteEmbed = new MessageEmbed()
				.setTitle('mute')
				.setColor('#db1c07')
				.setDescription('Mutes the selected user.')
				.addFields(
					{
						name: 'Constructor', value: '**.unmute <user> [reason | predefined reason code]**', inline: true
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
				'No users has been selected to unmute. Please specify one.',
				unmuteEmbed
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

		if (!verifiedRole) {
			const NoVerifyRoleException = new MessageEmbed()
				.setTitle('NoVerifyRoleException: No Verify command detected')
				.setColor('#db1c07')
				.setDescription('No Verify roles has been found in the server. Please create one and try again.')
				.setTimestamp()
				.setAuthor('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());
			return message.reply('NoVerifyRoleException: No Verify Role found.', NoVerifyRoleException);
		}

		if (args.user.roles.cache.has(verifiedRole.id)) {
			const UserAlreadyMutedExeption = new MessageEmbed()
				.setTitle('UserAlreadyMutedException: User already has the `Space Cadets` role.')
				.setColor('#db1c07')
				.setDescription('The user has already been unmuted. Please select an muted user and try again.')
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

		await args.user.roles.remove(muteRole);
		await args.user.roles.add(verifiedRole);

		const UserMailEmbed = new MessageEmbed()
			.setTitle('User Unmuted')
			.setColor('#3730A3')
			.setDescription(`You have been muted on ${message.guild.name} for the following reasons below.`)
			.addFields([
				{ name: 'Reason', value: args.reason, inline: true }
			])
			.setTimestamp()
			.setFooter('Galaxa 3 | Under GPLv3', this.client.user.displayAvatarURL());

		args.user.send('You have been unmuted, check the following below for more information.', UserMailEmbed);

		const UnmuteUserSuccess = new MessageEmbed()
			.setTitle('Successfully unmuted user.')
			.setAuthor(args.user.user.tag, args.user.user.displayAvatarURL())
			.setColor('#10B981')
			.setDescription(`${args.user.user.tag} has been unmuted successfully.`)
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
