# Gauge Bot

## Pre-requisites

- node >= 16.6.0
- npm

## Getting Started

This bot is built with [discord.js](https://discord.js.org/).

To get it set up, first [create a new bot user](https://discordjs.guide/preparations/setting-up-a-bot-application.html). Save the token for use later.

Use the URL Generator with the following permissions.

Scopes:

- `bot`
- `application.commands`

Bot Permissions:

- `Use Slash Commands`
- `Read Messages/View Channels`

Copy and paste the resulting URL into your browser and add the bot to the server.

Then, create a `.env` file with the following values from that bot user. (See `.env.example`.)

```
DISCORD_TOKEN=
CLIENT_ID=
```

Then, run these commands:

```
npm install
node deploy-commands.js
node index.js
```

After the first install, all you have to do is run `node index.js`. 

If you add a new command, run `node deploy-commands.js` again.

Commands live in dedicated files in the `commands` folder.

## Goal

Create a Discord bot capable of displaying and updating multiple gauges.

## Interface

Users should be able to:

1. Add new gauges with a specified total
2. Add units to a specific gauge
3. Subtract units from a specific gauge

Sample interface:

```
/create <gauge name> <goal> - create a new gauge + goal
/plus <gauge name> <num> - add num items to a gauge
/minus <gauge name> <num> - delete num items from a gauge
/show <gauge name>
```