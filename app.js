const slides = [...document.querySelectorAll(".slide")];
const stage = document.getElementById("stage");
const counter = document.getElementById("counter");
const progress = document.getElementById("progress");
const dotsEl = document.getElementById("dots");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let index = 0;

function show(i) {
  index = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach((slide, n) => {
    const on = n === index;
    slide.classList.toggle("active", on);
    slide.setAttribute("aria-hidden", on ? "false" : "true");
  });
  counter.textContent = `${index + 1} / ${slides.length}`;
  progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === slides.length - 1 ? "Start over" : "Next →";
  [...dotsEl.children].forEach((dot, n) => dot.classList.toggle("on", n === index));
  if (index === 15) startMatch();
}

slides.forEach((_, n) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.title = slides[n].dataset.title || `Slide ${n + 1}`;
  dot.addEventListener("click", () => show(n));
  dotsEl.appendChild(dot);
});

prevBtn.addEventListener("click", () => show(index - 1));
nextBtn.addEventListener("click", () => {
  if (index === slides.length - 1) show(0);
  else show(index + 1);
});

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, button")) return;
  if (["ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    if (index === slides.length - 1) return;
    show(index + 1);
  }
  if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
    event.preventDefault();
    show(index - 1);
  }
  if (event.key === "Home") show(0);
  if (event.key === "End") show(slides.length - 1);
});

let touchX = null;
stage.addEventListener("touchstart", (event) => {
  touchX = event.changedTouches[0].clientX;
});
stage.addEventListener("touchend", (event) => {
  if (touchX == null) return;
  const dx = event.changedTouches[0].clientX - touchX;
  touchX = null;
  if (dx < -50) show(index + 1);
  if (dx > 50) show(index - 1);
});

document.querySelectorAll("[data-jump]").forEach((btn) => {
  btn.addEventListener("click", () => show(Number(btn.dataset.jump) - 1));
});

const QUIZ = [
  {
    q: "_____ is your best friend?",
    options: ["Who", "Where", "When", "Why"],
    answer: 0,
    why: "Odam haqida — Who.",
  },
  {
    q: "_____ do you live?",
    options: ["What", "Where", "Whose", "Which"],
    answer: 1,
    why: "Joy — Where.",
  },
  {
    q: "_____ is your birthday?",
    options: ["How", "Who", "When", "Which"],
    answer: 2,
    why: "Vaqt — When.",
  },
  {
    q: "_____ are you late? — Because I missed the bus.",
    options: ["What", "Why", "Whose", "Where"],
    answer: 1,
    why: "Sabab va because — Why.",
  },
  {
    q: "_____ bag is this — the red one or the blue one?",
    options: ["What", "Which", "Who", "How"],
    answer: 1,
    why: "Ikki tanlov — Which.",
  },
  {
    q: "_____ pencil is this? — It’s Aziza’s.",
    options: ["Who", "Whose", "Which", "How"],
    answer: 1,
    why: "Egalik — Whose.",
  },
  {
    q: "_____ many students are in your class?",
    options: ["What", "When", "How", "Why"],
    answer: 2,
    why: "How many = nechta (sanoqli).",
  },
  {
    q: "_____ called you?  (subject question, no did)",
    options: ["Who", "When", "Where", "Which"],
    answer: 0,
    why: "Ega so‘raladi: Who called you?",
  },
];

let quizIndex = 0;
let quizHits = 0;
let quizLocked = false;
const quizQ = document.getElementById("quiz-q");
const quizMeta = document.getElementById("quiz-meta");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");
const quizNext = document.getElementById("quiz-next");
const quizDone = document.getElementById("quiz-done");
const quizScore = document.getElementById("quiz-score");

function renderQuiz() {
  const item = QUIZ[quizIndex];
  quizLocked = false;
  quizDone.classList.add("hidden");
  quizNext.hidden = true;
  quizFeedback.textContent = "";
  quizMeta.textContent = `Savol ${quizIndex + 1} / ${QUIZ.length}`;
  quizQ.textContent = item.q;
  quizOptions.innerHTML = "";
  item.options.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.addEventListener("click", () => pickQuiz(i));
    quizOptions.appendChild(btn);
  });
}

function pickQuiz(i) {
  if (quizLocked) return;
  quizLocked = true;
  const item = QUIZ[quizIndex];
  const buttons = [...quizOptions.children];
  buttons.forEach((btn, n) => {
    btn.disabled = true;
    if (n === item.answer) btn.classList.add("ok");
    if (n === i && i !== item.answer) btn.classList.add("no");
  });
  if (i === item.answer) {
    quizHits += 1;
    quizFeedback.textContent = `To‘g‘ri. ${item.why}`;
    quizFeedback.style.color = "var(--ok)";
  } else {
    quizFeedback.textContent = `Noto‘g‘ri. ${item.why}`;
    quizFeedback.style.color = "var(--bad)";
  }
  quizNext.hidden = false;
  quizNext.textContent = quizIndex === QUIZ.length - 1 ? "Natija" : "Keyingi savol";
}

quizNext.addEventListener("click", () => {
  if (quizIndex === QUIZ.length - 1) {
    quizOptions.innerHTML = "";
    quizQ.textContent = "Mashq tugadi.";
    quizNext.hidden = true;
    quizDone.classList.remove("hidden");
    quizScore.textContent = `${quizHits} / ${QUIZ.length} to‘g‘ri`;
    return;
  }
  quizIndex += 1;
  renderQuiz();
});

document.getElementById("quiz-retry").addEventListener("click", () => {
  quizIndex = 0;
  quizHits = 0;
  renderQuiz();
});

const PAIRS = [
  { id: "who", word: "Who", definition: "Kim? — a person" },
  { id: "what", word: "What", definition: "Nima? — a thing or an action" },
  { id: "where", word: "Where", definition: "Qayerda? — a place" },
  { id: "when", word: "When", definition: "Qachon? — a time" },
  { id: "why", word: "Why", definition: "Nega? — a reason (because)" },
  { id: "which", word: "Which", definition: "Qaysi? — a choice from options" },
  { id: "whose", word: "Whose", definition: "Kimniki? — the owner" },
  { id: "how", word: "How", definition: "Qanday? — the way / manner" },
];

const wordsEl = document.getElementById("words");
const defsEl = document.getElementById("defs");
const matchFeedback = document.getElementById("match-feedback");
const matchedEl = document.getElementById("matched");
const accuracyEl = document.getElementById("accuracy");

let matched = 0;
let attempts = 0;
let hits = 0;
let selected = null;
let drag = null;
let matchReady = false;

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startMatch() {
  if (matchReady && matched > 0 && matched < PAIRS.length) return;
  matched = 0;
  attempts = 0;
  hits = 0;
  selected = null;
  matchReady = true;
  wordsEl.innerHTML = "";
  defsEl.innerHTML = "";
  matchFeedback.textContent = "";
  updateMatchHud();

  shuffle(PAIRS).forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "word";
    btn.draggable = true;
    btn.dataset.id = item.id;
    btn.textContent = item.word;
    btn.addEventListener("pointerdown", onPointerDown);
    btn.addEventListener("click", onWordClick);
    btn.addEventListener("dragstart", onDragStart);
    btn.addEventListener("dragend", onDragEnd);
    wordsEl.appendChild(btn);
  });

  shuffle(PAIRS).forEach((item) => {
    const card = document.createElement("article");
    card.className = "def";
    card.dataset.id = item.id;
    card.innerHTML = `<div class="slot"><span class="hint">Drop here</span></div><p>${item.definition}</p>`;
    card.addEventListener("click", onDefClick);
    card.addEventListener("dragover", onDragOver);
    card.addEventListener("dragleave", onDragLeave);
    card.addEventListener("drop", onDrop);
    defsEl.appendChild(card);
  });
}

function updateMatchHud() {
  matchedEl.textContent = `${matched} / ${PAIRS.length}`;
  const pct = attempts === 0 ? 100 : Math.round((hits / attempts) * 100);
  accuracyEl.textContent = `${pct}%`;
}

function cardFromPoint(x, y) {
  return document.elementFromPoint(x, y)?.closest(".def") || null;
}

function onPointerDown(event) {
  const word = event.currentTarget;
  if (event.pointerType === "mouse") return;
  if (word.classList.contains("placed") || drag) return;
  word.setPointerCapture(event.pointerId);
  const rect = word.getBoundingClientRect();
  const ghost = word.cloneNode(true);
  ghost.classList.add("ghost-chip");
  ghost.style.width = `${rect.width}px`;
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  document.body.appendChild(ghost);
  word.classList.add("dragging");
  drag = {
    word,
    ghost,
    offset: { x: event.clientX - rect.left, y: event.clientY - rect.top },
    over: null,
  };
  word.addEventListener("pointermove", onPointerMove);
  word.addEventListener("pointerup", onPointerUp);
  word.addEventListener("pointercancel", onPointerUp);
}

function onPointerMove(event) {
  if (!drag) return;
  drag.ghost.style.left = `${event.clientX - drag.offset.x}px`;
  drag.ghost.style.top = `${event.clientY - drag.offset.y}px`;
  drag.ghost.style.visibility = "hidden";
  const over = cardFromPoint(event.clientX, event.clientY);
  drag.ghost.style.visibility = "visible";
  if (drag.over && drag.over !== over) drag.over.classList.remove("over");
  if (over && !over.classList.contains("correct")) over.classList.add("over");
  drag.over = over && !over.classList.contains("correct") ? over : null;
}

function onPointerUp(event) {
  if (!drag) return;
  const { word, ghost } = drag;
  word.removeEventListener("pointermove", onPointerMove);
  word.removeEventListener("pointerup", onPointerUp);
  word.removeEventListener("pointercancel", onPointerUp);
  const drop = cardFromPoint(event.clientX, event.clientY);
  if (drag.over) drag.over.classList.remove("over");
  ghost.remove();
  word.classList.remove("dragging");
  drag = null;
  if (drop && !drop.classList.contains("correct")) resolveMatch(word, drop);
  else selectWord(word);
}

function selectWord(word) {
  if (word.classList.contains("placed")) return;
  document.querySelectorAll(".word.selected").forEach((el) => el.classList.remove("selected"));
  selected = word;
  word.classList.add("selected");
}

function onWordClick(event) {
  event.stopPropagation();
  selectWord(event.currentTarget);
}

function onDefClick(event) {
  const drop = event.currentTarget;
  if (!selected || drop.classList.contains("correct")) return;
  const word = selected;
  selected = null;
  word.classList.remove("selected");
  resolveMatch(word, drop);
}

function onDragStart(event) {
  const word = event.currentTarget;
  if (word.classList.contains("placed")) {
    event.preventDefault();
    return;
  }
  selected = word;
  word.classList.add("dragging");
  event.dataTransfer.setData("text/plain", word.dataset.id);
}

function onDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  document.querySelectorAll(".def.over").forEach((card) => card.classList.remove("over"));
}

function onDragOver(event) {
  const drop = event.currentTarget;
  if (drop.classList.contains("correct")) return;
  event.preventDefault();
  drop.classList.add("over");
}

function onDragLeave(event) {
  event.currentTarget.classList.remove("over");
}

function onDrop(event) {
  event.preventDefault();
  const drop = event.currentTarget;
  drop.classList.remove("over");
  const id = event.dataTransfer.getData("text/plain");
  const word = wordsEl.querySelector(`.word[data-id="${id}"]:not(.placed)`);
  if (!word) return;
  selected = null;
  word.classList.remove("selected", "dragging");
  resolveMatch(word, drop);
}

function resolveMatch(word, drop) {
  attempts += 1;
  const correct = drop.dataset.id === word.dataset.id;
  if (correct) {
    hits += 1;
    matched += 1;
    const hint = drop.querySelector(".hint");
    if (hint) hint.remove();
    word.classList.add("placed");
    drop.classList.add("correct");
    drop.querySelector(".slot").appendChild(word);
    matchFeedback.textContent = "Correct";
    matchFeedback.className = "feedback ok";
    updateMatchHud();
    if (matched === PAIRS.length) {
      matchFeedback.textContent = "Hammasi ulandi. Ajoyib!";
    }
    return;
  }
  drop.classList.add("incorrect");
  matchFeedback.textContent = "Incorrect — qayta urinib ko‘ring";
  matchFeedback.className = "feedback no";
  updateMatchHud();
  window.setTimeout(() => drop.classList.remove("incorrect"), 500);
}

show(0);
renderQuiz();
stage.focus();
