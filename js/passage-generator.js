const wordPools = {
  easy: "a an the and or but if in on at to of for with from by up down out as is it this that not can get make go come see look say use work play help keep good new old big small little fast slow warm cold kind happy day sun tree book home hand walk run jump eat drink read write learn grow find give take open close move turn start stop".split(" "),
  medium: "while when because through across around between beyond within after before beside beneath above toward every each many few some bright calm clear careful steady quiet curious thoughtful patient focused simple useful honest large gentle lively fresh strong soft quick learn build share create practice improve discover explore notice connect choose carry shape follow change answer travel listen remember explain imagine compare collect".split(" "),
  hard: "adaptable deliberate intricate resilient articulate precise perspective momentum subtle transform reliable ambiguous authentic collaborate consequence demonstrate efficiency facilitate hypothesis interpret maintain negotiate objective perceive prerequisite prioritize significant strategy synchronize technique versatile comprehensive conscientious determination sophisticated".split(" ")
};
const quotes = ["Small steps every day build steady progress.", "A clear mind makes room for thoughtful work.", "Practice turns careful effort into lasting skill.", "Curiosity opens doors that routine can leave closed."];
const choose = items => items[Math.floor(Math.random() * items.length)];

export function createPassage({ mode, difficulty = "easy", options = {}, wikiText }) {
  let text;
  if (mode === "wikipedia" && wikiText) text = wikiText;
  else if (mode === "quote") text = choose(quotes);
  else {
    const count = ({ easy: 20, medium: 25, hard: 30 })[difficulty] ?? 20;
    const pool = wordPools[difficulty] ?? wordPools.easy;
    text = Array.from({ length: options.long ? Math.round(count * 1.8) : count }, () => choose(pool)).join(" ");
  }
  if (options.caps) text = text.replace(/\b[a-z]/g, c => c.toUpperCase());
  if (options.punctuation) {
    text = text.replace(/\s+/g, " ").replace(/\b(\w+)(?=\s|$)/g, (word, _match, offset) => {
      const next = text.slice(offset + word.length).trimStart();
      return next && Math.random() < 0.12 ? `${word},` : word;
    });
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if (!/[.!?]$/.test(text)) text += ".";
  }
  if (options.numbers) text += ` ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10}%`;
  return text;
}
