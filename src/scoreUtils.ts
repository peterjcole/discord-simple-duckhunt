import {GuildStatus} from "./interfaces";

export const getBefScores = (guildStatus: GuildStatus) => Object.entries(guildStatus.guildUserStats).map(([userId, guildUser]) => ({
  userId,
  score: guildUser.numBefriended,
  bestTime: guildUser.bestBefriendedTime
}));

export const getBangScores = (guildStatus: GuildStatus) => Object.entries(guildStatus.guildUserStats).map(([userId, guildUser]) => ({
  userId,
  score: guildUser.numKilled,
  bestTime: guildUser.bestKilledTime
}));
