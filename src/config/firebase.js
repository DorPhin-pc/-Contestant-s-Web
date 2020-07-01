import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

//Config
import { FirebaseConfig } from '../config/keys';

export const FirebaseApp = firebase.initializeApp(FirebaseConfig);

// FireStore
// const firestore = firebase.firestore();
// const firestore_settings = { timestampsInSnapshots: true };
// export const Firestore = firestore.settings(firestore_settings);

// Realtime DB
const databaseRef = firebase.database().ref();
export const dbRef = databaseRef;
export const todosRef = databaseRef.child('todos');
export const LandingRef = databaseRef.child('landing');
export const teamList_Ref = databaseRef.child('teamList');
export const curriculum_Ref = databaseRef.child('curriculum');
