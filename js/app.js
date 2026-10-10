import { createPassage } from "./passage-generator.js";
import { createTypingSession } from "./typing.js";
import { fetchWikipediaIntro } from "./wikipedia.js";
import { setupNavigation } from "./navigation.js";

const $ = selector => document.querySelector(selector);
const optionsForm = $(".opts-form");
let wikiText = null;
const settings = () => {
  const selected = name => optionsForm.querySelector(`[name="${name}"]:checked`);
  const checked = id => $(`#${id}`).checked;
  const mode = $("#mode-select").value;
  const difficulty = selected("diff")?.id.replace("diff-", "") ?? "easy";
  const duration = Number(selected("time")?.id.replace("time-", "") ?? 30);
  const passage = createPassage({ difficulty, mode, options: { long: checked("len-long"), caps: checked("opt-caps"), punctuation: checked("opt-punct"), numbers: checked("opt-nums") }, wikiText: wikiText?.text });
  return { difficulty, mode, duration, passage };
};
const loadHistory = () => { try { return JSON.parse(localStorage.getItem("keynetic-results") || "[]"); } catch { return []; } };
const streakOf = history => {
  const days = new Set(history.map(r => new Date(r.date).toDateString()));
  let streak = 0; const d = new Date();
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1); // today not played yet: streak still alive
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
};
const renderStats = () => {
  const history = loadHistory(), last = history.at(-1), values = document.querySelectorAll(".hero-panel-value");
  values[0].textContent = last ? `${last.wpm} wpm` : "—";
  values[1].textContent = last ? `${last.accuracy}%` : "—";
  const streak = streakOf(history);
  values[2].textContent = `${streak} day${streak === 1 ? "" : "s"}`;
};
const session = createTypingSession({
  elements: { input: $("#typing-input"), text: $("#typing-text"), live: $("#live-stat"), timerFill: $(".timer-fill"), restart: $("#restart-btn"), next: $("#next-test"), stage: $(".typing-stage") },
  getSettings: () => {
    const current = settings();
    $("#info-diff").textContent = current.difficulty;
    $("#info-mode").textContent = current.mode === "wikipedia" ? "Wikipedia" : current.mode;
    $("#info-time").textContent = `${current.duration}s`;
    return current;
  },
  onFinish: result => {
    $("#result-wpm").textContent = result.wpm;
    $("#result-accuracy").textContent = `${result.accuracy}%`;
    $("#result-correct").textContent = result.correct;
    const history = loadHistory();
    const best = Math.max(0, ...history.map(r => r.wpm));
    $("#result-card .about-eyebrow").textContent = result.wpm > best ? "New personal best!" : `Session complete · best ${Math.max(best, result.wpm)} WPM`;
    $("#result-card").showModal();
    history.push({ ...result, date: new Date().toISOString() });
    try { localStorage.setItem("keynetic-results", JSON.stringify(history.slice(-30))); } catch { /* storage full or blocked */ }
    renderStats();
  }
});
const sync = () => {
  const isWiki = $("#mode-select").value === "wikipedia";
  $("#wikipedia-form").hidden = !isWiki;
  $("#typing-text").hidden = isWiki && !wikiText;
  if ($("#typing").hidden) return;
  if ($("#result-card").open) $("#result-card").close();
  if (isWiki && !wikiText) { session.cancel(); $("#typing-input").disabled = true; $("#live-stat").textContent = "Load a Wikipedia topic to begin"; return; }
  $("#typing-input").disabled = false; session.start();
};
document.addEventListener("keynetic:typing", sync);
document.addEventListener("keynetic:leave", () => session.cancel());
document.addEventListener("keydown", e => {
  if (e.key === "Escape") $("#opt-more").checked = false;
  if (e.key === "Enter" && e.shiftKey && !$("#typing").hidden) {
    e.preventDefault();
    if ($("#result-card").open) $("#result-card").close();
    session.start();
  }
});
optionsForm.addEventListener("reset", () => setTimeout(sync, 0));
const RESTARTS = new Set(["time", "diff", "len", "opt-punct", "opt-nums", "opt-caps"]);
optionsForm.addEventListener("change", ({ target }) => { if (RESTARTS.has(target.name) || RESTARTS.has(target.id)) sync(); });
$("#mode-select").addEventListener("change", sync);
$("#wikipedia-form").addEventListener("submit", async event => {
  event.preventDefault();
  const status = $("#wiki-status"), button = $("#wiki-load");
  button.disabled = true; status.textContent = "Searching Wikipedia…";
  try {
    wikiText = await fetchWikipediaIntro($("#wiki-topic").value.trim());
    session.cancel();
    $("#typing-text").hidden = false;
    $("#typing-input").disabled = false;
    if ($("#result-card").open) $("#result-card").close();
    session.start();
    const link = Object.assign(document.createElement("a"), { href: wikiText.url, target: "_blank", rel: "noopener", textContent: `${wikiText.title} on Wikipedia` });
    status.replaceChildren("Loaded ", link, ".");
  } catch (error) { status.textContent = error.message; }
  finally { button.disabled = false; }
});

const title = $("#hero-title"), text = title.dataset.text;
let i = 0;
const animate = () => { if (i < text.length) { title.textContent += text[i++]; setTimeout(animate, 75); } else title.classList.add("is-typed"); };
animate();
$("#feedback-form").addEventListener("submit", async event => {
  event.preventDefault();
  const status = $("#feedback-status");
  try { await navigator.clipboard.writeText($("#feedback-message").value.trim()); status.textContent = "Copied. You can now send it to the project creator."; }
  catch { status.textContent = "Clipboard unavailable. Please copy your feedback manually."; }
});
const themeSelect = $("#theme-select");
const themes = new Set(["midnight", "graphite", "forest", "ocean", "plum", "paper", "mist", "sand"]);
let savedTheme = "midnight";
try { savedTheme = localStorage.getItem("keynetic-theme") || savedTheme; } catch { /* storage unavailable */ }
if (!themes.has(savedTheme)) savedTheme = "midnight";
const applyTheme = theme => {
  document.body.dataset.theme = theme;
  themeSelect.value = theme;
  try { localStorage.setItem("keynetic-theme", theme); } catch { /* storage unavailable */ }
};
applyTheme(savedTheme);
themeSelect.addEventListener("change", () => applyTheme(themeSelect.value));
setupNavigation();

renderStats();


