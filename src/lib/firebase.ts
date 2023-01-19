// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  DocumentData,
  DocumentReference,
  getFirestore,
} from 'firebase/firestore';

export type FirestoreData = {
  id: string;
  ref: DocumentReference<DocumentData>;
};

const firebaseConfig = {
  apiKey: 'AIzaSyDqG7u0A7gnnYKpdrfL9i9D_hPoiaWAN30',
  authDomain: 'saltong-hub.firebaseapp.com',
  projectId: 'saltong-hub',
  storageBucket: 'saltong-hub.appspot.com',
  messagingSenderId: '594560295047',
  appId: '1:594560295047:web:5f144ea872cde47cdcd822',
  measurementId: 'G-88TNQKC5LK',
};

export const authProviders = {
  google: {
    name: 'Google',
    icon: '/google-logo.png',
    provider: new GoogleAuthProvider().setCustomParameters({
      prompt: 'select_account',
    }),
  },
  facebook: {
    name: 'Facebook',
    icon: '/facebook-logo.png',
    provider: new FacebookAuthProvider(),
  },
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
