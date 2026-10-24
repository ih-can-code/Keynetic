const API = "https://en.wikipedia.org/w/api.php";
const RANDOM_SEARCHES = [
  "planet", "mountain", "river", "island", "national park", "animal species",
  "plant species", "invention", "scientific discovery", "chemical element",
  "space mission", "historical event", "ancient civilization", "architecture",
  "painting", "musical instrument", "literary work", "language", "traditional food",
  "sport", "technology", "ocean", "volcano", "museum", "festival", "mythology"
];

async function fetchIntro(params, signal, randomResult = false) {
  const url = new URL(API);
  url.search = new URLSearchParams({ ...params, prop: "extracts", exintro: "1", explaintext: "1", exsentences: "6", format: "json", origin: "*" });
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Wikipedia could not be reached. Please try again.");
  const data = await response.json();
  const pages = Object.values(data.query?.pages ?? {});
  const page = randomResult ? pages[Math.floor(Math.random() * pages.length)] : pages[0];
  const text = page?.extract?.replace(/\s+/g, " ").trim();
  if (!text) throw new Error("No introductory text found. Try a different topic.");
  return { title: page.title, text: text.slice(0, 1600), url: `https://en.wikipedia.org/?curid=${page.pageid}` };
}

export function fetchWikipediaIntro(topic, signal) {
  return fetchIntro({ action: "query", generator: "search", gsrsearch: topic, gsrlimit: "1" }, signal);
}

export function fetchRandomWikipediaIntro(signal) {
  const topic = RANDOM_SEARCHES[Math.floor(Math.random() * RANDOM_SEARCHES.length)];
  return fetchIntro({ action: "query", generator: "search", gsrsearch: topic, gsrlimit: "10" }, signal, true);
}
