import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIp3OHHDASC7_S66q7OElxOG3DKe4QvH0",
  authDomain: "full-88983.firebaseapp.com",
  projectId: "full-88983"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const leaderboard = document.getElementById("leaderboard");

async function loadLeaderboard() {
  try {
    const q = query(collection(db, "cats"), orderBy("votes", "desc"));
    const snapshot = await getDocs(q);

    leaderboard.innerHTML = "";

    snapshot.forEach((doc, index) => {
      const data = doc.data();

      leaderboard.innerHTML += `
        <li>
          ${index + 1}.
          <img src="${data.url}" width="60">
          <span>${data.votes} votes</span>
        </li>
      `;
    });

  } catch (error) {
    console.error("Leaderboard error:", error);
  }
}

loadLeaderboard();