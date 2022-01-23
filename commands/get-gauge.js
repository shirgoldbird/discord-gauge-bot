const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
const Keyv = require('keyv')
const KeyvFile = require('keyv-file').KeyvFile

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Get a gauge')
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
        if (gauge == null) {
            console.log(`Couldn't find ${gaugeName}. Did you mean to /add it?`);
		    await interaction.editReply(`Couldn't find ${gaugeName}. Did you mean to /add it?`);
        } else {
            const gaugeGoal = gauge.goal;
            const gaugeValue = gauge.value;
            console.log(`${gaugeName} status: ${gaugeValue} / ${gaugeGoal}`);
            const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${gaugeName} Progress`)
			.setDescription(`${gaugeValue} / ${gaugeGoal}`);

            await interaction.editReply({ embeds: [embed]});
        }
	},
};