import * as dotenv from 'dotenv'
import * as Discord from 'discord.js';
import {Status} from "./Status";
import {getStatusFromDb, updateDbStatus} from "./firebase";
import {handleBang, handleBef, quack, timeForDuck} from "./statusUtils";

dotenv.config()

const client = new Discord.Client();

let status: Status;

client.on('ready', async () => {
  status = await getStatusFromDb()
  console.log(`Logged in as ${client.user && client.user.tag}!`);
});

client.on('message', async (msg: Discord.Message) => {
  if (msg.content.includes('.bang')) {
    handleBang(msg, status);
  } else if (msg.content.includes('.bef')) {
    handleBef(msg, status);
  } else if (timeForDuck(status)) {
    await quack(msg, status);
  }
  await updateDbStatus(status);
});

client.login(process.env.DISCORD_BOT_TOKEN);

