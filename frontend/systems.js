/* =========================================================
   IXVYN — SYSTEMS INTERACTION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const panels =
        document.querySelectorAll(".module-panel");

    const overlay =
        document.querySelector(".system-overlay");

    const overlayTitle =
        document.querySelector(".overlay-title");

    const overlayDescription =
        document.querySelector(".overlay-description");

    const closeButton =
        document.querySelector(".overlay-close");


    /* =====================================================
       SYSTEM DATA
    ===================================================== */

    const systems = {

        lens: {
            title: "LENS",
            description:
                "Discover the gaps between what you know and what you need.",
            shape: "circle"
        },

        pathfinder: {
            title: "PATHFINDER",
            description:
                "Explore possible futures through experience, not prediction.",
            shape: "diamond"
        },

        civic: {
            title: "CIVIC",
            description:
                "Transform complex public information into something people can act upon.",
            shape: "diamond"
        },

        echo: {
            title: "ECHO",
            description:
                "Shape information around the person, not the other way around.",
            shape: "circle"
        },

        memory: {
            title: "MEMORY",
            description:
                "Understand what is fading before it disappears — and bring it back.",
            shape: "circle"
        }

    };


    /* =====================================================
       OPEN SYSTEM
    ===================================================== */

    function openSystem(systemName) {

        const system =
            systems[systemName];

        if (!system) return;


        /* Update content */

        overlayTitle.textContent =
            system.title;

        overlayDescription.textContent =
            system.description;


        /* Remove old system classes */

        overlay.classList.remove(
            "system-lens",
            "system-pathfinder",
            "system-civic",
            "system-echo",
            "system-memory",
            "shape-circle",
            "shape-diamond"
        );


        /* Add current system classes */

        overlay.classList.add(
            `system-${systemName}`,
            `shape-${system.shape}`
        );


        /* Activate overlay */

        overlay.classList.add(
            "is-active"
        );

        overlay.setAttribute(
            "aria-hidden",
            "false"
        );


        /* Lock page */

        document.body.style.overflow =
            "hidden";


        /* Focus return button */

        setTimeout(() => {

            closeButton.focus();

        }, 500);
    }


    /* =====================================================
       CLOSE SYSTEM
    ===================================================== */

    function closeSystem() {

        overlay.classList.remove(
            "is-active"
        );

        overlay.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";


        /* Return focus to first panel if possible */

        if (document.activeElement === closeButton) {

            const activePanel =
                document.querySelector(
                    ".module-panel.is-opening"
                );

            if (activePanel) {
                activePanel.focus();
            }
        }
    }


    /* =====================================================
       PANEL INTERACTION
    ===================================================== */

    panels.forEach((panel) => {

        panel.addEventListener(
            "click",
            () => {

                const systemName =
                    panel.dataset.system;

                if (!systemName) return;


                /* Small physical click response */

                panel.classList.add(
                    "is-opening"
                );


                setTimeout(() => {

                    panel.classList.remove(
                        "is-opening"
                    );

                    openSystem(
                        systemName
                    );

                }, 180);

            }
        );


        /* =================================================
           POINTER TILT
        ================================================= */

        panel.addEventListener(
            "pointermove",
            (event) => {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }


                const rect =
                    panel.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;


                const rotateX =
                    ((y / rect.height) - .5) *
                    -1.2;

                const rotateY =
                    ((x / rect.width) - .5) *
                    1.2;


                panel.style.transform =
                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-3px)`;
            }
        );


        panel.addEventListener(
            "pointerleave",
            () => {

                panel.style.transform =
                    "";
            }
        );

    });


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    closeButton.addEventListener(
        "click",
        closeSystem
    );


    /* =====================================================
       CLICK OUTSIDE CONTENT
    ===================================================== */

    overlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target === overlay
            ) {
                closeSystem();
            }

        }
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                overlay.classList.contains(
                    "is-active"
                )
            ) {
                closeSystem();
            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

});
