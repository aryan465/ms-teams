import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';


var firebaseConfig = {
    apiKey: "AIzaSyAu8ZZro3EcPJsWxZ23kx986EjRKA-mz3g",
    authDomain: "ms-teams-b465g.firebaseapp.com",
    projectId: "ms-teams-b465g",
    storageBucket: "ms-teams-b465g.appspot.com",
    messagingSenderId: "598889449118",
    appId: "1:598889449118:web:cc6c31e2e5cb47707e5d8f",
    measurementId: "G-3WBK0NVYEZ"
  };
  // Initialize Firebase
  const fbapp = firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({timestampsInSnapshots: true});


export default fbapp;