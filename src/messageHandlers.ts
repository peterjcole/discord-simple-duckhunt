import * as Discord from "discord.js";

import {GuildStatus} from "./interfaces";
import {getBangFailureMessage, getBefFailureMessage, getDuck} from "./strings";
import {MAX_SECONDS_BEFORE_QUACK} from "./constants";
import {
  duckHasQuacked,
  getNextScheduledStatus,
  getNextWakingAt,
  getQuackedAt,
  newStatus,
  playerSucceeds,
  timeForDuck,
  timeSinceChange
} from "./statusUtils";

export const handleBang = (msg: Discord.Message, guildStatus: GuildStatus) => {
  if (duckHasQuacked(guildStatus)) {
    // TODO: You have killed 1163 ducks in #.
    if (playerSucceeds()) {
      msg.reply(`you shot a duck in ${timeSinceChange(guildStatus)} seconds!`)
      return getNextScheduledStatus()
    } else {
      msg.reply(getBangFailureMessage())
    }
  } else {
    msg.reply('There is no duck. What are you shooting at?')
  }
  return guildStatus;
}

export const handleBef = (msg: Discord.Message, guildStatus: GuildStatus) => {

  if (duckHasQuacked(guildStatus)) {
    // TODO: You have made friends with 542 ducks in #
    if (playerSucceeds()) {
      msg.reply(`you befriended a duck in ${timeSinceChange(guildStatus)} seconds!`)
      return getNextScheduledStatus()
    } else {
      msg.reply(getBefFailureMessage())
    }
  } else {
    msg.reply('You tried befriending a non-existent duck. That\'s freaking creepy.')
  }
  return guildStatus;
}

export const quack = (msg: Discord.Message, guildStatus: GuildStatus) => {
  if (!duckHasQuacked(guildStatus) && timeForDuck(guildStatus)) {
    const timeout = Math.floor(Math.random() * MAX_SECONDS_BEFORE_QUACK * 1000)
    scheduleQuack(msg, timeout)
    return newStatus(getNextWakingAt(), getQuackedAt(timeout));
  } else {
    return guildStatus
  }
}

const scheduleQuack = async (msg: Discord.Message, timeout: number) => {
  await new Promise(resolve => setTimeout(resolve, timeout))
  await msg.channel.send(getDuck())
}

