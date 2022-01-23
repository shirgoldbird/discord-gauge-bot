const { SlashCommandBuilder } = require('@discordjs/builders');
const { gaugeSelectList } = require('../helpers/select-gauge');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Delete a gauge'),
	async execute(interaction) {
        if (interaction.isCommand()) {
            console.log('Got delete command, returning select menu')
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
            if (gauge) {
                console.log(`Deleting gauge ${gaugeName}`)
                const gaugeGoal = gauge.goal;
                const gaugeValue = gauge.value;
                console.log(`${gaugeName} status: ${gaugeValue} / ${gaugeGoal}`);
                await keyv.delete(gaugeName);
                let allGauges = await keyv.get('all');
                if (allGauges) {
                    const index = allGauges.indexOf(gaugeName);
                    if (index > -1) {
                        allGauges.splice(index, 1);
                    }
                } else {
                    allGauges = [];
                }
                await keyv.set('all', allGauges);

                await interaction.editReply({ content: `Deleted gauge ${gaugeName} (${gaugeValue} / ${gaugeGoal})`, components: [] });
            } else {
                let errorMsg = `No gauge named ${gaugeName} to delete!`;
                console.log(errorMsg);
                await interaction.editReply({ content: errorMsg, components: [] });
            }
        }
	},
};