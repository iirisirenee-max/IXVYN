document.addEventListener("DOMContentLoaded", () => {

    console.log("IXVYN is alive.");

    const beginButton =
        document.getElementById("begin-button");

    const directionPage =
        document.querySelector(".direction-page");


    /*
    =====================================================
    PAGE 3 → PAGE 4
    =====================================================
    */

    if (beginButton) {

        beginButton.addEventListener("click", () => {

            // Start the cinematic transition
            directionPage.classList.add("transitioning");


            // Give the geometry time to collapse
            // before entering the next system.
            setTimeout(() => {

                window.location.href = "systems.html";

            }, 900);

        });

    }


    /*
    =====================================================
    INITIATE EXPLORATION
    =====================================================
    */

    const initiate =
        document.querySelector(".initiate");

    if (initiate) {

        initiate.addEventListener("click", (event) => {

            const target =
                document.querySelector("#systems");

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        });

    }


    /*
    =====================================================
    SYSTEM CARD MICRO-INTERACTION
    =====================================================
    */

    const cards =
        document.querySelectorAll(".system-card");

    cards.forEach((card) => {

        card.addEventListener("mouseenter", () => {

            card.dataset.hovered = "true";

        });

        card.addEventListener("mouseleave", () => {

            delete card.dataset.hovered;

        });

    });

});
