const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { CLIENT_ID, HEXTECH_TOKEN } = require("../environments");

const commands = [
    new SlashCommandBuilder()
        .setName("play")
        .setDescription("play a song")
        .addStringOption((option) =>
            option.setName("query").setDescription("Search").setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("build")
        .setDescription("Start build app")
        .addStringOption((option) =>
            option
                .setName("branch")
                .setDescription("Branch name")
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName("gacha")
        .setDescription("Open a random hextech")
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(HEXTECH_TOKEN);

rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
