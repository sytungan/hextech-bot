const { Message } = require("discord.js");
const { Client } = require("discord.js");
const play = require("play-dl");
const { StreamDownloader } = require("playdl-music-extractor");
const {
    joinVoiceChannel,
    getVoiceConnection,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    StreamType,
} = require("@discordjs/voice");

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

    // const stream = await play.stream(args[0], {
    //     discordPlayerCompatibility: true,
    // });
    const audioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    const Data = await StreamDownloader('Despacito', {
        Limit: 1,
        Quality: 'highest',
        Cookies: undefined, //YT Cookies Headers in String form
        UserAgents: undefined, //[{"Mozilla/5.0 (Windows NT 10.0; Win64; x64) ....."}] Format(UserAgents)
        IgnoreError: true,
      })

      if(Data.error) throw Data.error;

    const resource = createAudioResource(Data.tracks[0].stream, {
        inputType: Data.tracks[0].stream_type,
    });

    audioPlayer.play(resource);

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
