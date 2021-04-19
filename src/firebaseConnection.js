import firebase from "firebase/app";
import "firebase/firestore";  //trazemos nesse import a parte de banco de dados do FB
import 'firebase/auth';  //nesse import vem o módulo de autenticação

let firebaseConfig = {
  apiKey: "AIzaSyBaaLwgl1foiNlI2BJNOFvXAIZqO80VhAs",
  authDomain: "curso-suj-prog.firebaseapp.com",
  projectId: "curso-suj-prog",
  storageBucket: "curso-suj-prog.appspot.com",
  messagingSenderId: "356570346593",
  appId: "1:356570346593:web:292572bd134fc30de2a620",
  measurementId: "G-T8DKEBLNYM",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;
