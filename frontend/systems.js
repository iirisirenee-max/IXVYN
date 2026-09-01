document.addEventListener("DOMContentLoaded", () => {

    const panels = document.querySelectorAll(".module-panel");
    const overlay = document.querySelector(".system-overlay");
    const closeButton = document.querySelector(".overlay-close");

    const activeSystem = document.getElementById("active-system");
    const activeDescription = document.getElementById("active-description");

    if (!panels.length || !overlay) {
        console.error("IXVYN: Systems interface not found.");
        return;
    }


    /* =====================================================
       IXVYN SYSTEM DATA
    ===================================================== */

    const systems = {

        lens: {
            title: "LENS",
            category: "DIAGNOSTIC",
            description:
                "Discover the gaps between what you know and what you need.",
            animation: "system-lens"
        },

        pathfinder: {
            title: "PATHFINDER",
            category: "EXPLORATION",
            description:
                "Explore possible futures through experience, not prediction.",
            animation: "system-pathfinder"
        },

        civic: {
            title: "CIVIC",
            category: "DECODING",
            description:
                "Transform complex public information into something people can act upon.",
            animation: "system-civic"
        },

        echo: {
            title: "ECHO",
            category: "ADAPTATION",
            description:
                "Shape information around the person, not the other way around.",
            animation: "system-echo"
        },

        memory: {
            title: "MEMORY",
            category: "RETENTION",
            description:
                "Understand what is fading before it disappears — and bring it back.",
            animation: "system-memory"
        }

    };


    /* =====================================================
       OPEN SYSTEM
    ===================================================== */

    function openSystem(key) {

        const system = systems[key];

        if (!system) {
            console.error(`IXVYN: Unknown system "${key}".`);
            return;
        }

        /* Remove any previous animation state */

        Object.values(systems).forEach(item => {
            overlay.classList.remove(item.animation);
        });

        overlay.classList.remove("is-active");

        /* Update content */

        activeSystem.textContent = system.title;
        activeDescription.textContent = system.description;

        overlay.setAttribute("aria-hidden", "false");

        /*
         * Force a browser frame between removing and
         * adding animation classes.
         */
        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                overlay.classList.add("is-active");
                overlay.classList.add(system.animation);

            });

        });

        document.body.classList.add("system-is-open");

    }


    /* =====================================================
       CLOSE SYSTEM
    ===================================================== */

    function closeSystem() {

        overlay.classList.remove("is-active");

        Object.values(systems).forEach(item => {
            overlay.classList.remove(item.animation);
        });

        overlay.setAttribute("aria-hidden", "true");

        document.body.classList.remove("system-is-open");

    }


    /* =====================================================
       PANEL INTERACTION
    ===================================================== */

    panels.forEach(panel => {

        panel.addEventListener("click", () => {

            const key = panel.dataset.system;

            if (!key || !systems[key]) {
                console.error("IXVYN: Missing system data.");
                return;
            }

            /*
             * Small response on the selected card before
             * the full system experience opens.
             */

            panels.forEach(item => {
                item.classList.remove("is-selected");
            });

            panel.classList.add("is-selected");

            openSystem(key);

        });

    });


    /* =====================================================
       RETURN
    ===================================================== */

    if (closeButton) {

        closeButton.addEventListener("click", () => {

            closeSystem();

            panels.forEach(panel => {
                panel.classList.remove("is-selected");
            });

        });

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (overlay.classList.contains("is-active")) {
                closeSystem();

                panels.forEach(panel => {
                    panel.classList.remove("is-selected");
                });
            }

        }

    });


    /* =====================================================
       POINTER GEOMETRY
       Subtle movement only.
    ===================================================== */

    panels.forEach(panel => {

        panel.addEventListener("pointermove", event => {

            if (
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            ) {
                return;
            }

            const rect = panel.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateX =
                ((y / rect.height) - 0.5) * -1.5;

            const rotateY =
                ((x / rect.width) - 0.5) * 1.5;

            panel.style.setProperty("--mx", `${x}px`);
            panel.style.setProperty("--my", `${y}px`);

            panel.style.transform =
                `perspective(1200px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)`;

        });


        panel.addEventListener("pointerleave", () => {

            panel.style.transform = "";

        });

    });


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    overlay.setAttribute("aria-hidden", "true");

    console.log("IXVYN systems interface online.");

});
