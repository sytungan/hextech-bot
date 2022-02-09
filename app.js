const { HEXTECH_TOKEN } = require("./environments");

const { Client, Intents } = require("discord.js");
const { MessageActionRow, MessageButton } = require('discord.js');

const {execute} = require('./src/music')

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }
    if (interaction.isButton()) interaction.channel.send("uh m ngu");
	console.log(interaction);
});

client.on("messageCreate", function (message) {
  const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('ấn thể thấy mình ngu')
					.setStyle('PRIMARY')
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
          execute(message)
        }
});

client.login(HEXTECH_TOKEN);
