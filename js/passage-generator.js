const choose = items => items[Math.floor(Math.random() * items.length)];
let previousQuote = "";

export function createQuotePassage(quotes = {}, length = "medium") {
  const pool = quotes[length] ?? quotes.medium ?? [];
  if (!pool.length) return { passage: "Take one kind step forward.", attribution: "Keynetic" };
  const choices = pool.length > 1 ? pool.filter(item => item.quote !== previousQuote) : pool;
  const selected = choose(choices);
  previousQuote = selected.quote;
  return { passage: selected.quote, attribution: selected.attribution || "Unknown" };
}

export function createPassage({ mode = "words", difficulty = "easy", options = {}, wikiText, quotes = {}, quoteLength = "medium", wordPools = {} } = {}) {
  options ??= {};
  let text;
  if (mode === "wikipedia" && wikiText) text = wikiText;
  else if (mode === "quote") text = createQuotePassage(quotes, quoteLength).passage;
  else {
    const count = ({ easy: 20, medium: 25, hard: 30 })[difficulty] ?? 20;
    const pool = wordPools[difficulty] ?? [];
    if (!pool.length) return "Words are loading. Please restart the test.";
    text = Array.from({ length: options.long ? Math.round(count * 1.8) : count }, () => choose(pool)).join(" ");
  }
  // Include and Length controls are intended for generated word passages only.
  if (mode === "words" && options.caps) text = text.replace(/\b[a-z]/g, c => c.toUpperCase());
  if (mode === "words" && options.punctuation) {
    text = text.replace(/\s+/g, " ").replace(/\b(\w+)(?=\s|$)/g, (word, _match, offset) => {
      const next = text.slice(offset + word.length).trimStart();
      return next && Math.random() < 0.12 ? `${word},` : word;
    });
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if (!/[.!?]$/.test(text)) text += ".";
  }
  if (mode === "words" && options.numbers) text += ` ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10}%`;
  return text;
}
