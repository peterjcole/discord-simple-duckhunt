import {firestore} from "firebase-admin/lib/firestore";
import Timestamp = firestore.Timestamp;

export interface Status {
  lastChange: Timestamp,
  alive: boolean
}
