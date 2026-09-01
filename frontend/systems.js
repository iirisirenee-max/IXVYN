document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".system-card");

    if (!cards.length) return;

    let transitioning = false;

    /*
    ============================================
    IXVYN — SYSTEM TRANSITION ENGINE
    ============================================
    No flashes.
    No aggressive zooms.
    The interface itself becomes the transition.
    */

    cards.forEach((card) => {

        /* -----------------------------
           POINTER GEOMETRY
        ----------------------------- */

        card.addEventListener("pointermove", (event) => {

            if (
                transitioning ||
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ) {
                return;
            }

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const px = x / rect.width;
            const py = y / rect.height;

            const rotateX = (0.5 - py) * 2;
            const rotateY = (px - 0.5) * 2;

            card.style.setProperty("--mx", `${x}px`);
            card.style.setProperty("--my", `${y}px`);

            card.style.transform =
                `perspective(1200px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateZ(8px)`;
        });


        card.addEventListener("pointerleave", () => {

            if (transitioning) return;

            card.style.transform =
                "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)";
        });


        /* -----------------------------
           SYSTEM SELECTION
        ----------------------------- */

        card.addEventListener("click", () => {

            if (transitioning) return;

            transitioning = true;

            const system =
                card.dataset.module || "lens";

            document.body.dataset.activeSystem = system;

            /*
            Tell CSS which system is being selected.
            */

            document.documentElement.style.setProperty(
                "--active-system",
                `"${system}"`
            );

            /*
            Freeze pointer geometry.
            */

            cards.forEach((otherCard) => {

                otherCard.style.pointerEvents = "none";

                if (otherCard !== card) {
                    otherCard.classList.add("is-receding");
                }
            });

            /*
            The selected card becomes the origin
            of the transition.
            */

            card.classList.add("is-selected");

            /*
            Give the browser one frame before
            beginning the cinematic movement.
            */

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    document.body.classList.add("system-transition");

                    /*
                    Store the selected system so the
                    next screen knows what was chosen.
                    */

                    sessionStorage.setItem(
                        "ixvyn-active-system",
                        system
                    );

                    /*
                    Move into the direction screen.
                    */

                    setTimeout(() => {

                        window.location.href =
                            `systems.html?system=${encodeURIComponent(system)}`;

                    }, 950);

                });

            });

        });

    });


    /* ============================================
       BEGIN BUTTON
       ============================================ */

    const beginButton =
        document.getElementById("begin-button");

    if (beginButton) {

        beginButton.addEventListener("click", () => {

            if (transitioning) return;

            transitioning = true;

            const system =
                sessionStorage.getItem("ixvyn-active-system") ||
                new URLSearchParams(window.location.search)
                    .get("system") ||
                "lens";

            document.body.dataset.activeSystem = system;

            document.body.classList.add("begin-transition");

            /*
            The actual system experience will be
            entered after the geometry settles.
            */

            setTimeout(() => {

                window.location.href =
                    `system-${encodeURIComponent(system)}.html`;

            }, 1100);

        });

    }


    /* ============================================
       RESTORE SELECTED SYSTEM
       ============================================ */

    const params =
        new URLSearchParams(window.location.search);

    const activeSystem =
        params.get("system");

    if (activeSystem) {

        document.body.dataset.activeSystem =
            activeSystem;

        sessionStorage.setItem(
            "ixvyn-active-system",
            activeSystem
        );

        /*
        If systems.html is being used as the
        direction/intro screen, reveal it cleanly.
        */

        document.body.classList.add("direction-ready");

    }

});
