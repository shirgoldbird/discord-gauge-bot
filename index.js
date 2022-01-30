const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const { Client, Collection } = require('discord.js');

const client = new Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES'
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() && !interaction.isSelectMenu()) return;

    let commandName;

    if (interaction.isCommand()) {
        commandName = interaction.commandName;
    } else if (interaction.isSelectMenu()) {
        commandName = interaction.message.interaction.commandName;
    }

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Login to Discord with your client's token
client.login(token);