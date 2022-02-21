const { default: axios } = require("axios");
const { CommandInteraction } = require("discord.js");
const { LOL_VERSION } = require("../../environments");
/**
 * @param {CommandInteraction<CacheType>} interaction The date
 */
async function gacha(interaction) {
    let hextechBox = [
        "https://static.wikia.nocookie.net/leagueoflegends/images/a/af/KDA_Orb_Opening.gif",
        "https://static.wikia.nocookie.net/leagueoflegends/images/d/de/Masterwork_Chest_Opening.gif",
    ];
    interaction.channel.send({
        files: [hextechBox[Math.floor(Math.random() * hextechBox.length)]],
    });
    let lstSkins = [];
    let promises = [];
    await axios
        .get(
            `http://ddragon.leagueoflegends.com/cdn/${LOL_VERSION}/data/en_US/champion.json`
        )
        .then(async (response) => {
            let lstChampions = [];
            const BASE_SPLASH_URL =
                "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
            for (const champion in response.data.data) {
                lstChampions.push(champion);
            }
            lstChampions.forEach((champion) => {
                promises.push(
                    axios
                        .get(
                            `http://ddragon.leagueoflegends.com/cdn/12.3.1/data/vn_VN/champion/${champion}.json`
                        )
                        .then((response) => {
                            response.data.data[`${champion}`].skins.forEach(
                                (skin) => {
                                    lstSkins.push({
                                        id: skin.id,
                                        title: skin.name,
                                        image:
                                            BASE_SPLASH_URL +
                                            champion +
                                            "_" +
                                            skin.num +
                                            ".jpg",
                                    });
                                }
                            );
                        })
                );
            });
        });
    Promise.all(promises).then(() => {
        let skins = lstSkins
        let skin = skins[Math.floor(Math.random() * lstSkins.length)]
        interaction.channel.send({
            content: `Chúc mừng ${interaction.user} đã nhận được: \n ${skin.title}`,
            files: [skin.image],
        });
    });
    
}

module.exports = {
    gacha,
};
