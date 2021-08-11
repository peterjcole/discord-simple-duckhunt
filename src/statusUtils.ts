import * as Discord from "discord.js"
import {MIN_SECONDS_BETWEEN_DUCKS} from "./constants"
import {GuildStatus, GuildUserStats, Status} from "./interfaces"
import {firestore} from "firebase-admin/lib/firestore"
import Timestamp = firestore.Timestamp;

export const newStatus = (nextWakingAt: Timestamp, quackedAt: Timestamp | null, guildUserStats: GuildUserStats) => {
  return {
    nextWakingAt,
    quackedAt,
    guildUserStats
  }
}

export const duckHasQuacked = (guildStatus: GuildStatus) => guildStatus.quackedAt && guildStatus.quackedAt.toMillis() < Timestamp.fromDate(new Date()).toMillis();

export const getNextWakingAt = () => Timestamp.fromDate(new Date(new Date().getTime() + MIN_SECONDS_BETWEEN_DUCKS * 1000));

export const getNextScheduledStatus = (guildUserStats: GuildUserStats) => newStatus(getNextWakingAt(), null, guildUserStats);

export const getQuackedAt = (timeout: number) => Timestamp.fromDate(new Date(new Date().getTime() + timeout));

const initialiseGuildStatus = () => newStatus(Timestamp.fromDate(new Date()), null, {});

export const getGuildStatus = (msg: Discord.Message, status: Status) => {
  if (!msg.guild) {
    console.log('Could not get guild status - no guild included with message')
    return initialiseGuildStatus();
  } else {
    const guildStatus = status[msg.guild.id]
    if (!guildStatus) return initialiseGuildStatus()
    if (!guildStatus.guildUserStats) {
      guildStatus.guildUserStats = {}
    }
    return guildStatus;
  }
}

export const elapsedTime = (guildStatus: GuildStatus) => guildStatus.quackedAt ? (new Date().getTime() - guildStatus.quackedAt.toDate().getTime()): -1

export const timeForDuck = (guildStatus: GuildStatus) => guildStatus.nextWakingAt.toDate().getTime() < new Date().getTime()

export const playerSucceeds = () => (Math.random() > 0.1)

export function incrementBef(guildUserStats: GuildUserStats, authorId: string, elapsedTime: number) {
  if (!guildUserStats[authorId]) {
    guildUserStats[authorId] = {numKilled: 0, numBefriended: 0, bestBefriendedTime: elapsedTime, bestKilledTime: null}
  }

  const userStats = guildUserStats[authorId]
  userStats.numBefriended += 1

  if (!userStats.bestBefriendedTime || userStats.bestBefriendedTime > elapsedTime) {
    userStats.bestBefriendedTime = elapsedTime
  }

  return {newGuildUserStats: guildUserStats, newNum: userStats.numBefriended}
}

export function incrementBang(guildUserStats: GuildUserStats, authorId: string, elapsedTime: number) {
  if (!guildUserStats[authorId]) {
    guildUserStats[authorId] = {numKilled: 0, numBefriended: 0, bestBefriendedTime: null, bestKilledTime: elapsedTime}
  }
  const userStats = guildUserStats[authorId]
  userStats.numKilled += 1

  if (!userStats.bestKilledTime || userStats.bestKilledTime > elapsedTime) {
    userStats.bestKilledTime = elapsedTime
  }

  return {newGuildUserStats: guildUserStats, newNum: userStats.numKilled}
}
