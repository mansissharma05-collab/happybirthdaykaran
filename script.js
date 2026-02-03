/* One-page Birthday Rage Game — FINAL WORKING
   Matches your index.html IDs exactly:
   buttonGrid, toast, attempts, streak, winrate, tauntText,
   unlockFill, unlockMsg, letterBtn, resetBtn, cheatBtn, lockedOverlay
*/

const HIS_NAME = "Karan";          // you can change
const FAILS_TO_UNLOCK = 12;
const STORAGE_KEY = "birthday_letter_unlocked_v3";

const taunts = [
  "You look confident. That’s adorable.",
  "Wrong. But I love the effort.",
  "So close… (no you weren’t).",
  "Try again, birthday boy 😌",
  "The audacity of clicking that.",
  "You really thought… huh?",
  "Mansi says: denied.",
  "Your ego is loading… please wait.",
  "Skill issue.",
  "Again??? determination or delusion?",
];

const loses = [
  "Wrong button. Like… impressively wrong.",
  "Incorrect. But nice try, cutie.",
  "Nope. Your luck is blocked.",
  "Wrong. You clicked too confidently.",
  "Wrong. You hesitated.",
  "Wrong. Mansi said no.",
  "Wrong. You’re not worthy (yet).",
  "Wrong. Try begging.",
];

function qs(id) { return document.getElementById(id); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function isUnlocked() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}
function setUnlocked(v) {
  localStorage.setItem(STORAGE_KEY, v ? "true" : "false");
}

/* Confetti burst */
function confettiBurst() {
  const duration = 1200;
  const end = Date.now() + duration;
  const colors = ["#ff5fa2", "#ffd6e7", "#d8f3dc", "#ffffff"];

  const interval = setInterval(() => {
    if (Date.now() > end) return clearInterval(interval);

    const piece = document.createElement("div");
    piece.style.position = "fixed";
    piece.style.zIndex = "9999";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = "-10px";
    piece.style.width = "10px";
    piece.style.height = "14px";
    piece.style.borderRadius = "3px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.opacity = "0.9";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);

    const fall = piece.animate(
      [
        { transform: piece.style.transform + " translateY(0px)" },
        { transform: piece.style.transform + ` translateY(${window.innerHeight + 40}px)` },
      ],
      { duration: 900 + Math.random() * 700, easing: "cubic-bezier(.2,.8,.2,1)" }
    );

    fall.onfinish = () => piece.remove();
  }, 40);
}

/* MUSIC shuffle */
function initMusic() {
  const shuffleBtn = qs("shuffleBtn");
  const songsList = qs("songsList");
  if (!shuffleBtn || !songsList) return;

  shuffleBtn.addEventListener("click", () => {
    const items = Array.from(songsList.querySelectorAll("li"));
    items.sort(() => Math.random() - 0.5);
    items.forEach((li) => songsList.appendChild(li));
  });
}

/* GAME logic */
function initGame() {
  const hisNameEl = qs("hisName");
  if (hisNameEl) hisNameEl.textContent = HIS_NAME;

  const attemptsEl = qs("attempts");
  const streakEl = qs("streak");
  const winrateEl = qs("winrate");
  const toastEl = qs("toast");
  const tauntEl = qs("tauntText");
  const unlockFillEl = qs("unlockFill");
  const unlockMsgEl = qs("unlockMsg");
  const letterBtn = qs("letterBtn");
  const resetBtn = qs("resetBtn");
  const cheatBtn = qs("cheatBtn");
  const buttonGrid = qs("buttonGrid");
  const lockedOverlay = qs("lockedOverlay");

  // If these don't exist, game won't run
  if (!buttonGrid || !toastEl) return;

  let attempts = 0;
  let confidence = 0;
  let unlocked = isUnlocked();

  function setToast(msg, type = "") {
    toastEl.textContent = msg;
    toastEl.className = `toast ${type}`;
  }

  function render() {
    if (attemptsEl) attemptsEl.textContent = String(attempts);
    if (streakEl) streakEl.textContent = String(confidence);
    if (winrateEl) winrateEl.textContent = "0%";

    const pct = unlocked
      ? 100
      : clamp(Math.round((attempts / FAILS_TO_UNLOCK) * 100), 0, 100);

    if (unlockFillEl) unlockFillEl.style.width = pct + "%";
    if (unlockMsgEl) {
      unlockMsgEl.textContent = unlocked
        ? "Suffering meter: 100% ✅ letter unlocked"
        : `Suffering meter: ${pct}%`;
    }

    if (letterBtn) {
      if (unlocked) {
        letterBtn.classList.remove("disabled");
        letterBtn.setAttribute("aria-disabled", "false");
      } else {
        letterBtn.classList.add("disabled");
        letterBtn.setAttribute("aria-disabled", "true");
      }
    }

    if (lockedOverlay) {
      if (unlocked) lockedOverlay.classList.add("hidden");
      else lockedOverlay.classList.remove("hidden");
    }
  }

  function unlockLetter() {
    unlocked = true;
    setUnlocked(true);
    setToast("Okay fine. You suffered enough. Letter unlocked 💌", "good");
    confettiBurst();
    render();
  }

  function riggedLose() {
    attempts += 1;
    confidence += 1;

    // move buttons 😈
    const buttons = Array.from(buttonGrid.querySelectorAll(".game-btn"));
    buttons.sort(() => Math.random() - 0.5);
    buttons.forEach((b) => buttonGrid.appendChild(b));

    setToast(loses[Math.floor(Math.random() * loses.length)], "bad");
    if (tauntEl) tauntEl.textContent = taunts[Math.floor(Math.random() * taunts.length)];

    if (!unlocked && attempts >= FAILS_TO_UNLOCK) unlockLetter();
    else render();
  }

  function resetGame() {
    attempts = 0;
    confidence = 0;
    unlocked = false;
    setUnlocked(false);
    setToast("Reset done. Try again, champ.");
    if (tauntEl) tauntEl.textContent = "Back at zero. Still can’t win though.";
    render();
  }

  function fakeHint() {
    const hints = [
      "Hint: Not that one.",
      "Hint: The correct button is the one you didn’t click.",
      "Hint: You’re close (lie).",
      "Hint: Click with more emotional intelligence.",
      "Hint: Mansi controls the code. You’re doomed.",
    ];
    setToast(hints[Math.floor(Math.random() * hints.length)]);
  }

  // Block letter click if not unlocked
  if (letterBtn) {
    letterBtn.addEventListener("click", (e) => {
      if (!unlocked) {
        e.preventDefault();
        setToast("Nice try 😌 You haven’t suffered enough yet.", "bad");
      }
    });
  }

  // ✅ This is what makes the game buttons work
  buttonGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".game-btn");
    if (!btn) return;
    riggedLose();
  });

  resetBtn?.addEventListener("click", resetGame);
  cheatBtn?.addEventListener("click", fakeHint);

  render();
  setToast(`Pick a button, ${HIS_NAME} 😌`);
}

function init() {
  initGame();
  initMusic();
}

init();
