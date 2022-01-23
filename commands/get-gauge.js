const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile

const keyv = new Keyv({
  store: new KeyvFile({
    filename: `data/gauges.json`, // the file path to store the data
  })
})

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Get a gauge')
        .addStringOption(option => option.setName('gauge-name').setDescription('Enter the gauge\'s name').setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const gaugeName = interaction.options.getString('gauge-name');
        const gauge = await keyv.get(gaugeName);
        if (gauge == null) {
            console.log(`Couldn't find ${gaugeName}. Did you mean to /add it?`);
		    await interaction.editReply(`Couldn't find ${gaugeName}. Did you mean to /add it?`);
        } else {
            console.log(`Got gauge ${gaugeName}: ${gauge}`);
            await interaction.editReply(`Got gauge ${gaugeName}: ${gauge}`);
        }
	},
};