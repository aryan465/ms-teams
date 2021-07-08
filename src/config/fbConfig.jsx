import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';


var firebaseConfig = {
    apiKey: "***REMOVED***",
    authDomain: "***REMOVED***",
    projectId: "***REMOVED***",
    storageBucket: "***REMOVED***.appspot.com",
    messagingSenderId: "***REMOVED***",
    appId: "1:***REMOVED***:web:cc6c31e2e5cb47707e5d8f",
    measurementId: "***REMOVED***"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({timestampsInSnapshots: true});


export const auth = firebase.auth();
export const firestore = firebase.firestore();


