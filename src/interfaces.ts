import {firestore} from "firebase-admin/lib/firestore"
import Timestamp = firestore.Timestamp

export interface Status {
  [guild: string]: GuildStatus
}

export interface GuildStatus {
  nextWakingAt: Timestamp,
  quackedAt: Timestamp | null,
}
// alive and quacked: shootable
// alive and not quacked: about to quack, not shootable
// not alive and quacked: dead
// not alive and not quacked: dead
