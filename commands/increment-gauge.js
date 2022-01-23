const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile

module.exports = {
	data: new SlashCommandBuilder()
		.setName('plus')
		.setDescription('Increment a gauge')
        .addStringOption(option => option.setName('gauge-name').setDescription('Enter the gauge\'s name').setRequired(true))
        .addNumberOption(option => option.setName('gauge-value').setDescription('Enter the gauge\'s new value').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const gaugeName = interaction.options.getString('gauge-name');
        const valueToAdd = interaction.options.getNumber('gauge-value');
        const keyv = new Keyv({
            store: new KeyvFile({
                filename: `data/gauges.json`, // the file path to store the data
            })
        });
        const gauge = await keyv.get(gaugeName);
        if (gauge == null) {
            console.log(`Couldn't find ${gaugeName}. Did you mean to /add it?`);
		    await interaction.editReply(`Couldn't find ${gaugeName}. Did you mean to /add it?`);
        } else {
            const gaugeGoal = gauge.goal;
            const gaugeValue = valueToAdd + gauge.value;
            await keyv.set(gaugeName, {'goal': gaugeGoal, 'value': gaugeValue});
            console.log(`${gaugeName} status: ${gaugeValue} / ${gaugeGoal}`);
            await interaction.editReply(`${gaugeName} status: ${gaugeValue} / ${gaugeGoal}`);
        }
	},
};