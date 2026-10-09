const API = "https://en.wikipedia.org/w/api.php";
export async function fetchWikipediaIntro(topic, signal) {
  const url = new URL(API);
  url.search = new URLSearchParams({ action: "query", generator: "search", gsrsearch: topic, gsrlimit: "1", prop: "extracts", exintro: "1", explaintext: "1", exsentences: "6", format: "json", origin: "*" });
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Wikipedia could not be reached. Please try again.");
  const data = await response.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const text = page?.extract?.replace(/\s+/g, " ").trim();
  if (!text) throw new Error("No introductory text found. Try a different topic.");
  return { title: page.title, text: text.slice(0, 1600), url: `https://en.wikipedia.org/?curid=${page.pageid}` };
}
