const hero = document.querySelector("#hero");
const typing = document.querySelector("#typing");
const enterBtn = document.querySelector("#enter-btn");
const typingInput = document.querySelector("#typing-input");
const heroTitle = document.querySelector("#hero-title");
let isTransitioning = false;

function animateHeroTitle() {
    const title = heroTitle.dataset.text;
    let characterIndex = 0;

    const typingAnimation = setInterval(() => {
        heroTitle.textContent += title[characterIndex];
        characterIndex += 1;

        if (characterIndex === title.length) {
            clearInterval(typingAnimation);
            heroTitle.classList.add("is-typed");
        }
    }, 85);
}

animateHeroTitle();

function startTyping() {
    if (isTransitioning) return;

    isTransitioning = true;
    hero.classList.add("is-leaving");

    setTimeout(() => {
        hero.hidden = true;
        typing.hidden = false;

        requestAnimationFrame(() => {
            typing.classList.add("is-visible");
            typingInput.focus();
        });
    }, 250);
}

enterBtn.addEventListener("click", startTyping);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !hero.hidden) {
        startTyping();
    }
});
