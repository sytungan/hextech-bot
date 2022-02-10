const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { CLIENT_ID, HEXTECH_TOKEN } = require("../environments");

const commands = [
    new SlashCommandBuilder()
        .setName("ok")
        .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
        .setName("server")
        .setDescription("Replies with server info!"),
    new SlashCommandBuilder()
        .setName("user")
        .setDescription("Replies with user info!"),
    new SlashCommandBuilder()
        .setName("play")
        .setDescription("play a song")
        .addStringOption((option) =>
            option.setName("query").setDescription("Search").setRequired(true)
        ),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(HEXTECH_TOKEN);

rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
