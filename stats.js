import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIp3OHHDASC7_S66q7OElxOG3DKe4QvH0",
  authDomain: "full-88983.firebaseapp.com",
  projectId: "full-88983",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const leaderboard = document.getElementById("leaderboard");
const votesCastEl = document.getElementById("votes-cast");
const favoriteCatEl = document.getElementById("favorite-cat");

async function loadStats() {
  try {
    const q = query(collection(db, "cats"), orderBy("votes", "desc"), limit(10));
    const snapshot = await getDocs(q);

    let htmlBuilder = ""; 
    let totalVotes = 0;

    const docs = snapshot.docs;

    for (let i = 0; i < docs.length; i++) {
      const data = docs[i].data();
      const voteValue = parseInt(data.votes) || 0; 
      totalVotes += voteValue;

      htmlBuilder += `
        <li class="leaderboard-item">
          <div class="leaderboard-left">
            <span class="rank">${i + 1}.</span> 
            <img src="${data.url}" class="mini-cat-img">
          </div>
          <div class="leaderboard-right">
            <span>${voteValue} votes</span>
          </div>
        </li>
      `;
    }

    leaderboard.innerHTML = htmlBuilder;
    votesCastEl.textContent = `Votes Cast: ${totalVotes}`;

    const favQ = query(collection(db, "favorites"), orderBy("favoritedAt", "desc"), limit(1));
    const favSnapshot = await getDocs(favQ);
    
    if (!favSnapshot.empty) {
        const lastFav = favSnapshot.docs[0].data(); 
        favoriteCatEl.innerHTML = `
          Favorite Cat: <br>
          <img src="${lastFav.url}" width="100" style="border-radius: 8px; margin-top: 10px; display: block;">
        `;
    } else {
        favoriteCatEl.textContent = "Favorite Cat: None yet!";
    }

  } catch (error) {
    console.error("Stats Page Error:", error);
  }
}

loadStats();
