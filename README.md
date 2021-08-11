# Discord simple duckhunt (WIP)

A simple implementation of a fun duck hunt bot for Discord. Uses [discord.js](https://github.com/discordjs/discord.js). Inspired by similar IRC bots.

Must be self-hosted, requires Discord bot token and a Firebase Cloud Firestore.

Supports adding to multiple servers.

Required env vars:

`DISCORD_BOT_TOKEN`: Get this by creating a discord app and adding a bot user.

`FIREBASE_SERVICE_ACCOUNT_KEY`: Base64 encoded version of firebase serviceAccountKey.json (with cloud firestore enabled)
