export async function loadLocalQuotes() {
  const url = new URL("../data/quotes.json", import.meta.url);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load the local quotes file.");

  const quotes = await response.json();
  for (const category of ["short", "medium", "large"]) {
    if (!Array.isArray(quotes[category]) || quotes[category].length !== 20) {
      throw new Error(`The ${category} quote collection must contain exactly 20 quotes.`);
    }
  }
  return quotes;
}