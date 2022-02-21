require('dotenv').config()
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID
const HEXTECH_TOKEN = process.env.HEXTECH_TOKEN
const PIPELINE_TOKEN = process.env.PIPELINE_TOKEN
const PIPELINE_URL = process.env.PIPELINE_URL
const LOL_VERSION = process.env.LOL_VERSION

module.exports = {
    CLIENT_ID,
    GUILD_ID,
    HEXTECH_TOKEN,
    PIPELINE_TOKEN,
    PIPELINE_URL,
    LOL_VERSION
}