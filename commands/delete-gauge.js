const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete a gauge')
        .addStringOption(option => option.setName('gauge-name').setDescription('Enter the gauge\'s name').setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const gaugeName = interaction.options.getString('gauge-name');
        const keyv = new Keyv({
            store: new KeyvFile({
                filename: `data/gauges.json`, // the file path to store the data
            })
        });
        const gauge = await keyv.get(gaugeName);
        if (gauge) {
            console.log(`Deleting gauge ${gaugeName}`)
            const gaugeGoal = gauge.goal;
            const gaugeValue = gauge.value;
            console.log(`${gaugeName} status: ${gaugeValue} / ${gaugeGoal}`);
            await keyv.delete(gaugeName);
		    await interaction.editReply(`Deleted gauge ${gaugeName} (${gaugeValue} / ${gaugeGoal})`);
        } else {
            console.log(`No gauge named ${gaugeName} to delete!`)
            await interaction.editReply(`No gauge named ${gaugeName} to delete!`);
        }
	},
};