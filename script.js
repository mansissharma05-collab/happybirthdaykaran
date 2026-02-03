function unlockLetter() {
  const input = document.getElementById("password").value.trim().toLowerCase();

  // ✅ Change your password here
  const correct = "karan";

  if (input === correct) {
    localStorage.setItem("letterUnlocked", "true");
    showLetter();
  } else {
    alert("Wrong password 😭 try again");
  }
}

function showLetter() {
  const unlocked = localStorage.getItem("letterUnlocked") === "true";

  const lockedView = document.getElementById("lockedView");
  const letterView = document.getElementById("letterView");

  if (!lockedView || !letterView) return;

  lockedView.style.display = unlocked ? "none" : "block";
  letterView.style.display = unlocked ? "block" : "none";
}
