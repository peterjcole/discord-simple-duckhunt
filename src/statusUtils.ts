import * as Discord from "discord.js"
import {MIN_SECONDS_BETWEEN_DUCKS} from "./constants"
import {GuildStatus, Status} from "./interfaces"
import {firestore} from "firebase-admin/lib/firestore"
import Timestamp = firestore.Timestamp;

export const newStatus = (nextWakingAt: Timestamp, quackedAt: Timestamp | null) => {
  return {
    nextWakingAt,
    quackedAt
  }
}

export const duckHasQuacked = (guildStatus: GuildStatus) => guildStatus.quackedAt && guildStatus.quackedAt.toMillis() < Timestamp.fromDate(new Date()).toMillis();

export const getNextWakingAt = () => Timestamp.fromDate(new Date(new Date().getTime() + MIN_SECONDS_BETWEEN_DUCKS * 1000));

export const getNextScheduledStatus = () => newStatus(getNextWakingAt(), null);

export const getQuackedAt = (timeout: number) => Timestamp.fromDate(new Date(new Date().getTime() + timeout));

const getNowScheduledStatus = () => newStatus(Timestamp.fromDate(new Date()), null);

export const getGuildStatus = (msg: Discord.Message, status: Status) => {
  if (!msg.guild) {
    console.log('Could not get guild status - no guild included with message')
    return getNowScheduledStatus();
  } else {
    const guildStatus = status[msg.guild.id]
    return guildStatus ? guildStatus : getNowScheduledStatus();
  }
}

export const timeSinceChange = (guildStatus: GuildStatus) => guildStatus.quackedAt && (new Date().getTime() - guildStatus.quackedAt.toDate().getTime()) / 1000

export const timeForDuck = (guildStatus: GuildStatus) => guildStatus.nextWakingAt.toDate().getTime() < new Date().getTime()

export const playerSucceeds = () => (Math.random() > 0.1)
