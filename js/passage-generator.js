const wordPools = {
  easy: `
    a an the and or but if in on at to of for with from by up down out as is it
    this that not can get make go come see look say use work play help keep good
    new old big small little fast slow warm cold kind happy day sun tree book home
    hand walk run jump eat drink read write learn grow find give take open close
    move turn start stop cat dog bird fish duck cow pig hen horse rabbit mouse bear
    lion tiger fox wolf frog snake ant bee fly bug pet red blue green yellow black
    white pink brown gray gold silver orange purple one two three four five six
    seven eight nine ten zero yes no all any more most less very much such only
    also just even still now then here there where why how what who which when again
    away back near far left right high low long short tall round flat hot cool dry
    wet dark light soft hard clean dirty full empty rich poor young best last first
    next same different true false okay hello bye please thanks sorry welcome friend
    family mother father sister brother child boy girl man woman person people name
    face head hair eye ear nose mouth tooth neck arm leg foot skin body heart rain
    snow wind sky cloud star moon earth fire water air land sea river lake hill
    mountain road street house room door wall floor roof bed chair table desk cup
    plate bowl spoon fork knife pot pan bag box key lock clock watch phone computer
    screen game music song sound color paper pencil pen chalk school class teacher
    student lesson test exam math science art history word letter number question
    answer idea story joke smile laugh talk speak ask tell think know understand try
    need want like love care feel hope wish dream sleep wake sit stand climb swim
    dance sing draw build fix break cut wash cook bake buy sell pay cost save spend
    wear bring send show hide hold touch push pull throw catch kick hit win lose
    begin end finish wait stop
  `.trim().split(/\s+/),
  medium: `
    while when because through across around between beyond within after before beside
    beneath above toward every each many few some bright calm clear careful steady quiet
    curious thoughtful patient focused simple useful honest large gentle lively fresh strong
    soft quick learn build share create practice improve discover explore notice connect
    choose carry shape follow change answer travel listen remember explain imagine compare
    collect develop manage solve design prepare decide consider suggest discuss support achieve
    balance challenge complete control respond describe organize analyze observe examine research
    calculate measure estimate predict express reflect question identify combine divide multiply
    subtract increase reduce protect respect trust communicate concentrate motivate inspire arrange
    adjust apply attempt avoid behave believe belong borrow breathe celebrate compete complain
    confirm continue correct deliver depend differ direct disappear download educate employ enjoy
    escape exist expand expect experience experiment gather guess guide handle influence inform
    invite judge lead lend lift limit locate mention offer order pack paint pause perform plan
    prefer present prevent print produce promise publish reach realize receive recognize record
    recycle refer refuse relate relax release repeat replace reply require return review satisfy
    search select separate serve settle shine simplify skip sort spread state step
  `.trim().split(/\s+/),
  hard: `
    adaptable deliberate intricate resilient articulate precise perspective momentum subtle transform
    reliable ambiguous authentic collaborate consequence demonstrate efficiency facilitate hypothesis
    interpret maintain negotiate objective perceive prerequisite prioritize significant strategy
    synchronize technique versatile comprehensive conscientious determination sophisticated analytical
    appreciation approximation assumption authoritative beneficial characteristic circumstance
    clarification coherent compelling complexity conceptual considerable consistency conventional
    correspondence credibility criterion critical deduction definition derive distinguish diversity
    elaborate eliminate empirical emphasize equivalent evaluate evidence exceptional exhaustive explicit
    fundamental generate illustrate implication incentive incorporate inevitable inference innovative
    integrate integrity intellectual interaction justification legitimate methodology meticulous
    nevertheless observation occurrence operational paradigm parameter phenomenon philosophy preliminary
    predominantly procedure proficiency proportion qualitative quantitative rationale reconstruction
    relevant representation resolution restriction rigorous simultaneous specification sufficient
    theoretical thorough transition underlying validate variable accuracy acquisition alternative
    ambiguity analogy anticipation applicable assertion assessment attain awareness capability
    capacity chronological classification collaboration commentary commitment comparison compensation
    competence competitive complement concentration conception conclusion conditional confirmation
    conflict consideration constraint contemporary context contradiction contribution controversy
    convenience correlation deficiency derivation description determination differentiation
    discrepancy discretion distinctive documentation effectiveness element emphasis equivalent
    estimation evaluation examination exception exclusion execution expectation expertise
    explicitness feasibility formulation frequency functionality generalization implication
    interpretation investigation limitation manipulation mechanism negotiation optimization
    organization participation perception persistence perspective phenomenon qualification
    recommendation regulation reliability requirement significance simulation sustainability
    transformation uncertainty utilization verification
  `.trim().split(/\s+/)
};
const quotes = ["Small steps every day build steady progress.", "A clear mind makes room for thoughtful work.", "Practice turns careful effort into lasting skill.", "Curiosity opens doors that routine can leave closed."];
const choose = items => items[Math.floor(Math.random() * items.length)];

export function createPassage({ mode = "words", difficulty = "easy", options = {}, wikiText } = {}) {
  options ??= {};
  let text;
  if (mode === "wikipedia" && wikiText) text = wikiText;
  else if (mode === "quote") text = choose(quotes);
  else {
    const count = ({ easy: 20, medium: 25, hard: 30 })[difficulty] ?? 20;
    const pool = wordPools[difficulty] ?? wordPools.easy;
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
