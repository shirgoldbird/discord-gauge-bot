const { MessageEmbed } = require('discord.js');

module.exports = {
    // NOTE: this is the one command that takes a gauge object, NOT an interaction
    // since we want to reduce side effects and focus on display only
	async gaugeDisplayEmbed(gauge, gaugeName) {
        const gaugeGoal = gauge.goal;
        const gaugeValue = gauge.value;
        let gaugeDisplay = `${gaugeValue} / ${gaugeGoal}`;
        let gaugeStatus = 'Progress';
        let gaugeColor = '#0099ff';
        if (gaugeValue >= gaugeGoal) {
            gaugeStatus = 'Complete!';
            gaugeDisplay = `🎉 ${gaugeDisplay}`;
            gaugeColor = '#d400ff';
        }
        console.log(`${gaugeName} ${gaugeStatus}: ${gaugeDisplay}`);
        const embed = new MessageEmbed()
        .setColor(gaugeColor)
        .setTitle(`${gaugeName} ${gaugeStatus}`)
        .setDescription(gaugeDisplay);

        return { embeds: [embed], components: [] };
	},
};