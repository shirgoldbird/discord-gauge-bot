const { SlashCommandBuilder } = require('@discordjs/builders');
const { gaugeSelectList } = require('../helpers/select-gauge');
const { gaugeDisplayEmbed } = require('../helpers/display-gauge');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Get a gauge\'s status'),
	async execute(interaction) {
        if (interaction.isCommand()) {
            console.log('Got get command, returning select menu')
            // Get a select list of all gauges
            await gaugeSelectList(interaction);
        } else if (interaction.isSelectMenu()) {
            await interaction.deferUpdate();
            console.log(`Attempting to get value for ${interaction.values[0]}`)
            const gaugeName = interaction.values[0];
            const keyv = new Keyv({
                store: new KeyvFile({
                    filename: `data/gauges.json`, // the file path to store the data
                })
            });
            const gauge = await keyv.get(gaugeName);
            // this should never happen since values are provided by controlled select list
            // but just in case
            if (gauge == null) {
                const errorMsg = `Couldn't find ${gaugeName}. Did you mean to /create it?`
                console.log(errorMsg);
                await interaction.editReply({ content: errorMsg, components: [] });
            } else {
                const embed = await gaugeDisplayEmbed(gauge, gaugeName);
                await interaction.editReply({ embeds: [embed], components: [] });
            }
        }
	},
};