import * as admin from 'firebase-admin'
import {Status} from "./Status";
import {firestore} from "firebase-admin/lib/firestore";
import Timestamp = firestore.Timestamp;
const serviceAccount = require('../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const getStatusFromDb = async () => {
  const snapshot = await db.collection('status').doc('status').get()
  const dbStatus = snapshot.data() as Status
  console.log(dbStatus)
  if (!dbStatus.lastChange || !dbStatus.alive) {
    return await setInitialStatus()
  } else {
    return dbStatus
  }
}

const updateDbStatus = async (status: Status) => {
  await db.collection('status').doc('status').set(status);
}

const setInitialStatus = async () => {
  console.log('Initialising status in DB')

  const initialStatus = {
    alive: true,
    lastChange: Timestamp.fromDate(new Date())
  }
  await db.collection('status').doc('status').set(initialStatus);
  return initialStatus
}

export {getStatusFromDb, updateDbStatus};
