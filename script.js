const MIN = 1;
const MAX = 100;
const MAX_ATTEMPTS = 7;

const form = document.querySelector("#guess-form");
const input = document.querySelector("#guess");
const submit = document.querySelector("#submit");
const feedback = document.querySelector("#feedback");
const history = document.querySelector("#history");
const lives = document.querySelector("#lives");
const lowBound = document.querySelector("#low-bound");
const highBound = document.querySelector("#high-bound");
const rangeCaption = document.querySelector("#range-caption");
const trackFill = document.querySelector("#track-fill");
const card = document.querySelector(".card");
const result = document.querySelector("#result");
const resultKicker = document.querySelector("#result-kicker");
const resultNumber = document.querySelector("#result-number");
const resultCopy = document.querySelector("#result-copy");
const restart = document.querySelector("#restart");

const state = {
  secret: 0,
  attemptsLeft: MAX_ATTEMPTS,
  low: MIN,
  high: MAX,
  guesses: [],
  over: false,
};

function randomSecret() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

function startGame() {
  state.secret = randomSecret();
  state.attemptsLeft = MAX_ATTEMPTS;
  state.low = MIN;
  state.high = MAX;
  state.guesses = [];
  state.over = false;

  input.value = "";
  input.disabled = false;
  submit.disabled = false;
  card.classList.remove("is-over");
  result.hidden = true;
  setFeedback("Masukkan angka, lalu tekan Tebak.", "");
  render();
  input.focus();
}

function setFeedback(text, tone) {
  feedback.textContent = text;
  feedback.className = tone ? `feedback ${tone}` : "feedback";
}

function renderLives() {
  lives.replaceChildren();
  for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
    const pip = document.createElement("span");
    pip.className = i < state.attemptsLeft ? "life" : "life spent";
    lives.append(pip);
  }
  const used = MAX_ATTEMPTS - state.attemptsLeft;
  lives.setAttribute(
    "aria-label",
    `${state.attemptsLeft} kesempatan tersisa, ${used} sudah dipakai`
  );
}

function renderRange() {
  lowBound.textContent = String(state.low);
  highBound.textContent = String(state.high);
  const span = MAX - MIN;
  const start = ((state.low - MIN) / span) * 100;
  const width = ((state.high - state.low) / span) * 100;
  trackFill.style.marginLeft = `${start}%`;
  trackFill.style.width = `${Math.max(width, 1.5)}%`;
  rangeCaption.textContent =
    state.low === state.high
      ? `Hanya tersisa ${state.low}`
      : `Masih mungkin: ${state.low}–${state.high}`;
}

function renderHistory() {
  history.replaceChildren();
  state.guesses.forEach((guess, index) => {
    const item = document.createElement("li");
    item.className = `chip ${guess.tone}`;
    const value = document.createElement("span");
    value.textContent = String(guess.value);
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = `${index + 1}. ${guess.label}`;
    item.append(value, tag);
    history.append(item);
  });
}

function render() {
  renderLives();
  renderRange();
  renderHistory();
}

function endGame(won) {
  state.over = true;
  input.disabled = true;
  submit.disabled = true;
  card.classList.add("is-over");
  result.hidden = false;
  resultKicker.textContent = won ? "Tepat" : "Kesempatan habis";
  resultNumber.textContent = String(state.secret);
  const spent = MAX_ATTEMPTS - state.attemptsLeft;
  resultCopy.textContent = won
    ? `Kamu menemukannya dalam ${spent} tebakan.`
    : "Angka yang tadi disembunyikan ada di atas.";
  restart.focus();
}

function submitGuess(raw) {
  if (state.over) return;

  if (!/^\d+$/.test(raw)) {
    setFeedback("Masukkan bilangan bulat dari 1 sampai 100.", "warn");
    input.focus();
    return;
  }

  const value = Number(raw);
  if (value < MIN || value > MAX) {
    setFeedback("Angkanya harus di antara 1 dan 100.", "warn");
    return;
  }

  if (value < state.low || value > state.high) {
    setFeedback(
      `Angka itu sudah tersingkir. Coba antara ${state.low} dan ${state.high}.`,
      "warn"
    );
    return;
  }

  if (state.guesses.some((guess) => guess.value === value)) {
    setFeedback("Angka ini sudah kamu tebak.", "warn");
    return;
  }

  state.attemptsLeft -= 1;

  if (value === state.secret) {
    state.guesses.push({ value, tone: "win", label: "tepat" });
    setFeedback("Tepat sekali.", "win");
    render();
    endGame(true);
    return;
  }

  if (value < state.secret) {
    state.low = value + 1;
    state.guesses.push({ value, tone: "low", label: "terlalu rendah" });
    setFeedback(`${value} terlalu rendah.`, "low");
  } else {
    state.high = value - 1;
    state.guesses.push({ value, tone: "high", label: "terlalu tinggi" });
    setFeedback(`${value} terlalu tinggi.`, "high");
  }

  render();
  input.value = "";

  if (state.attemptsLeft === 0) {
    endGame(false);
    return;
  }

  input.focus();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitGuess(input.value.trim());
});

restart.addEventListener("click", startGame);

startGame();
