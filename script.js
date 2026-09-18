const hero = document.querySelector("#hero");
const typing = document.querySelector("#typing");
const enterBtn = document.querySelector("#enter-btn");
const typingInput = document.querySelector("#typing-input");
const heroTitle = document.querySelector("#hero-title");
let isTransitioning = false;

function animateHeroTitle() {
    if (!heroTitle) return;

    const title = heroTitle.dataset.text;
    const typingSpeed = 75;
    let startTime;
    let displayedCharacters = 0;

    function typeNextCharacter(timestamp) {
        startTime ??= timestamp;

        const characterCount = Math.min(
            Math.floor((timestamp - startTime) / typingSpeed),
            title.length
        );

        if (characterCount > displayedCharacters) {
            heroTitle.textContent = title.slice(0, characterCount);
            displayedCharacters = characterCount;
        }

        if (displayedCharacters < title.length) {
            requestAnimationFrame(typeNextCharacter);
        } else {
            heroTitle.classList.add("is-typed");
        }
    }

    requestAnimationFrame(typeNextCharacter);
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
