import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIp3OHHDASC7_S66q7OElxOG3DKe4QvH0",
  authDomain: "full-88983.firebaseapp.com",
  projectId: "full-88983",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const img = document.getElementById("cat-image");
const heartBtn = document.querySelector(".heart-btn");
const nextBtn = document.getElementById("next-cat-btn");
const ratingInput = document.getElementById("cat-rating"); 

let currentCatUrl = "";

async function loadCat() {
  try {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await res.json();

    currentCatUrl = data[0].url;
    img.src = currentCatUrl;
    
    ratingInput.value = ""; 

    console.log("Loaded cat:", currentCatUrl);
  } catch (error) {
    console.error("Error loading cat:", error);
  }
}

async function favoriteCat() {
  if (!currentCatUrl) return;
  try {
    const favId = encodeURIComponent(currentCatUrl);
    const favRef = doc(db, "favorites", favId);
    await setDoc(favRef, {
      url: currentCatUrl,
      favoritedAt: Date.now()
    });
    console.log("Favorited:", currentCatUrl);
  } catch (error) {
    console.error("Favorite error:", error);
  }
}

async function rateCat() {
  if (!currentCatUrl || !ratingInput.value) return;

  try {
    const rating = Number(ratingInput.value);
    const votesToAdd = Math.max(1, Math.min(10, rating));

    const catId = encodeURIComponent(currentCatUrl);
    const catRef = doc(db, "cats", catId);
    const snap = await getDoc(catRef);

    if (!snap.exists()) {
      await setDoc(catRef, {
        url: currentCatUrl,
        votes: votesToAdd
      });
    } else {
      await updateDoc(catRef, {
        votes: increment(votesToAdd)
      });
    }
    console.log(`Added ${votesToAdd} votes for:`, currentCatUrl);
  } catch (error) {
    console.error("Rating error:", error);
  }
}

heartBtn.addEventListener("click", favoriteCat);

nextBtn.addEventListener("click", async () => {
  await rateCat(); 
  loadCat();       
});


loadCat();
