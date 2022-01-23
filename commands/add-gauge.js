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
        .addStringOption(option => option.setName('gauge-name').setDescription('Enter the gauge\'s name').setRequired(true))
        .addNumberOption(option => option.setName('gauge-goal').setDescription('Enter the gauge\'s goal').setRequired(true))
        .addNumberOption(option => option.setName('gauge-value').setDescription('Enter the gauge\'s starting value')),
	async execute(interaction) {
        await interaction.deferReply();
        const gaugeName = interaction.options.getString('gauge-name');
        const gaugeGoal = interaction.options.getNumber('gauge-goal');
        const gaugeValue = interaction.options.getNumber('gauge-value') ? 
            interaction.options.getString('gauge-value')
            : 0;
        if (await keyv.get(gaugeName) == null) {
            console.log(`Creating new gauge ${gaugeName}`)
            await keyv.set(gaugeName, {'goal': gaugeGoal, 'value': gaugeValue});
            // it'd be nice to write to file here but I can't figure out how
            //await keyv.save();
		    await interaction.editReply(`Added new gauge ${gaugeName}`);
        } else {
            console.log(`Gauge with name ${gaugeName} already exists!`)
            await interaction.editReply(`Gauge with name ${gaugeName} already exists!`);
        }
	},
};