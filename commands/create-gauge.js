const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile
const { gaugeDisplayEmbed } = require('../helpers/display-gauge');
const { gaugeAdminRole: gaugeRole } = require('../helpers/roles.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create a new gauge')
        .addStringOption(option => option.setName('gauge-name').setDescription('Enter the gauge\'s name').setRequired(true))
        .addIntegerOption(option => option.setName('gauge-goal').setDescription('Enter the gauge\'s goal').setRequired(true))
        .addIntegerOption(option => option.setName('gauge-value').setDescription('Enter the gauge\'s starting value')),
	async execute(interaction) {
        if (!gaugeRole || interaction.member.roles.cache.some(role => role.name === gaugeRole)) {
            await interaction.deferReply();
            const gaugeName = interaction.options.getString('gauge-name');
            const gaugeGoal = interaction.options.getInteger('gauge-goal');
            const gaugeValue = interaction.options.getInteger('gauge-value') ? 
                interaction.options.getInteger('gauge-value')
                : 0;
            const keyv = new Keyv({
                store: new KeyvFile({
                    filename: `data/gauges.json`, // the file path to store the data
                })
            });
            if (await keyv.get(gaugeName) == null) {
                console.log(`Creating new gauge ${gaugeName}`)
                // get a list of all gauges, or create it if it doesn't exist
                let allGauges = await keyv.get('all');
                if (allGauges) {
                    allGauges.push(gaugeName);
                } else {
                    allGauges = [gaugeName];
                }
                let gaugeObject = {'goal': gaugeGoal, 'value': gaugeValue};
                await keyv.set('all', allGauges);
                await keyv.set(gaugeName, gaugeObject);
                const embed = await gaugeDisplayEmbed(gaugeObject, gaugeName);
                await interaction.editReply({ content: `Created new gauge ${gaugeName}`, embeds: [embed], components: [] });
            } else {
                let errorMsg = `Gauge with name ${gaugeName} already exists!`;
                console.log(errorMsg)
                await interaction.editReply(errorMsg);
            }
        } else {
            await interaction.reply(`Sorry, you need the role ${gaugeRole} to do that.`);
        }
	},
};