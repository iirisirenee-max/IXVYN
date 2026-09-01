/* =========================================================
   IXVYN — HOMEPAGE APP
   CIVIC INTELLIGENCE INTERFACE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SYSTEM CARDS
    ===================================================== */

    const systemCards = document.querySelectorAll(".system-card");

    systemCards.forEach((card) => {

        card.addEventListener("mouseenter", () => {
            systemCards.forEach((otherCard) => {
                if (otherCard !== card) {
                    otherCard.classList.add("dimmed");
                }
            });

            card.classList.add("active");
        });

        card.addEventListener("mouseleave", () => {
            systemCards.forEach((otherCard) => {
                otherCard.classList.remove("dimmed");
                otherCard.classList.remove("active");
            });
        });

        card.addEventListener("click", () => {

            const module = card.dataset.module;

            if (!module) {
                return;
            }

            navigateToSystem(module);
        });

    });


    /* =====================================================
       SYSTEM NAVIGATION
    ===================================================== */

    function navigateToSystem(module) {

        const routes = {
            lens: "lens.html",
            pathfinder: "systems.html",
            civic: "systems.html",
            echo: "systems.html",
            memory: "memory.html"
        };

        const destination = routes[module];

        if (!destination) {
            return;
        }

        document.body.classList.add("page-exit");

        setTimeout(() => {
            window.location.href = destination;
        }, 420);
    }


    /* =====================================================
       INITIATE SYSTEM BUTTON
    ===================================================== */

    const initiateButton =
        document.querySelector(".hero-button");

    if (initiateButton) {

        initiateButton.addEventListener("click", (event) => {

            event.preventDefault();

            const systems =
                document.getElementById("systems");

            if (!systems) {
                return;
            }

            systems.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    /* =====================================================
       DIRECTION / BEGIN BUTTON
    ===================================================== */

    const beginButton =
        document.getElementById("begin-button");

    if (beginButton) {

        beginButton.addEventListener("click", () => {

            const systems =
                document.getElementById("systems");

            if (!systems) {
                return;
            }

            systems.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    /* =====================================================
       HEADER SCROLL STATE
    ===================================================== */

    const header =
        document.querySelector(".site-header");

    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        };

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

        updateHeader();

    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".section-intro, " +
        ".system-card, " +
        ".direction-page, " +
        ".about, " +
        ".system-footer"
    );

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -8% 0px"
                }
            );

        revealElements.forEach((element) => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    }


    /* =====================================================
       HERO PARALLAX
    ===================================================== */

    const geometry =
        document.querySelector(".hero-geometry");

    const heroContent =
        document.querySelector(".hero-content");

    if (
        geometry &&
        heroContent &&
        window.matchMedia(
            "(prefers-reduced-motion: no-preference)"
        ).matches
    ) {

        let ticking = false;

        window.addEventListener(
            "scroll",
            () => {

                if (ticking) {
                    return;
                }

                window.requestAnimationFrame(() => {

                    const scrollY =
                        window.scrollY;

                    const movement =
                        Math.min(
                            scrollY * 0.08,
                            45
                        );

                    geometry.style.transform =
                        `translate3d(0, ${movement}px, 0)`;

                    heroContent.style.transform =
                        `translate3d(0, ${scrollY * 0.025}px, 0)`;

                    ticking = false;

                });

                ticking = true;

            },
            { passive: true }
        );

    }


    /* =====================================================
       CURSOR GEOMETRY
    ===================================================== */

    const cursor =
        document.createElement("div");

    cursor.className =
        "ixvyn-cursor";

    document.body.appendChild(cursor);


    if (
        window.matchMedia(
            "(pointer: fine)"
        ).matches &&
        window.matchMedia(
            "(prefers-reduced-motion: no-preference)"
        ).matches
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener(
            "mousemove",
            (event) => {

                mouseX = event.clientX;
                mouseY = event.clientY;

                cursor.classList.add("visible");

            }
        );


        const animateCursor = () => {

            cursorX +=
                (mouseX - cursorX) * 0.14;

            cursorY +=
                (mouseY - cursorY) * 0.14;

            cursor.style.transform =
                `translate3d(${cursorX}px, ${cursorY}px, 0)`;

            requestAnimationFrame(
                animateCursor
            );

        };

        animateCursor();


        const interactiveElements =
            document.querySelectorAll(
                "a, button, .system-card"
            );

        interactiveElements.forEach(
            (element) => {

                element.addEventListener(
                    "mouseenter",
                    () => {
                        cursor.classList.add(
                            "expanded"
                        );
                    }
                );

                element.addEventListener(
                    "mouseleave",
                    () => {
                        cursor.classList.remove(
                            "expanded"
                        );
                    }
                );

            }
        );

    }


    /* =====================================================
       ACTIVE SYSTEM INDICATOR
    ===================================================== */

    const statusDot =
        document.querySelector(".status-dot");

    if (statusDot) {

        setInterval(() => {

            statusDot.classList.toggle(
                "pulse"
            );

        }, 1800);

    }


    /* =====================================================
       KEYBOARD NAVIGATION
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                document.body.classList.remove(
                    "page-exit"
                );

            }

        }
    );


    /* =====================================================
       PAGE ENTRY
    ===================================================== */

    requestAnimationFrame(() => {

        document.body.classList.add(
            "page-ready"
        );

    });

});
