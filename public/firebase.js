import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMMZiLVe0C4PCV996JQcn5Y0xF3tBgMkY",
  authDomain: "restrauntreservation-84aeb.firebaseapp.com",
  projectId: "restrauntreservation-84aeb",
  storageBucket: "restrauntreservation-84aeb.appspot.com",
  messagingSenderId: "974390269863",
  appId: "1:974390269863:web:ded585ff74463b709a4882"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };