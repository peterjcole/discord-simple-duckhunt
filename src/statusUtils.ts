import * as Discord from 'discord.js'
import {
  DEFAULT_CHANCE_OF_DUCK_AWAKENING,
  DEFAULT_MAX_SECONDS_BEFORE_QUACK,
  DEFAULT_MIN_SECONDS_BETWEEN_DUCKS,
} from './constants'
import { GuildSettings, GuildStatus, GuildUserStats, Status } from './interfaces'
import { firestore } from 'firebase-admin/lib/firestore'
import Timestamp = firestore.Timestamp

export const newStatus = (nextWakingAt: Timestamp, quackedAt: Timestamp | null, guildUserStats: GuildUserStats, guildSettings: GuildSettings) => {
  return {
    nextWakingAt,
    quackedAt,
    guildUserStats,
    guildSettings
  }
}

export const duckHasQuacked = (guildStatus: GuildStatus) => guildStatus.quackedAt && guildStatus.quackedAt.toMillis() < Timestamp.fromDate(new Date()).toMillis();

export const getNextWakingAt = (guildSettings: GuildSettings) => Timestamp.fromDate(new Date(new Date().getTime() + guildSettings.minSecondsBetweenDucks * 1000));

export const getNextScheduledStatus = (guildUserStats: GuildUserStats, guildSettings: GuildSettings) => newStatus(getNextWakingAt(guildSettings), null, guildUserStats, guildSettings);

export const getQuackedAt = (timeout: number) => Timestamp.fromDate(new Date(new Date().getTime() + timeout));

const initialiseGuildStatus = () => newStatus(Timestamp.fromDate(new Date()), null, {}, getDefaultGuildSettings());

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
    if(!guildStatus.guildSettings) {
      guildStatus.guildSettings = getDefaultGuildSettings()
    }
    return guildStatus;
  }
}

export const elapsedTime = (guildStatus: GuildStatus) => guildStatus.quackedAt ? (new Date().getTime() - guildStatus.quackedAt.toDate().getTime()): -1

export const timeForDuck = (guildStatus: GuildStatus) => guildStatus.nextWakingAt.toDate().getTime() < new Date().getTime()

export const duckWakesUp = (guildSettings: GuildSettings) => Math.random() > guildSettings.chanceOfDuckAwakening

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

export const getDefaultGuildSettings = () => ({
  chanceOfDuckAwakening: DEFAULT_CHANCE_OF_DUCK_AWAKENING,
  maxSecondsBeforeQuack: DEFAULT_MAX_SECONDS_BEFORE_QUACK,
  minSecondsBetweenDucks: DEFAULT_MIN_SECONDS_BETWEEN_DUCKS,
})