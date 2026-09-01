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
       SAFETY CHECK
    ===================================================== */

    if (
        !overlay ||
        !overlayTitle ||
        !overlayDescription ||
        !closeButton
    ) {
        console.warn(
            "IXVYN: Systems interface could not initialize."
        );

        return;
    }


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
       STATE
    ===================================================== */

    let activeSystem = null;


    /* =====================================================
       OPEN SYSTEM
    ===================================================== */

    function openSystem(systemName) {

        const system =
            systems[systemName];

        if (!system) return;

        activeSystem =
            systemName;


        overlayTitle.textContent =
            system.title;

        overlayDescription.textContent =
            system.description;


        overlay.classList.remove(

            "system-lens",
            "system-pathfinder",
            "system-civic",
            "system-echo",
            "system-memory",
            "shape-circle",
            "shape-diamond"

        );


        overlay.classList.add(
            `system-${systemName}`
        );

        overlay.classList.add(
            `shape-${system.shape}`
        );


        overlay.classList.remove(
            "is-active"
        );


        void overlay.offsetWidth;


        overlay.classList.add(
            "is-active"
        );

        overlay.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        setTimeout(() => {

            if (
                overlay.classList.contains(
                    "is-active"
                )
            ) {

                closeButton.focus();

            }

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

        activeSystem =
            null;

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


                if (!systemName) {
                    return;
                }


                /* =========================================
                   LENS → REAL LENS EXPERIENCE
                   ========================================= */

                if (systemName === "lens") {

                    window.location.href =
                        "lens.html";

                    return;
                }


                /* =========================================
                   PREVENT DOUBLE ACTIVATION
                   ========================================= */

                if (
                    overlay.classList.contains(
                        "is-active"
                    )
                ) {
                    return;
                }


                /* =========================================
                   SMALL CLICK RESPONSE
                   ========================================= */

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


                if (
                    overlay.classList.contains(
                        "is-active"
                    )
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
                    ((y / rect.height) - 0.5)
                    * -1.2;

                const rotateY =
                    ((x / rect.width) - 0.5)
                    * 1.2;


                panel.style.transform =
                    `perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-3px)`;

            }
        );


        /* =================================================
           POINTER LEAVE
        ================================================= */

        panel.addEventListener(
            "pointerleave",
            () => {

                panel.style.transform =
                    "";

            }
        );

    });


    /* =====================================================
       RETURN BUTTON
    ===================================================== */

    closeButton.addEventListener(
        "click",
        () => {

            closeSystem();

        }
    );


    /* =====================================================
       CLICK OUTSIDE
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

    document.body.style.overflow =
        "";


    console.log(
        "IXVYN systems interface online."
    );

});
