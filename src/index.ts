import * as dotenv from 'dotenv'
dotenv.config()

import * as Discord from 'discord.js'
import {Status} from "./Interfaces"
import {getStatusFromDb, updateDbStatus} from "./firebase"
import {timeForDuck} from "./statusUtils"
import {handleBang, handleBef, quack} from "./messageHandlers";


const client = new Discord.Client()

let status: Status

client.on('ready', async () => {
  status = await getStatusFromDb()
  console.log(`Logged in as ${client.user && client.user.tag}!`)
})

client.on('message', async (msg: Discord.Message) => {
  if (msg.content.includes('.bang')) {
    status = handleBang(msg, status)
  } else if (msg.content.includes('.bef')) {
    status = handleBef(msg, status)
  } else if (timeForDuck(msg, status)) {
    status = await quack(msg, status)
  }

  updateDbStatus(status)
})

client.login(process.env.DISCORD_BOT_TOKEN)
