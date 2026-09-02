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

           const module =
    card.dataset.module ||
    card.dataset.system;
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
            pathfinder: "pathfinder.html",
            civic: "civic.html",
            echo: "systems.html",
            memory: "memory.html"
        };

        const destination = routes[module];

        if (!destination) {
            return;
        }

       const handoff =
    document.createElement("div");

handoff.className =
    "ixvyn-handoff";

handoff.innerHTML = `
    <div class="handoff-grid"></div>

    <div class="handoff-core">
        <span class="handoff-ring ring-a"></span>
        <span class="handoff-ring ring-b"></span>
        <span class="handoff-point"></span>

        <div class="handoff-wordmark">
            IXVYN
        </div>
    </div>

    <div class="handoff-info">
        <span>IXVYN / SYSTEM TRANSFER</span>
        <strong>HANDING OFF</strong>
        <small>${module.toUpperCase()} / SYSTEM</small>
    </div>

    <div class="handoff-line"></div>
`;

document.body.appendChild(handoff);

requestAnimationFrame(() => {
    handoff.classList.add("active");
});

setTimeout(() => {
    window.location.href = destination;
}, 950);
    }


    /* =====================================================
       INITIATE SYSTEM BUTTON
    ===================================================== */

    const initiateButton =
        document.querySelector(".hero-button, .initiate");

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
        document.querySelector(".site-header, .system-header");

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
        ".direction, " +
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
       HERO — LIVING INFRASTRUCTURE NETWORK
       ===================================================== */

    const geometry =
        document.querySelector(".hero-geometry");

    const heroContent =
        document.querySelector(".hero-main, .hero-content");

    const hero =
        document.querySelector(".hero");

    const motionEnabled =
        window.matchMedia(
            "(prefers-reduced-motion: no-preference)"
        ).matches;


    if (geometry && motionEnabled) {

        /* -------------------------------------------------
           Preserve the existing CSS geometry.
           We enhance it rather than replacing it.
        ------------------------------------------------- */

        const nodes =
            geometry.querySelectorAll(".geometry-node");

        const rings =
            geometry.querySelectorAll(".geometry-ring");

        const lines =
            geometry.querySelectorAll(".geometry-line");

        const core =
            geometry.querySelector(".geometry-core");


        /* -------------------------------------------------
           NODE PULSES
           Infrastructure points occasionally wake up.
        ------------------------------------------------- */

        nodes.forEach((node, index) => {

            node.style.transition =
                "transform 0.8s cubic-bezier(.16,1,.3,1), " +
                "background 0.5s ease, " +
                "box-shadow 0.5s ease";


            const pulseNode = () => {

                node.classList.add("network-pulse");

                setTimeout(() => {
                    node.classList.remove("network-pulse");
                }, 900);


                const nextDelay =
                    1800 +
                    Math.random() * 4200 +
                    index * 500;

                setTimeout(
                    pulseNode,
                    nextDelay
                );

            };


            setTimeout(
                pulseNode,
                1200 + index * 850
            );

        });


        /* -------------------------------------------------
           SIGNAL PULSE
           A tiny light travels through the geometry.
        ------------------------------------------------- */

        const signal =
            document.createElement("span");

        signal.className =
            "hero-signal";

        geometry.appendChild(signal);


        let signalTimer = null;


        const launchSignal = () => {

            signal.classList.remove("traveling");

            /*
             * Force a reflow so the animation can restart.
             */
            void signal.offsetWidth;

            signal.classList.add("traveling");

            signalTimer =
                setTimeout(
                    launchSignal,
                    4200 + Math.random() * 3600
                );

        };


        setTimeout(
            launchSignal,
            2200
        );


        /* -------------------------------------------------
           MOUSE FIELD
           The network subtly responds to the viewer.
        ------------------------------------------------- */

        let mouseX = 0;
        let mouseY = 0;

        let targetX = 0;
        let targetY = 0;

        let currentX = 0;
        let currentY = 0;

        let frameRequested = false;


        const updateNetwork = () => {

            currentX +=
                (targetX - currentX) * 0.055;

            currentY +=
                (targetY - currentY) * 0.055;


            geometry.style.setProperty(
                "--network-x",
                `${currentX}px`
            );

            geometry.style.setProperty(
                "--network-y",
                `${currentY}px`
            );


            /*
             * Individual nodes drift a fraction of a pixel.
             * This keeps the geometry alive without making
             * it look like a dashboard animation.
             */

            nodes.forEach((node, index) => {

                const factor =
                    0.35 + index * 0.08;

                const nodeX =
                    currentX * factor;

                const nodeY =
                    currentY * factor;

                node.style.transform =
                    `translate3d(${nodeX}px, ${nodeY}px, 0)`;

            });


            frameRequested = false;

        };


        const requestNetworkUpdate = () => {

            if (frameRequested) {
                return;
            }

            frameRequested = true;

            requestAnimationFrame(
                updateNetwork
            );

        };


        document.addEventListener(
            "mousemove",
            (event) => {

                mouseX =
                    event.clientX /
                    window.innerWidth -
                    0.5;

                mouseY =
                    event.clientY /
                    window.innerHeight -
                    0.5;


                targetX =
                    mouseX * 22;

                targetY =
                    mouseY * 18;


                requestNetworkUpdate();

            }
        );


        /* -------------------------------------------------
           CORE RESPONSE
           The central IX responds slightly to movement.
        ------------------------------------------------- */

        if (core) {

            core.style.transition =
                "transform 0.8s cubic-bezier(.16,1,.3,1)";


            const updateCore = () => {

                const x =
                    currentX * 0.18;

                const y =
                    currentY * 0.18;

                core.style.transform =
                    `translate3d(${x}px, ${y}px, 0)`;

            };


            const coreLoop = () => {

                updateCore();

                requestAnimationFrame(
                    coreLoop
                );

            };


            coreLoop();

        }


        /* -------------------------------------------------
           RING BREATHING
           Very subtle scale variation.
        ------------------------------------------------- */

        rings.forEach((ring, index) => {

            const duration =
                9000 +
                index * 1800;

            ring.style.animationDuration =
                `${duration}ms`;

        });


        /* -------------------------------------------------
           HERO PARALLAX
        ------------------------------------------------- */

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

                    geometry.style.setProperty(
                        "--scroll-y",
                        `${movement}px`
                    );

                    geometry.style.transform =
                        `translate3d(0, ${movement}px, 0)`;


                    if (heroContent) {

                        heroContent.style.transform =
                            `translate3d(0, ${scrollY * 0.025}px, 0)`;

                    }


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
        motionEnabled
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
/* =====================================================
   IXVYN — SYSTEM INTELLIGENCE FLOWS
   ===================================================== */

const systemFlows = {
    lens: [
        "IMAGE",
        "EVIDENCE",
        "DEFECT",
        "SEVERITY",
        "LOCATION"
    ],

    pathfinder: [
        "CONDITION",
        "PRIORITY",
        "RISK",
        "ROUTE",
        "RESPONSE"
    ],

    civic: [
        "EVIDENCE",
        "REPORT",
        "MUNICIPAL",
        "ACTION",
        "STATUS"
    ],

    echo: [
        "FIELD",
        "VOICE",
        "FEEDBACK",
        "CONTEXT",
        "ADAPT"
    ],

    memory: [
        "OBSERVATION",
        "RECORD",
        "HISTORY",
        "CHANGE",
        "MEMORY"
    ]
};


document
    .querySelectorAll(".system-card")
    .forEach((card) => {

        const module =
            card.dataset.module ||
            card.dataset.system;

        const flow =
            systemFlows[module];

        if (!flow) {
            return;
        }


        /* Create the visual pathway */

        const flowElement =
            document.createElement("div");

        flowElement.className =
            "system-flow";


        flow.forEach((step, index) => {

            const stepElement =
                document.createElement("span");

            stepElement.className =
                "system-flow-step";

            stepElement.textContent =
                step;

            flowElement.appendChild(
                stepElement
            );


            if (index < flow.length - 1) {

                const arrow =
                    document.createElement("i");

                arrow.textContent = "→";

                arrow.className =
                    "system-flow-arrow";

                flowElement.appendChild(
                    arrow
                );

            }

        });


        card.appendChild(flowElement);


        /* Desktop interaction */

        card.addEventListener(
            "mouseenter",
            () => {

                flowElement.classList.add(
                    "flow-active"
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                flowElement.classList.remove(
                    "flow-active"
                );

            }
        );

    });
/* =====================================================
   IXVYN — CIVIC LOOP ACTIVATION
   SEE → UNDERSTAND → RESPOND → ADAPT → REMEMBER
   ===================================================== */

const directionSection =
    document.querySelector(".direction");

const directionTitle =
    directionSection?.querySelector(".direction-main h2");

if (directionSection && directionTitle) {

    const loopWords = [
        "SEE.",
        "UNDERSTAND.",
        "RESPOND.",
        "ADAPT.",
        "REMEMBER."
    ];


    /* Build the five stages */

    directionTitle.innerHTML = "";

    loopWords.forEach((word, index) => {

        const wordElement =
            document.createElement("span");

        wordElement.className =
            "loop-word";

        wordElement.textContent =
            word;

        wordElement.dataset.index =
            index;

        if (index === loopWords.length - 1) {
            wordElement.classList.add("loop-outline");
        }

        directionTitle.appendChild(
            wordElement
        );

    });


    const loopWordsElements =
        directionTitle.querySelectorAll(
            ".loop-word"
        );


    /* -----------------------------------------------
       Activate stages according to scroll position
       ----------------------------------------------- */

    const updateCivicLoop = () => {

        const rect =
            directionSection.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight;


        /*
         * The loop progresses while the section
         * moves through the viewport.
         */

        const start =
            viewportHeight * 0.78;

        const distance =
            Math.max(
                directionSection.offsetHeight -
                viewportHeight * 0.35,
                1
            );

        const progress =
            Math.max(
                0,
                Math.min(
                    1,
                    (start - rect.top) / distance
                )
            );


        const activeIndex =
            Math.min(
                loopWords.length - 1,
                Math.floor(
                    progress *
                    loopWords.length
                )
            );


        loopWordsElements.forEach(
            (wordElement, index) => {

                wordElement.classList.remove(
                    "loop-active",
                    "loop-past"
                );


                if (index < activeIndex) {

                    wordElement.classList.add(
                        "loop-past"
                    );

                }


                if (index === activeIndex) {

                    wordElement.classList.add(
                        "loop-active"
                    );

                }

            }
        );


        /* Complete the loop */

        if (activeIndex === loopWords.length - 1) {

            directionSection.classList.add(
                "loop-complete"
            );

        } else {

            directionSection.classList.remove(
                "loop-complete"
            );

        }

    };


    let loopTicking = false;


    const requestLoopUpdate = () => {

        if (loopTicking) {
            return;
        }

        loopTicking = true;

        requestAnimationFrame(() => {

            updateCivicLoop();

            loopTicking = false;

        });

    };


    window.addEventListener(
        "scroll",
        requestLoopUpdate,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        requestLoopUpdate
    );


    updateCivicLoop();

}
