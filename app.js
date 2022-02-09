const { HEXTECH_TOKEN } = require("./environments");

const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }
});

client.on("messageCreate", function (message) {
    if (message.content.includes('tri')) message.react('✅')
    if (message.content.includes('bot')) message.reply('hello')
    if (message.content.includes('ngu qua')) message.channel.send("may ngu vl")
});

client.login(HEXTECH_TOKEN);
