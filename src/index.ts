import * as dotenv from 'dotenv'
import * as Discord from 'discord.js'

import {Status} from "./interfaces"
import {getStatusFromDb, updateDbStatus} from "./firebase"
import { duckHasQuacked, duckWakesUp, getGuildStatus, timeForDuck } from './statusUtils'
import {handleBang, handleBef, handleFriends, handleKillers, quack} from "./messageHandlers";
import {matchesCommand} from "./stringUtils";
import * as fs from 'fs'

dotenv.config()

const client = new Discord.Client()

let status: Status

client.on('ready', async () => {
  status = await getStatusFromDb()
  await fs.writeFileSync('./backup.json', JSON.stringify(status))
  console.log(`Logged in as ${client.user && client.user.tag}!`)
})


client.on('message', async (msg: Discord.Message) => {
  const guildStatus = getGuildStatus(msg, status)
  if (!msg.guild) {
    console.log('Guild missing from msg object')
  } else if (!msg.system && !msg.author.bot) {
    if (matchesCommand(msg.content, 'bang')) {
      status[msg.guild.id] = handleBang(msg, guildStatus)
      updateDbStatus(status)
    } else if (matchesCommand(msg.content, 'bef')) {
      status[msg.guild.id] = handleBef(msg, guildStatus)
      updateDbStatus(status)
    } else if (matchesCommand(msg.content, 'duckStats')) {
      msg.reply('Duck server leaderboard coming soon...')
      // TODO Duck Stats: 7643 killed and 7054 befriended in <servername>. Across 1048 servers 553293 ducks have been killed and 463514 befriended. Top Server: <servername> with 17280 kills and <servername> with 13296 friends
    } else if (matchesCommand(msg.content, 'friends')) {
      handleFriends(msg, guildStatus)
    } else if (matchesCommand(msg.content, 'killers')) {
      handleKillers(msg, guildStatus)
    } else if (timeForDuck(guildStatus) && !duckHasQuacked(guildStatus) && duckWakesUp(guildStatus.guildSettings)) {
      status[msg.guild.id] = quack(msg, guildStatus)
      updateDbStatus(status)
    }

  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
