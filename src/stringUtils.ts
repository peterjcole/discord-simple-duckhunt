import {UserScore} from "./interfaces";

export const getDuck = () => {
  const ducks = [
    '\u200B\u30FB\u309C\u309C\u30FB\u3002\u3002 \u200B \u30FB\u309C\u309C\\\\\u200B_0< FLAP F\u200BLAP!',
    '\u30FB \u200B \u309C\u309C\u30FB\u3002\u3002\u30FB\u309C\u309C\\\\\u200B_\u00F3< quac\u200Bk!',
  ]
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
  return scores.reduce((acc, current) => {
    return `${acc}\n <@${current.userId}>: ${current.score}`
  }, '')
}
