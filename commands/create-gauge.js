const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new gauge')
        .addStringOption(option => option.setName('gauge-name').setDescription('Enter the gauge\'s name').setRequired(true))
        .addIntegerOption(option => option.setName('gauge-goal').setDescription('Enter the gauge\'s goal').setRequired(true))
        .addIntegerOption(option => option.setName('gauge-value').setDescription('Enter the gauge\'s starting value')),
	async execute(interaction) {
        await interaction.deferReply();
        const gaugeName = interaction.options.getString('gauge-name');
        const gaugeGoal = interaction.options.getInteger('gauge-goal');
        const gaugeValue = interaction.options.getInteger('gauge-value') ? 
            interaction.options.getString('gauge-value')
            : 0;
        const keyv = new Keyv({
            store: new KeyvFile({
                filename: `data/gauges.json`, // the file path to store the data
            })
        });
        if (await keyv.get(gaugeName) == null) {
            console.log(`Creating new gauge ${gaugeName}`)
            await keyv.set(gaugeName, {'goal': gaugeGoal, 'value': gaugeValue});
		    await interaction.editReply(`Created new gauge ${gaugeName}`);
        } else {
            console.log(`Gauge with name ${gaugeName} already exists!`)
            await interaction.editReply(`Gauge with name ${gaugeName} already exists!`);
        }
	},
};