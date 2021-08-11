import {GuildStatus, UserScore} from "./interfaces";

export const getBefScores = (guildStatus: GuildStatus) => Object.entries(guildStatus.guildUserStats).map(([userId, guildUser]) => ({
  userId,
  score: guildUser.numBefriended,
  bestTime: guildUser.bestBefriendedTime
})).sort((firstScore: UserScore, secondScore: UserScore) => secondScore.score - firstScore.score);

export const getBangScores = (guildStatus: GuildStatus) => Object.entries(guildStatus.guildUserStats).map(([userId, guildUser]) => ({
  userId,
  score: guildUser.numKilled,
  bestTime: guildUser.bestKilledTime
})).sort((firstScore: UserScore, secondScore: UserScore) => secondScore.score - firstScore.score);
