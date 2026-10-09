export function setupNavigation() {
  const hero = document.querySelector("#hero"), typing = document.querySelector("#typing"), about = document.querySelector("#about");
  let transitioning = false;
  const show = name => {
    if (name !== "typing") document.dispatchEvent(new Event("keynetic:leave"));
    window.scrollTo(0, 0);
    hero.hidden = name !== "hero"; typing.hidden = name !== "typing"; about.hidden = name !== "about";
    typing.classList.toggle("is-visible", name === "typing");
    transitioning = false;
    if (name === "typing") { document.dispatchEvent(new Event("keynetic:typing")); }
  };
  const enter = () => {
    if (transitioning) return; transitioning = true; hero.classList.add("is-leaving");
    setTimeout(() => { show("typing"); hero.classList.remove("is-leaving"); }, 220);
  };
  document.querySelector("#enter-btn").addEventListener("click", enter);
  document.addEventListener("keydown", event => { if (event.key === "Enter" && !hero.hidden && !event.target.matches("input,textarea,button,select,a")) enter(); });
  document.addEventListener("click", event => {
    const link = event.target.closest("a[href^='#']"); if (!link) return;
    if (link.hash === "#typing") { event.preventDefault(); show("typing"); history.replaceState(null, "", "#typing"); }
    if (link.hash === "#about") { event.preventDefault(); show("about"); history.replaceState(null, "", "#about"); }
    if (link.hash === "#hero") { event.preventDefault(); show("hero"); history.replaceState(null, "", "#hero"); }
  });
  window.addEventListener("hashchange", () => show(location.hash === "#about" ? "about" : location.hash === "#typing" ? "typing" : "hero"));
  if (location.hash === "#typing" || location.hash === "#about") show(location.hash.slice(1));
  return { show };
}

