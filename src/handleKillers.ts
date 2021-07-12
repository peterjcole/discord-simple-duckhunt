import * as Discord from "discord.js";

import {GuildStatus, MessageHelper} from "./interfaces";
import {
  formatScores,
  getBangFailureMessage,
  getBangNotQuackedMessage,
  getBefFailureMessage,
  getBefNotQuackedMessage,
  getDuck
} from "./stringUtils";
import {MAX_SECONDS_BEFORE_QUACK} from "./constants";
import {
  duckHasQuacked,
  getNextScheduledStatus,
  getNextWakingAt,
  getQuackedAt,
  incrementBang,
  incrementBef,
  newStatus,
  playerSucceeds,
  timeForDuck,
  timeSinceChange
} from "./statusUtils";
import {getBangScores, getBefScores} from "./scoreUtils";


const bangHelpers = {
  actionString: 'shot',
  statsString: 'killed',
  failureMessageGetter: getBangFailureMessage,
  notQuackedMessageGetter: getBangNotQuackedMessage,
  incrementer: incrementBang
}

const befHelpers = {
  actionString: 'befriended',
  statsString: 'made friends with',
  failureMessageGetter: getBefFailureMessage,
  notQuackedMessageGetter: getBefNotQuackedMessage,
  incrementer: incrementBef
}

const handle = (msg: Discord.Message, guildStatus: GuildStatus, helpers: MessageHelper) => {
  if (duckHasQuacked(guildStatus)) {
    if (playerSucceeds()) {
      const {newGuildUserStats, newNum} = helpers.incrementer(guildStatus.guildUserStats, msg.author.id)
      msg.reply(`you ${helpers.actionString} a duck in ${timeSinceChange(guildStatus)} seconds! You have ${helpers.statsString} ${newNum} ${newNum === 1 ? 'duck' : 'ducks'} in this server.`)
      return getNextScheduledStatus(newGuildUserStats)
    } else {
      // TODO: cooldown
      msg.reply(helpers.failureMessageGetter())
    }
  } else {
    msg.reply(helpers.notQuackedMessageGetter())
  }
  return guildStatus;
}

export const handleBef = (msg: Discord.Message, guildStatus: GuildStatus) => {
  return handle(msg, guildStatus, befHelpers)
}


export const handleBang = (msg: Discord.Message, guildStatus: GuildStatus) => {
  return handle(msg, guildStatus, bangHelpers)
}

export const quack = (msg: Discord.Message, guildStatus: GuildStatus) => {
  if (!duckHasQuacked(guildStatus) && timeForDuck(guildStatus)) {
    const timeout = Math.floor(Math.random() * MAX_SECONDS_BEFORE_QUACK * 1000)
    scheduleQuack(msg, timeout)
    return newStatus(getNextWakingAt(), getQuackedAt(timeout), guildStatus.guildUserStats);
  } else {
    return guildStatus
  }
}

const scheduleQuack = async (msg: Discord.Message, timeout: number) => {
  await new Promise(resolve => setTimeout(resolve, timeout))
  await msg.channel.send(getDuck())
}

export const handleFriends = (msg: Discord.Message, guildStatus: GuildStatus) => {
  const scores = getBefScores(guildStatus)
  console.log(scores)

  const friendsEmbed = new Discord.MessageEmbed()
      .setTitle('Duck friend scores in this server')
      .setDescription(formatScores(scores))

  msg.channel.send(friendsEmbed)
};

export const handleKillers = (msg: Discord.Message, guildStatus: GuildStatus) => {
  const scores = getBangScores(guildStatus)
  console.log(scores)

  const friendsEmbed = new Discord.MessageEmbed()
      .setTitle('Duck killer scores in this server')
      .setDescription(formatScores(scores))

  msg.channel.send(friendsEmbed)
};
