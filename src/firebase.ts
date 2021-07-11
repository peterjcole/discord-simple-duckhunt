import * as dotenv from 'dotenv'
dotenv.config()
import * as admin from 'firebase-admin'

import {Status} from "./Interfaces"

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '', 'base64').toString('ascii'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const getStatusFromDb = async () => {
  const snapshot = await db.collection('status').doc('status').get()

  const dbStatus = snapshot.data() as Status
  console.log('Retrieved status from firebase')
  return dbStatus || {}
}

const updateDbStatus = async (status: Status) => {
  await db.collection('status').doc('status').set(status)
}

export {getStatusFromDb, updateDbStatus}
