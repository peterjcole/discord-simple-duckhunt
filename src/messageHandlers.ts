import * as Discord from "discord.js";
import {Status} from "./Interfaces";
import {getBangFailureMessage, getBefFailureMessage, getDuck} from "./strings";
import {MAX_SECONDS_BEFORE_QUACK} from "./constants";
import {getGuildStatus, newStatus, playerSucceeds, setGuildStatus, timeSinceChange} from "./statusUtils";

export const handleBang = (msg: Discord.Message, status: Status) => {
  let guildStatus = getGuildStatus(msg, status)

  if (guildStatus.alive) {
    // TODO: You have killed 1163 ducks in #.
    if (playerSucceeds()) {
      msg.reply(`you shot a duck in ${timeSinceChange(guildStatus)} seconds!`)
      guildStatus = newStatus(false)
    } else {
      msg.reply(getBangFailureMessage())
    }
  } else {
    msg.reply('There is no duck. What are you shooting at?')
  }
  return setGuildStatus(msg, status, guildStatus)
}

export const handleBef = (msg: Discord.Message, status: Status) => {
  let guildStatus = getGuildStatus(msg, status)

  if (guildStatus.alive) {
    // TODO: You have made friends with 542 ducks in #
    if (playerSucceeds()) {
      msg.reply(`you befriended a duck in ${timeSinceChange(guildStatus)} seconds!`)
      guildStatus = newStatus(false)
    } else {
      msg.reply(getBefFailureMessage())
    }
  } else {
    msg.reply('You tried befriending a non-existent duck. That\'s freaking creepy.')
  }
  return setGuildStatus(msg, status, guildStatus)
}

export const quack = async (msg: Discord.Message, status: Status) => {
  if (!getGuildStatus(msg, status).quacked) {
    const timeout = Math.floor(Math.random() * MAX_SECONDS_BEFORE_QUACK * 1000)
    scheduleQuack(msg, timeout)
    return setGuildStatus(msg, status, newStatus(true, true))
  } else {
    return status
  }
}

const scheduleQuack = async (msg: Discord.Message, timeout: number) => {
  await new Promise(resolve => setTimeout(resolve, timeout))
  await msg.channel.send(getDuck())
}

