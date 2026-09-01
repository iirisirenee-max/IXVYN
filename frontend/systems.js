document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".system-card");

    cards.forEach((card) => {

        card.addEventListener("click", () => {

            // Prevent repeated animation while one is running
            if (card.classList.contains("is-opening")) return;

            card.classList.add("is-opening");

            // Let the visual response happen first
            setTimeout(() => {
                card.classList.remove("is-opening");
            }, 850);
        });

        // Subtle movement following the pointer
        card.addEventListener("pointermove", (event) => {

            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateX = ((y / rect.height) - 0.5) * -2;
            const rotateY = ((x / rect.width) - 0.5) * 2;

            card.style.setProperty("--mx", `${x}px`);
            card.style.setProperty("--my", `${y}px`);

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });
});
