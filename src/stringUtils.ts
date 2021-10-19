import {Ducks, UserScore} from "./interfaces";
import {DUCKS, HALLOWEEN_DUCKS, HOLIDAY_DUCKS} from './constants';

export const getDuck = () => {
  // month is zero indexed
  const month = new Date().getMonth()

  switch (month) {
    case 9:
      return getRandom(HALLOWEEN_DUCKS)
    case 11:
      return getRandom(HOLIDAY_DUCKS)
    default:
      return getRandom(DUCKS)
  }
}

const getRandom = (ducks: Ducks) => {
  return ducks[Math.floor(Math.random() * ducks.length)]
}

export const getBangFailureMessage = () => {
  const failureMessages = [
    'Your gun jammed! You can try again in 7 seconds.',
    'Better luck next time. You can try again in 7 seconds.'
  ]
  return failureMessages[Math.floor(Math.random() * failureMessages.length)]
}
export const getBefFailureMessage = () => {
  const failureMessages = [
    'Well this is awkward, the duck needs to think about it. You can try again in 7 seconds.',
    'Who knew ducks could be so picky? You can try again in 7 seconds.',
    'The duck said no, maybe bribe it with some pizza? Ducks love pizza don\'t they? You can try again in 7 seconds.'
  ]
  return failureMessages[Math.floor(Math.random() * failureMessages.length)]
}
export const getBangNotQuackedMessage = () => {
  return 'There is no duck. What are you shooting at?'
}
export const getBefNotQuackedMessage = () => {
  return 'You tried befriending a non-existent duck. That\'s freaking creepy.'
}

export function matchesCommand(content: string, command: String) {
  return content.toLowerCase().includes(`.${command}`);
}

export function formatScores(scores: UserScore[]) {
  return scores
      .sort((firstScore: UserScore, secondScore: UserScore) => secondScore.score - firstScore.score)
      .reduce((acc, current) => {
    if (current.score) {
      return `${acc}\n<@${current.userId}>: ${current.score}`
    } else {
      return acc
    }
  }, '') || 'No scores yet :('
}

export const formatTimes = (scores: UserScore[]) => {
  return scores
      .sort((firstScore: UserScore, secondScore: UserScore) => firstScore.bestTime && secondScore.bestTime ? firstScore.bestTime - secondScore.bestTime : 0)
      .reduce((acc, current) => {
    if (current.bestTime) {
      return `${acc}\n<@${current.userId}>: ${current.bestTime / 1000} seconds`
    } else {
      return acc
    }
  }, '') || 'No times yet :('
}
