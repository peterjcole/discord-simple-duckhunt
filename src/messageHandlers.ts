import * as Discord from "discord.js";

import {GuildStatus, MessageHelper} from "./interfaces";
import {
  formatScores, formatTimes,
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
  elapsedTime
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
      const time = elapsedTime(guildStatus)
      const {newGuildUserStats, newNum} = helpers.incrementer(guildStatus.guildUserStats, msg.author.id, time)
      msg.reply(`you ${helpers.actionString} a duck in ${time / 1000} seconds! You have ${helpers.statsString} ${newNum} ${newNum === 1 ? 'duck' : 'ducks'} in this server.`)
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
  const timeout = Math.floor(Math.random() * MAX_SECONDS_BEFORE_QUACK * 1000)

  // we want this to happen asynchronously, so don't need to do anything with the promise
  scheduleQuack(msg, timeout)
  return newStatus(getNextWakingAt(), getQuackedAt(timeout), guildStatus.guildUserStats);
}

const scheduleQuack = async (msg: Discord.Message, timeout: number) => {
  await new Promise(resolve => setTimeout(resolve, timeout))
  await msg.channel.send(getDuck())
}

export const handleFriends = (msg: Discord.Message, guildStatus: GuildStatus) => {
  const scores = getBefScores(guildStatus)
  const friendsEmbed = new Discord.MessageEmbed()
      .setTitle('Duck friend scores in this server')
      .addFields(
          {name: 'Best friends', value: formatScores(scores), inline: true},
          {name: 'Fastest friends', value: formatTimes(scores), inline: true},
      )

  msg.channel.send(friendsEmbed)
};

export const handleKillers = (msg: Discord.Message, guildStatus: GuildStatus) => {
  const scores = getBangScores(guildStatus)
  console.log(scores)

  const friendsEmbed = new Discord.MessageEmbed()
      .setTitle('Duck killer scores in this server')
      .addFields(
          {name: 'Nastiest murderers', value: formatScores(scores), inline: true},
          {name: 'Quickest gunslingers', value: formatTimes(scores), inline: true},
      )

  msg.channel.send(friendsEmbed)
};
