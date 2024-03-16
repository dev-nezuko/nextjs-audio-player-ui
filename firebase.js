import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: 'unibui-ef432.appspot.com',
  messagingSenderId: '381671239212',
  appId: '1:381671239212:web:ab3eac805ae4fe040b2b89',
  measurementId: 'G-X43QN7HTW3'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
// const analytics = getAnalytics(app);
