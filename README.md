# Gauge Bot

## Pre-requisites

- node >= 16.6.0
- npm

## Getting Started

This bot is built with [discord.js](https://discord.js.org/).

To get it set up:

```
npm install
node index.js
```

If you add a new command, run:

`node deploy-commands.js`

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