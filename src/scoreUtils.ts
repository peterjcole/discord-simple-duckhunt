import {GuildStatus, UserScore} from "./interfaces";

export const getBefScores = (guildStatus: GuildStatus) => Object.entries(guildStatus.guildUserStats).map(([userId, guildUser]) => ({
  userId,
  score: guildUser.numBefriended
})).sort((firstScore: UserScore, secondScore: UserScore) => secondScore.score - firstScore.score);

export const getBangScores = (guildStatus: GuildStatus) => Object.entries(guildStatus.guildUserStats).map(([userId, guildUser]) => ({
  userId,
  score: guildUser.numKilled
})).sort((firstScore: UserScore, secondScore: UserScore) => secondScore.score - firstScore.score);
