const { Message } = require("discord.js");
const { Client } = require("discord.js");
const play = require('play-dl');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType } = require("@discordjs/voice");

/**
 * @param {Message} message The date
 */
async function execute(message) {
    const args = message.content.split(" ");
    message.react("👍");
    const channel = message.member.voice.channel;

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

		const stream = await play.stream(args[0])
		const audioPlayer = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});

		const resource = createAudioResource(stream.stream, {inputType: stream.type});

		audioPlayer.play(resource)

    const subscription = connection.subscribe(audioPlayer);
	

    if (!channel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }
}

module.exports = {
    execute,
};
