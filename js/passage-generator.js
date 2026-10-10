const words = "a an the and or but while when because through across around between beyond within after before beside beneath above toward from into over under every each many few some bright calm clear careful steady quiet curious thoughtful patient focused simple useful kind honest small large gentle lively open fresh strong warm cool soft quick slow learn build share create practice improve discover explore notice connect choose carry shape make find keep write read think move grow follow".split(" ");
const harderWords = "adaptable deliberate intricate resilient articulate precise perspective momentum subtle transform reliable".split(" ");
const quotes = ["Small steps every day build steady progress.", "A clear mind makes room for thoughtful work.", "Practice turns careful effort into lasting skill.", "Curiosity opens doors that routine can leave closed."];
const codeParts = ["const", "let", "return", "if", "for", "while", "items", "values", "result", "total", "user", "data", "name", "count", "score", "=>", "===", "!==", "&&", "??", "?.", "()", "[]", "{}", ";", ".map", ".filter", ".length", " = ", " + ", " > ", " ? "];
const choose = items => items[Math.floor(Math.random() * items.length)];
const makeCode = () => Array.from({ length: 22 }, () => choose(codeParts)).join("");

export function createPassage({ mode, difficulty = "easy", options = {}, wikiText }) {
  let text;
  if (mode === "code") text = makeCode();
  else if (mode === "wikipedia" && wikiText) text = wikiText;
  else if (mode === "quote") text = choose(quotes);
  else {
    const count = ({ easy: 20, medium: 25, hard: 30 })[difficulty] ?? 20;
    const pool = difficulty === "hard" ? [...words, ...harderWords] : words;
    text = Array.from({ length: options.long ? Math.round(count * 1.8) : count }, () => choose(pool)).join(" ");
  }
  if (options.caps) text = text.replace(/\b[a-z]/g, c => c.toUpperCase());
  if (options.punctuation && mode !== "code") {
    text = text.replace(/\s+/g, " ").replace(/\b(\w+)(?=\s|$)/g, (word, _match, offset) => {
      const next = text.slice(offset + word.length).trimStart();
      return next && Math.random() < 0.12 ? `${word},` : word;
    });
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if (!/[.!?]$/.test(text)) text += ".";
  }
  if (options.numbers && mode !== "code") text += ` ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10}%`;
  return text;
}
