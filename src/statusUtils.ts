import * as Discord from "discord.js";

import {getBangFailureMessage, getBefFailureMessage, getDuck} from "./strings";
import {MAX_SECONDS_BEFORE_QUACK, MIN_SECONDS_BETWEEN_DUCKS} from "./constants";
import {Status} from "./Status";
import {firestore} from "firebase-admin/lib/firestore";
import Timestamp = firestore.Timestamp;

export function killDuck(status: Status) {
  status.alive = false
  status.lastChange = Timestamp.fromDate(new Date())
}

export function bringDuckToLife(status: Status) {
  status.alive = true
  status.lastChange = Timestamp.fromDate(new Date())
}

export const timeSinceChange = (status: Status) => (new Date().getTime() - status.lastChange.toDate().getTime()) / 1000

export const timeForDuck = (status: Status) => timeSinceChange(status) > MIN_SECONDS_BETWEEN_DUCKS;

export const playerSucceeds = () => (Math.random() > 0.1)

export function handleBang(msg: Discord.Message, status: Status) {
  if (status.alive) {
    // You have killed 1163 ducks in #.
    if (playerSucceeds()) {
      msg.reply(`you shot a duck in ${timeSinceChange(status)} seconds!`);
      killDuck(status);
    } else {
      msg.reply(getBangFailureMessage())
    }
  } else {
    msg.reply('There is no duck. What are you shooting at?')
  }
}

export function handleBef(msg: Discord.Message, status: Status) {
  if (status.alive) {
    // You have made friends with 542 ducks in #
    if (playerSucceeds()) {
      msg.reply(`you befriended a duck in ${timeSinceChange(status)} seconds!`)
      killDuck(status)
    } else {
      msg.reply(getBefFailureMessage())
    }
  } else {
    msg.reply('You tried befriending a non-existent duck. That\'s freaking creepy.')
  }
}

export async function quack(msg: Discord.Message, status: Status) {
  const timeout = Math.floor(Math.random() * MAX_SECONDS_BEFORE_QUACK * 1000)
  await new Promise(resolve => setTimeout(resolve, timeout));
  bringDuckToLife(status);
  await msg.channel.send(getDuck())
}
