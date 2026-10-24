export async function loadLocalWords() {
  const url = new URL("../data/words.json", import.meta.url);
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load the local words file.");

  const pools = await response.json();
  for (const level of ["easy", "medium", "hard"]) {
    if (!Array.isArray(pools[level]) || !pools[level].length || pools[level].some(word => typeof word !== "string" || !word.trim())) {
      throw new Error(`The ${level} word list is missing or invalid.`);
    }
  }
  return pools;
}
