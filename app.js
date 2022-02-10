const { HEXTECH_TOKEN } = require("./environments");

const { Client, Intents } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");

const { execute } = require("./src/music");

const { build_gitlab } = require("./src/build");

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

// add the trackStart event so when a song will be played this message will be sent
player.on("trackStart", (queue, track) =>
    queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
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
        build_gitlab(branch, "develop").then((msg) => {
            interaction.reply(msg);
        })
        .catch((err) => {
            interaction.reply(err.message);
            interaction.channel.send("Pls build again").then((message) => {
                message.react("👍");
                message.react("👎");
            });
        })
    }
});

client.on("messageCreate", function (message) {
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("primary")
            .setLabel("ấn thể thấy mình ngu")
            .setStyle("PRIMARY")
    );
    if (message.content.includes("tri")) message.react("✅");
    if (message.content.includes("bot")) message.reply("hello");
    if (message.content.includes("ngu qua")) message.channel.send("may ngu vl");
    if (message.content.includes("sex"))
        message.channel.send({
            components: [row],
            files: [
                "https://content.gabrieltanner.org/content/images/2019/09/music.jpg",
            ],
        });
    if (message.content.includes("bat nhac len")) {
        execute(message);
    }
});

client.login(HEXTECH_TOKEN);
