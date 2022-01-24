const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile
const { gaugeSelectList } = require('../helpers/select-gauge');
const { gaugeDisplayEmbed } = require('../helpers/display-gauge');
const { gaugeAdminRole, gaugeEditRole: gaugeRole } = require('../helpers/roles.js');

function isNumeric(value) {
    return /^\d+$/.test(value);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Set a new value for a gauge'),
    async execute(interaction) {
        if (!gaugeRole || interaction.member.roles.cache.some(role => [gaugeAdminRole, gaugeRole].indexOf(role.name) != -1)) {
            if (interaction.isCommand()) {
                console.log('Got get command, returning select menu')
                // Get a select list of all gauges
                await gaugeSelectList(interaction);
            } else if (interaction.isSelectMenu()) {
                //await interaction.deferReply();
                const gaugeName = interaction.values[0];
                interaction.reply({ content: `Please enter the new value for ${gaugeName}.`, ephemeral: true });
                
                const filter = m => interaction.user.id === m.author.id;
                let messages;
                try {
                    messages = await interaction.channel.awaitMessages({ filter, time: 60000 , max: 1, errors: ['time'] });
                } catch {
                    interaction.followUp({ content: 'You did not enter any input!', ephemeral: true });
                    return;
                }
                const newValue = messages.first().content;
                if (newValue && isNumeric(newValue)) {
                    interaction.followUp({ content: `Setting ${gaugeName} to ${newValue}.`, ephemeral: true });
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
                        // uncomment to have "add" behavior rather than "set"
                        const gaugeValue = newValue //+ gauge.value;
                        const gaugeObject = {'goal': gaugeGoal, 'value': gaugeValue};
                        await keyv.set(gaugeName, gaugeObject);
                        const embed = await gaugeDisplayEmbed(gaugeObject, gaugeName);
                        console.log(`${gaugeName} status: ${gaugeValue} / ${gaugeGoal}`);
                        await interaction.followUp({ content: null, embeds: [embed], components: [] });
                    }
                } else {
                    interaction.followUp({ content: `Please try again, using a positive whole number.`, ephemeral: true });
                }
            }
        } else {
            await interaction.reply(`Sorry, you need the role ${gaugeRole} to do that.`);
        }
    }
};