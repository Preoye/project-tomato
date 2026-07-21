"use strict";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function setupCountdown() {
  const clock = $("[data-countdown]");
  if (!clock) return;
  const unlockAt = new Date(clock.dataset.unlock);
  const update = () => {
    const difference = unlockAt - new Date();
    if (difference <= 0) { clock.textContent = "A new page is ready — refreshing…"; window.setTimeout(() => window.location.reload(), 1200); return; }
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    clock.textContent = `${days ? `${days}d ` : ""}${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  };
  update(); window.setInterval(update, 1000);
}

function revealLetters() {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$("p", entry.target).forEach((line, index) => window.setTimeout(() => line.classList.add("revealed"), index * 420));
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: .28 });
  $$('[data-reveal-lines]').forEach((block) => observer.observe(block));
}

function setupMusic() {
  const audio = $("#themeMusic"); const toggle = $("[data-music-toggle]");
  if (!audio || !toggle) return;
  toggle.addEventListener("click", async () => {
    try {
      if (audio.paused) { await audio.play(); toggle.textContent = "♪ Sound on"; toggle.setAttribute("aria-pressed", "true"); }
      else { audio.pause(); toggle.textContent = "♪ Sound off"; toggle.setAttribute("aria-pressed", "false"); }
    } catch { toggle.textContent = "Add theme.mp3 to play music"; }
  });
}

function setupPuzzle() {
  const puzzle = $("[data-puzzle]"); if (!puzzle) return;
  const result = $("[data-puzzle-result]", puzzle);
  $("[data-check-puzzle]", puzzle).addEventListener("click", () => {
    const inputs = $$('input[data-answer]', puzzle);
    const solved = inputs.every((input) => input.value.trim().toUpperCase() === input.dataset.answer);
    inputs.forEach((input) => input.style.borderColor = input.value.trim().toUpperCase() === input.dataset.answer ? "#52835b" : "#a8345d");
    if (solved) { result.textContent = "You found them all. I knew you would. You are one of my favourite discoveries. ❤️"; burstConfetti(45); }
    else result.textContent = "Very close — try the highlighted words again. 😊";
  });
}

function burstConfetti(amount = 70) {
  const colors = ["#f18ba8", "#f7d35c", "#76b68c", "#7194e2", "#ffffff"];
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("i"); piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`; piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--drift", `${(Math.random() - .5) * 42}vw`); piece.style.animationDelay = `${Math.random() * .6}s`;
    document.body.append(piece); window.setTimeout(() => piece.remove(), 4500);
  }
}

function setupCelebration() { $("[data-confetti]")?.addEventListener("click", () => { burstConfetti(120); $(".paper", $("#birthday"))?.classList.add("celebration"); }); }

document.addEventListener("DOMContentLoaded", () => { setupCountdown(); revealLetters(); setupMusic(); setupPuzzle(); setupCelebration(); });
