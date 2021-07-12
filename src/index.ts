import * as dotenv from 'dotenv'
dotenv.config()
import * as Discord from 'discord.js'

import {Status} from "./interfaces"
import {getStatusFromDb, updateDbStatus} from "./firebase"
import {getGuildStatus, timeForDuck} from "./statusUtils"
import {handleBang, handleBef, quack} from "./messageHandlers";


const client = new Discord.Client()

let status: Status

client.on('ready', async () => {
  status = await getStatusFromDb()
  console.log(`Logged in as ${client.user && client.user.tag}!`)
})

client.on('message', async (msg: Discord.Message) => {
  const guildStatus = getGuildStatus(msg, status)
  console.log('guild status: ' + JSON.stringify(guildStatus))

  if(!msg.guild) {
    console.log('Guild missing from msg object')
  } else {
    if (msg.content.includes('.bang')) {
      status[msg.guild.id] = handleBang(msg, guildStatus)
      updateDbStatus(status)
    }
    else if (msg.content.includes('.bef')) {
      status[msg.guild.id] = handleBef(msg, guildStatus)
      updateDbStatus(status)
    }
    else if (timeForDuck(guildStatus)) {
      status[msg.guild.id] = quack(msg, guildStatus)
      updateDbStatus(status)
    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
