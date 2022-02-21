const { HEXTECH_TOKEN } = require("./environments");

const { Client, Intents } = require("discord.js");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const { execute } = require("./src/music");

const { build_gitlab } = require("./src/build");

const { gacha } = require("./src/gacha");

const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});

const { Player } = require("discord-player");

// Create a new Player (you don't need any API Key)
const player = new Player(client);

player.on("trackStart", (queue, track) =>
    queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
);

player.on("queueEnd", (queue) =>
    queue.metadata.channel.send(`🙌 **Goodbye**, No more songs!`)
);

player.on("botDisconnect", (queue) =>
    queue.metadata.channel.send(
        `😓 There are **${queue.tracks.length} songs that have not been played**!`
    )
);

player.on("error", (queue, error) =>
    queue.metadata.channel.send(`😓 | ${error.message}!`)
);

player.on("connectionError", (queue, error) =>
    queue.metadata.channel.send(`🐞 | ${error.message}!`)
);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === "gacha") {
        await interaction.reply("Wait!");
        gacha(interaction);
    }
    if (interaction.commandName === "play") {
        if (!interaction.member.voice.channelId)
            return await interaction.reply({
                content: "You are not in a voice channel!",
                ephemeral: true,
            });
        if (
            interaction.guild.me.voice.channelId &&
            interaction.member.voice.channelId !==
                interaction.guild.me.voice.channelId
        )
            return await interaction.reply({
                content: "You are not in my voice channel!",
                ephemeral: true,
            });
        const query = interaction.options.get("query").value;
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel,
            },
        });

        // verify vc connection
        try {
            if (!queue.connection)
                await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({
                content: "Could not join your voice channel!",
                ephemeral: true,
            });
        }

        await interaction.deferReply();
        const track = await player
            .search(query, {
                requestedBy: interaction.user,
            })
            .then((x) => x.tracks[0]);
        if (!track)
            return await interaction.followUp({
                content: `❌ | Track **${query}** not found!`,
            });

        queue.play(track);

        return await interaction.followUp({
            content: `⏱️ | Loading track **${track.title}**!`,
        });
    }
    if (interaction.commandName === "build") {
        let branch = interaction.options.get("branch").value;
        build_gitlab(branch, "develop")
            .then((msg) => {
                interaction.reply(msg);
            })
            .catch((err) => {
                interaction.reply(err.message);
                interaction.channel.send("Pls build again").then((message) => {
                    message.react("👍");
                    message.react("👎");
                });
            });
    }
});

client.on("messageCreate", async (message) => {
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("primary")
            .setLabel("ấn thể thấy mình ngu")
            .setStyle("PRIMARY")
    );
    if (message.content.includes("bot met khong")) message.react("✅");
    if (message.content.includes("bot vat va roi")) message.reply("Xin cam on");
    if (message.content.includes("cam on bot")) message.react("❤️");
    // if (message.content.includes("sex"))
    //     message.channel.send({
    //         components: [row],
    //         files: [
    //             "https://content.gabrieltanner.org/content/images/2019/09/music.jpg",
    //         ],
    //     });
    if (message.content.startsWith("skip")) {
        const queue = player.createQueue(message.guild, {
            metadata: {
                channel: message.channel,
            },
        });
        if (queue.connection) {
            message.react("✅");
            queue.skip();
        }
    }
    if (
        message.content.startsWith("bat nhac:") ||
        message.content.startsWith("mo bai:") ||
        message.content.startsWith("play:") ||
        message.content.startsWith("p:")
    ) {
        if (!message.member.voice.channelId)
            return await message.channel.send({
                content: "You are not in a voice channel!",
                ephemeral: true,
            });
        message.react("✅");
        const query = message.content.split(":")[1];
        const queue = player.createQueue(message.guild, {
            metadata: {
                channel: message.channel,
            },
        });

        // verify vc connection
        try {
            if (!queue.connection)
                await queue.connect(message.member.voice.channel);
        } catch {
            queue.destroy();
            return await message.channel.send({
                content: "Could not join your voice channel!",
                ephemeral: true,
            });
        }
        const track = await player
            .search(query, {
                requestedBy: message.author,
            })
            .then((x) => x.tracks[0]);
        if (!track)
            return await message.reply({
                content: `❌ | Track **${query}** not found!`,
            });

        queue.play(track);

        return await message.channel.send({
            content: `⏱️ | Loading track **${track.title}**!`,
        });
    }
    if (
        message.content.includes("ua bai gi") ||
        message.content.includes("bai nay hay vay") ||
        message.content.includes("bai gi hay vay") ||
        message.content.includes("bai nay ten gi") ||
        message.content.includes("bài này tên gì") ||
        message.content.includes("what is this song")
    ) {
        const queue = player.createQueue(message.guild, {
            metadata: {
                channel: message.channel,
            },
        });
        if (queue.connection) {
            message.react("👀");
            const song = queue.current;
            const embed = new MessageEmbed()
                .setColor("#EF6D6D")
                .setTitle(`**${song.title}**`)
                .setURL(song.url)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: "Author 🌊", value: `**${song.author}**` },
                    {
                        name: "Views 👀",
                        value: song.views.toString(),
                        inline: true,
                    },
                    { name: "Duration ⌛", value: song.duration, inline: true },
                    {
                        name: "Request by 💿",
                        value: song.requestedBy.username,
                        inline: true,
                    }
                );
            message.reply({
                embeds: [embed],
            });
        }
    }
    if (
        message.content.includes("queue") ||
        message.content.includes("playlist") ||
        message.content.includes("danh sach phat")
    ) {
        const queue = player.createQueue(message.guild, {
            metadata: {
                channel: message.channel,
            },
        });
        if (queue.connection) {
            let lstTrack = "";
            queue.tracks.forEach((song, idx) => {
                lstTrack += `${idx + 1}. ${song.title}\n`;
            });
            message.reply({
                content: `\`\`\`md\n${lstTrack}\`\`\``,
            });
        }
    }
    if (
        message.content.includes("join") ||
        message.content.includes("zo day bot") ||
        message.content.includes("hextech")
    ) {
        let channel = message.member.voice.channel;
        // player.voiceUtils.connect({channel: channel})
        if (channel) {
            message.react("✅")
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
        }
        else {
            message.react("❌")
        }
    }
    if (
        message.content.includes("out") ||
        message.content.includes("di di bot") ||
        message.content.includes("bot cut")
    ) {
        const queue = player.createQueue(message.guild, {
            metadata: {
                channel: message.channel,
            },
        });
        if (queue.connection) {
            message.react("😭")
            queue.clear()
            queue.stop()
        }
    }
});

client.login(HEXTECH_TOKEN);
