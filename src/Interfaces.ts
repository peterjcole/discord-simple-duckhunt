import {firestore} from "firebase-admin/lib/firestore"
import Timestamp = firestore.Timestamp

export interface Status {
  [guild: string]: GuildStatus
}

export interface GuildStatus {
  lastChange: Timestamp,
  alive: boolean,
  quacked: boolean
}
