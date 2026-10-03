const hero = document.querySelector("#hero");
const typing = document.querySelector("#typing");
const about = document.querySelector("#about");
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

function showHome() {
    typing.hidden = true;
    about.hidden = true;
    hero.hidden = false;
    hero.classList.remove("is-leaving");
    typing.classList.remove("is-visible");
    isTransitioning = false;
}

function showAbout() {
    hero.hidden = true;
    typing.hidden = true;
    about.classList.remove("is-entering");
    about.hidden = false;
    typing.classList.remove("is-visible");
    isTransitioning = false;
    requestAnimationFrame(() => about.classList.add("is-entering"));
}

enterBtn.addEventListener("click", startTyping);

document.querySelector("#feedback-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.querySelector("#feedback-message").value.trim();
    const status = document.querySelector("#feedback-status");

    try {
        await navigator.clipboard.writeText(message);
        status.textContent = "Copied. You can now send it to the project creator.";
    } catch {
        status.textContent = "Clipboard access is unavailable. Please copy your feedback manually.";
    }
});

document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    if (link.hash === "#typing") {
        event.preventDefault();
        about.hidden = true;
        hero.hidden = false;
        startTyping();
    } else if (link.hash === "#about") {
        event.preventDefault();
        showAbout();
        window.location.hash = "about";
    } else if (link.hash === "#hero" && !typing.hidden) {
        event.preventDefault();
        showHome();
        window.location.hash = "hero";
    } else if (link.hash === "#hero" && !about.hidden) {
        event.preventDefault();
        showHome();
        window.location.hash = "hero";
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !hero.hidden) {
        startTyping();
    }
});
