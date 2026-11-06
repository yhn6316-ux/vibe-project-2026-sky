import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDw9aFtZO4FhB8mhhsVzUwjOPIth1NTbQI",
  authDomain: "sky-web-project.firebaseapp.com",
  projectId: "sky-web-project",
  storageBucket: "sky-web-project.firebasestorage.app",
  messagingSenderId: "956382092221",
  appId: "1:956382092221:web:d664db896456f4b3a810d4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

