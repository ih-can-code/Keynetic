const words = "a an the and or but while when because through across around between beyond within after before beside beneath above toward from into over under every each many few some bright calm clear careful steady quiet curious thoughtful patient focused simple useful kind honest small large gentle lively open fresh strong warm cool soft quick slow learn build share create practice improve discover explore notice connect choose carry shape make find keep write read think move grow follow".split(" ");
const codeParts = ["const", "let", "return", "if", "for", "while", "items", "values", "result", "total", "user", "data", "name", "count", "score", "=>", "===", "!==", "&&", "??", "?.", "()", "[]", "{}", ";", ".map", ".filter", ".length", " = ", " + ", " > ", " ? "];
const choose = items => items[Math.floor(Math.random() * items.length)];
const makeWords = count => Array.from({ length: count }, () => choose(words)).join(" ");
const makeCode = () => Array.from({ length: 22 }, () => choose(codeParts)).join("");

export function createPassage({ mode, options = {}, wikiText }) {
  let text;
  if (mode === "code") text = makeCode();
  else if (mode === "wikipedia" && wikiText) text = wikiText;
  else text = makeWords(options.long ? 36 : 20);
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
