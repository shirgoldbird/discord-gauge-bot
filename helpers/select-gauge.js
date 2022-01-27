const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile

module.exports = {
	async gaugeSelectList(interaction) {
        await interaction.deferReply();

        const keyv = new Keyv({
            store: new KeyvFile({
                filename: `data/gauges.json`, // the file path to store the data
            })
        });
        // get all gauges
        let allGauges = await keyv.get('all');
        if (allGauges) {
            console.log(`Got ${allGauges.length} gauges`)
            let allGaugeOptions = [];
            // turn them into options for select list
            allGauges.forEach((gauge) => {
                let gaugeOption = {
                    label: gauge,
                    value: gauge
                }
                allGaugeOptions.push(gaugeOption)
            });

            if (allGaugeOptions.length == 0) {
                await interaction.editReply({ content: 'No gauges available. Add one with /create.' });
            } else {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('select')
                            .setPlaceholder('Nothing selected')
                            .addOptions(allGaugeOptions),
                );

                await interaction.editReply({ content: 'Select a gauge:', components: [row], ephemeral: true });
            }
        } else {
            console.log("No gauges to get!");
            await interaction.editReply({ content: 'No gauges available. Add one with /create.' });
        }
    },
};