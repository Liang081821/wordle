// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNaK6zpihxAs_3snOujMoznuWfJLD-RHc",
  authDomain: "wordle-27caa.firebaseapp.com",
  projectId: "wordle-27caa",
  storageBucket: "wordle-27caa.appspot.com",
  messagingSenderId: "790516083613",
  appId: "1:790516083613:web:8438a9d77f8a1fb6215d74",
  measurementId: "G-8BJBH86WT0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

// Modify the fetchAnswer function to return a random answer
const fetchAnswer = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Answer"));
    const answers = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if ("Answer" in data) {
        answers.push(data.Answer);
      }
    });

    if (answers.length > 0) {
      const randomIndex = Math.floor(Math.random() * answers.length);
      return answers[randomIndex];
    } else {
      throw new Error("No answers found");
    }
  } catch (error) {
    console.error("Error fetching answers: ", error);
    return "NAOMI"; // Default fallback answer
  }
};

export default fetchAnswer;
