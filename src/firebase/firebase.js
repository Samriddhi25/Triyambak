import firebase from 'firebase'

import 'firebase/firestore'
import 'firebase/auth'
import "firebase/storage"
import "firebase/functions"

const config = {
    // your firebase credentials
}

firebase.initializeApp(config)

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const database = firebase.database();
export default auth
