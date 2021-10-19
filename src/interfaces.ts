import {firestore} from "firebase-admin/lib/firestore"
import Timestamp = firestore.Timestamp

export interface Status {
  [guildId: string]: GuildStatus
}

export interface GuildStatus {
  nextWakingAt: Timestamp,
  quackedAt: Timestamp | null,
  guildUserStats: GuildUserStats
}

export interface GuildUserStats {
  [userId: string]: GuildUser
}

export interface GuildUser {
  numKilled: number,
  numBefriended: number,
  bestKilledTime: number | null,
  bestBefriendedTime: number | null
}

export interface MessageHelper {
  actionString: string,
  statsString: string,
  failureMessageGetter: () => string,
  notQuackedMessageGetter: () => string,
  incrementer: (guildUserStats: GuildUserStats, authorId: string, timeElapsed: number) => { newGuildUserStats: GuildUserStats, newNum: number }
}

export interface UserScore {
  userId: string,
  score: number,
  bestTime: number | null
}

export type Ducks = string[]
