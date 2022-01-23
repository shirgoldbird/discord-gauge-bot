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
		.setName('add')
		.setDescription('Add a gauge')
        .addStringOption(option => option.setName('gauge-name').setDescription('Enter the gauge\'s name').setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const gaugeName = interaction.options.getString('gauge-name');
        if (await keyv.get(gaugeName) == null) {
            console.log(`Creating new gauge ${gaugeName}`)
            await keyv.set(gaugeName, {});
            // it'd be nice to write to file here but I can't figure out how
            //await keyv.save();
		    await interaction.editReply(`Added new gauge ${gaugeName}`);
        } else {
            console.log(`Gauge with name ${gaugeName} already exists!`)
            await interaction.editReply(`Gauge with name ${gaugeName} already exists!`);
        }
	},
};