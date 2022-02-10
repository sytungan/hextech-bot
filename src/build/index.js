const axios = require("axios").default;
const { Base } = require("discord.js");
const { PIPELINE_TOKEN, PIPELINE_URL } = require("../../environments");

/**
 * @param {string} branch The date
 * @param {string} flavor The date
 */
async function build_gitlab(branch, flavor) {
    return await axios
        .post(PIPELINE_URL, {
            token: PIPELINE_TOKEN,
            ref: branch,
        })
        .then((response) => {
            let data = response.data;
            return "Oke thanh cong"
        })
        .catch((error) => {
            let msgErr = error.response.data.message.base[0]
            throw new Error(msgErr);
        });
}
module.exports = {
    build_gitlab,
};
