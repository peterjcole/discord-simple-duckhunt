import * as Discord from "discord.js"
import {MIN_SECONDS_BETWEEN_DUCKS} from "./constants"
import {GuildStatus, Status} from "./Interfaces"
import {firestore} from "firebase-admin/lib/firestore"
import Timestamp = firestore.Timestamp;

export const newStatus = (alive: boolean, quacked: boolean = false) => {
  return {
    alive,
    lastChange: Timestamp.fromDate(new Date()),
    quacked
  }
}

export const getGuildStatus = (msg: Discord.Message, status: Status) => {
  if (!msg.guild) {
    console.log('Could not get guild status - no guild included with message')
    return newStatus(false)
  } else {
    return status[msg.guild.id] || newStatus(false)
  }
}

export const setGuildStatus = (msg: Discord.Message, status: Status, guildStatus: GuildStatus) => {
  if (!msg.guild) {
    console.log('Could not set guild status - no guild included with message')
  } else {
    status[msg.guild.id] = guildStatus
  }
  return status
}

export const timeSinceChange = (guildStatus: GuildStatus) => (new Date().getTime() - guildStatus.lastChange.toDate().getTime()) / 1000

export const timeForDuck = (msg: Discord.Message, status: Status) => timeSinceChange(getGuildStatus(msg, status)) > MIN_SECONDS_BETWEEN_DUCKS

export const playerSucceeds = () => (Math.random() > 0.1)
