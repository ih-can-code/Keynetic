export function createTypingSession({ elements, getSettings, onFinish }) {
  let target = "", duration = 30, startedAt = 0, timer = null, active = false;
  const stop = () => { active = false; clearInterval(timer); };
  const appendText = () => {
    const more = getSettings().passage.replace(/\s*\n\s*/g, " ");
    target += `${target ? " " : ""}${more}`;
  };
  const renderText = () => {
    const typed = elements.input.value;
    elements.text.replaceChildren(...target.split("").map((char, index) => {
      const span = document.createElement("span");
      span.className = index < typed.length ? (typed[index] === char ? "char-correct" : "char-error") : "char-pending";
      if (index === typed.length) span.style.boxShadow = "inset 2px 0 0 var(--accent)";
      span.textContent = char;
      return span;
    }));
  };
  const update = () => {
    const spent = (Date.now() - startedAt) / 1000;
    const elapsed = Math.min(duration, Math.max(1, spent));
    const typed = elements.input.value;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
    const wpm = Math.round(correct / 5 / (elapsed / 60));
    const accuracy = typed.length ? Math.round(correct / typed.length * 100) : 100;
    const left = Math.max(0, Math.ceil(duration - spent));
    elements.live.textContent = `${left}s · ${wpm} WPM · ${accuracy}% accuracy`;
    return { wpm, accuracy, correct, typed: typed.length, elapsed };
  };
  const finish = () => {
    if (!active) return;
    stop(); elements.input.disabled = true;
    onFinish(update());
  };
  const start = () => {
    stop();
    const result = document.querySelector("#result-card");
    if (result?.open) result.close();
    const settings = getSettings();
    target = settings.passage.replace(/\s*\n\s*/g, " ");
    duration = settings.duration; startedAt = 0;
    elements.input.disabled = false; elements.input.value = "";
    elements.live.textContent = `${duration}s · 0 WPM · 100% accuracy`;
    renderText();
    elements.input.blur(); void elements.stage.offsetWidth; elements.input.focus();
  };
  elements.input.addEventListener("input", () => {
    if (!target) return;
    if (elements.input.value.length > target.length) elements.input.value = elements.input.value.slice(0, target.length);
    if (target.length - elements.input.value.length < 120) appendText();
    if (!active) {
      active = true; startedAt = Date.now();
      timer = setInterval(() => (Date.now() - startedAt >= duration * 1000 ? finish() : update()), 200);
    }
    renderText(); update();
  });
  elements.input.addEventListener("keydown", event => {
    if (event.key === "Enter") event.preventDefault();
    if (event.key === "Escape") start();
  });
  ["paste", "cut", "drop"].forEach(type => elements.input.addEventListener(type, event => event.preventDefault()));
  elements.input.addEventListener("click", () => { const n = elements.input.value.length; elements.input.setSelectionRange(n, n); });
  elements.restart.addEventListener("click", start);
  elements.next.addEventListener("click", start);
  elements.stage.addEventListener("click", () => { if (!elements.input.disabled) elements.input.focus(); });
  return { start, cancel: stop };
}





