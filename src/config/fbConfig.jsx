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
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({timestampsInSnapshots: true});


export const auth = firebase.auth();
export const firestore = firebase.firestore();


// console.log(firebase);


// const userId = firestore.doc(`users/${user.uid}`);
// const snapshot = await userId.get();

// export const userDocumentGenerator = async(user,data)=>{
//   if (!user) return;
//   const userId = firestore.doc(`users/${user.uid}`);
//   const snapshot = await userId.get();

//   if(!snapshot.exists){
//     const {email,fname,lname} = user;
//     try{
//       await userId.set({
//         fname,
//         lname,
//         email,
//         ...data
//       });
//     }
//     catch(error){
//       console.error("Error",error);
//     }
//   }
//   return getUserDocument(user.uid);
// };




const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};