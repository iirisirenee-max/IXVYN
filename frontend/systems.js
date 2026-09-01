document.addEventListener("DOMContentLoaded", () => {

    const panels = document.querySelectorAll(".module-panel");
    const overlay = document.querySelector(".system-overlay");
    const closeButton = document.querySelector(".overlay-close");

    const activeSystem = document.getElementById("active-system");
    const activeDescription =
        document.getElementById("active-description");

    if (!panels.length || !overlay) return;


    const systems = {

        lens: {
            title: "LENS",
            description:
                "Discover the gaps between what you know and what you need."
        },

        pathfinder: {
            title: "PATHFINDER",
            description:
                "Explore possible futures through experience, not prediction."
        },

        civic: {
            title: "CIVIC",
            description:
                "Transform complex public information into something people can act upon."
        },

        echo: {
            title: "ECHO",
            description:
                "Shape information around the person, not the other way around."
        },

        memory: {
            title: "MEMORY",
            description:
                "Understand what is fading before it disappears — and bring it back."
        }

    };


    /*
    =====================================================
    OPEN SYSTEM
    =====================================================
    */

    panels.forEach((panel) => {

        panel.addEventListener("click", () => {

            const systemName = panel.dataset.system;
            const system = systems[systemName];

            if (!system) return;


            activeSystem.textContent = system.title;
            activeDescription.textContent = system.description;


            // Tell the interface which system is active.
            document.body.dataset.activeSystem = systemName;


            /*
             * Instead of flashing the screen,
             * the interface changes state smoothly.
             */

            panel.classList.add("selected");


            panels.forEach((otherPanel) => {

                if (otherPanel !== panel) {
                    otherPanel.classList.add("dimmed");
                }

            });


            overlay.setAttribute("aria-hidden", "false");

            overlay.classList.add("active");


            // Prevent the page from moving underneath
            document.body.classList.add("system-locked");

        });

    });


    /*
    =====================================================
    CLOSE SYSTEM
    =====================================================
    */

    if (closeButton) {

        closeButton.addEventListener("click", closeSystem);

    }


    function closeSystem() {

        overlay.classList.remove("active");

        overlay.setAttribute("aria-hidden", "true");

        document.body.classList.remove("system-locked");

        delete document.body.dataset.activeSystem;


        panels.forEach((panel) => {

            panel.classList.remove("selected");
            panel.classList.remove("dimmed");

        });

    }


    /*
    =====================================================
    ESCAPE KEY
    =====================================================
    */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            closeSystem();

        }

    });


    /*
    =====================================================
    MOUSE / POINTER GEOMETRY
    =====================================================
    */

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("pointermove", (event) => {

        mouseX =
            (event.clientX / window.innerWidth - 0.5) * 2;

        mouseY =
            (event.clientY / window.innerHeight - 0.5) * 2;

        document.documentElement.style.setProperty(
            "--pointer-x",
            `${mouseX}`
        );

        document.documentElement.style.setProperty(
            "--pointer-y",
            `${mouseY}`
        );

    });


    /*
    =====================================================
    REDUCE MOTION SUPPORT
    =====================================================
    */

    const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {

        document.body.classList.add("reduced-motion");

    }

});
