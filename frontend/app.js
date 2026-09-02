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
            echo: "echo.html",
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
/* ============================================================
   IXVYN — PASS 02
   SPECTRAL INTELLIGENCE FIELD
   Lightweight canvas intelligence layer
   ============================================================ */

(() => {
    "use strict";

    const geometry = document.querySelector(".hero-geometry");
    if (!geometry) return;

    // Respect accessibility / reduced-motion preferences.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    /* ---------------------------------------------------------
       CANVAS
       --------------------------------------------------------- */

    const canvas = document.createElement("canvas");
    canvas.className = "ixvyn-intelligence-field";

    Object.assign(canvas.style, {
        position: "absolute",
        inset: "-8%",
        width: "116%",
        height: "116%",
        pointerEvents: "none",
        zIndex: "0"
    });

    geometry.insertBefore(canvas, geometry.firstChild);

    const ctx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: true
    });

    if (!ctx) return;

    /* ---------------------------------------------------------
       DEVICE / QUALITY
       --------------------------------------------------------- */

    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const cores = navigator.hardwareConcurrency || 4;

    let quality = cores <= 2 ? 0.62 : cores <= 4 ? 0.78 : 1;

    const mobile =
        window.matchMedia("(max-width: 700px)").matches;

    if (mobile) quality *= 0.72;

    const MAX_DPR = mobile ? 1.25 : 1.5;

    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    let width = 0;
    let height = 0;

    /* ---------------------------------------------------------
       PALETTE
       --------------------------------------------------------- */

    // Green remains the identity.
    const COLORS = {
        green: [184, 255, 61],

        // Spectral colours are deliberately restrained.
        cyan: [0, 210, 225],
        violet: [125, 90, 255],
        amber: [255, 174, 55],
        magenta: [230, 70, 190]
    };

    /* ---------------------------------------------------------
       STATE
       --------------------------------------------------------- */

    let particles = [];
    let animationFrame = 0;

    let running = true;
    let visible = true;

    let mouseX = 0.5;
    let mouseY = 0.5;

    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    let time = 0;

    let lastTime = performance.now();
    let fpsTime = lastTime;
    let fpsFrames = 0;

    let adaptiveReduction = 0;

    /* ---------------------------------------------------------
       HELPERS
       --------------------------------------------------------- */

    const random = (min, max) =>
        Math.random() * (max - min) + min;

    const lerp = (a, b, amount) =>
        a + (b - a) * amount;

    const clamp = (value, min, max) =>
        Math.max(min, Math.min(max, value));

    const distance = (x1, y1, x2, y2) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    };

    function colour(c, alpha) {
        return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;
    }

    /* ---------------------------------------------------------
       RESIZE
       --------------------------------------------------------- */

    function resize() {
        const rect = geometry.getBoundingClientRect();

        width = rect.width;
        height = rect.height;

        dpr = Math.min(
            window.devicePixelRatio || 1,
            MAX_DPR
        );

        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        createParticles();
    }

    /* ---------------------------------------------------------
       PARTICLES
       --------------------------------------------------------- */

    function particleCount() {
        const base = mobile ? 34 : 78;

        return Math.max(
            22,
            Math.floor(
                base * quality * (1 - adaptiveReduction)
            )
        );
    }

    function createParticles() {
        particles = [];

        const count = particleCount();

        for (let i = 0; i < count; i++) {
            const angle = random(0, Math.PI * 2);
            const radius = Math.pow(
                Math.random(),
                0.65
            ) * 0.46;

            const x =
                0.5 +
                Math.cos(angle) * radius;

            const y =
                0.5 +
                Math.sin(angle) * radius;

            particles.push({
                x: x * width,
                y: y * height,

                px: x * width,
                py: y * height,

                vx: random(-0.07, 0.07),
                vy: random(-0.07, 0.07),

                size: random(0.45, 1.35),

                // Mostly green / neutral.
                spectral:
                    Math.random() < 0.17
                        ? random(0, 1)
                        : 0,

                phase: random(0, Math.PI * 2),

                life: random(0, 100)
            });
        }
    }

    /* ---------------------------------------------------------
       POINTER FIELD
       --------------------------------------------------------- */

    if (finePointer) {
        window.addEventListener(
            "pointermove",
            event => {
                targetMouseX =
                    event.clientX /
                    Math.max(window.innerWidth, 1);

                targetMouseY =
                    event.clientY /
                    Math.max(window.innerHeight, 1);
            },
            { passive: true }
        );
    }

    /* ---------------------------------------------------------
       PARTICLE COLOUR
       --------------------------------------------------------- */

    function particleColour(p, alpha) {
        const pulse =
            0.5 +
            0.5 *
                Math.sin(
                    time * 0.00055 +
                    p.phase
                );

        // Most particles remain green/neutral.
        if (p.spectral < 0.12) {
            return colour(
                COLORS.green,
                alpha
            );
        }

        // Slow spectral drift.
        const spectral =
            (p.spectral + pulse * 0.18) % 1;

        if (spectral < 0.25) {
            return colour(
                COLORS.cyan,
                alpha * 0.68
            );
        }

        if (spectral < 0.5) {
            return colour(
                COLORS.violet,
                alpha * 0.58
            );
        }

        if (spectral < 0.75) {
            return colour(
                COLORS.magenta,
                alpha * 0.42
            );
        }

        return colour(
            COLORS.amber,
            alpha * 0.48
        );
    }

    /* ---------------------------------------------------------
       UPDATE
       --------------------------------------------------------- */

    function update(delta) {
        const dt =
            Math.min(delta, 32) / 16.67;

        time += delta;

        mouseX = lerp(
            mouseX,
            targetMouseX,
            0.045
        );

        mouseY = lerp(
            mouseY,
            targetMouseY,
            0.045
        );

        const coreX = width * 0.5;
        const coreY = height * 0.5;

        const pointerX =
            mouseX * width;

        const pointerY =
            mouseY * height;

        for (const p of particles) {
            p.life += delta * 0.001;

            // Very weak gravitational relationship
            // with the central intelligence core.
            const dx = coreX - p.x;
            const dy = coreY - p.y;

            const dist =
                Math.sqrt(dx * dx + dy * dy) || 1;

            const coreForce =
                clamp(
                    0.00055 *
                        (1 - dist / (width * 0.7)),
                    -0.00015,
                    0.00055
                );

            p.vx +=
                (dx / dist) *
                coreForce *
                dt;

            p.vy +=
                (dy / dist) *
                coreForce *
                dt;

            // Cursor creates a subtle gravitational distortion.
            if (finePointer) {
                const mdx = pointerX - p.x;
                const mdy = pointerY - p.y;

                const md =
                    Math.sqrt(
                        mdx * mdx +
                        mdy * mdy
                    ) || 1;

                const influence =
                    clamp(
                        1 -
                            md /
                                (Math.min(
                                    width,
                                    height
                                ) * 0.42),
                        0,
                        1
                    );

                p.vx +=
                    (mdx / md) *
                    influence *
                    0.008 *
                    dt;

                p.vy +=
                    (mdy / md) *
                    influence *
                    0.008 *
                    dt;
            }

            // Organic drift.
            p.vx +=
                Math.sin(
                    time * 0.00035 +
                    p.phase
                ) *
                0.0008 *
                dt;

            p.vy +=
                Math.cos(
                    time * 0.00031 +
                    p.phase
                ) *
                0.0008 *
                dt;

            // Damping keeps the system calm.
            p.vx *= 0.992;
            p.vy *= 0.992;

            p.px = p.x;
            p.py = p.y;

            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Soft containment.
            const margin = Math.min(
                width,
                height
            ) * 0.06;

            if (p.x < margin) {
                p.vx += 0.006;
            }

            if (p.x > width - margin) {
                p.vx -= 0.006;
            }

            if (p.y < margin) {
                p.vy += 0.006;
            }

            if (p.y > height - margin) {
                p.vy -= 0.006;
            }

            // Extremely slow spectral activation.
            if (
                Math.random() <
                0.0007 * dt
            ) {
                p.spectral =
                    Math.random() < 0.72
                        ? random(0.12, 1)
                        : 0;
            }
        }
    }

    /* ---------------------------------------------------------
       DRAW
       --------------------------------------------------------- */

    function draw() {
        // Soft persistence creates restrained trails.
        ctx.fillStyle =
            "rgba(5, 5, 6, 0.12)";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        const maxConnection =
            Math.min(width, height) *
            (mobile ? 0.115 : 0.14);

        /* -----------------------------------------------------
           CONNECTIONS
           ----------------------------------------------------- */

        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];

            for (
                let j = i + 1;
                j < particles.length;
                j++
            ) {
                const b = particles[j];

                const dx = b.x - a.x;
                const dy = b.y - a.y;

                const dist =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                if (dist > maxConnection)
                    continue;

                const alpha =
                    (1 -
                        dist /
                            maxConnection) *
                    0.095;

                ctx.beginPath();

                // Mostly monochrome connections.
                // Spectral colour appears only occasionally.
                if (
                    a.spectral > 0.65 &&
                    b.spectral > 0.45
                ) {
                    ctx.strokeStyle =
                        particleColour(
                            a,
                            alpha
                        );
                } else {
                    ctx.strokeStyle =
                        `rgba(184,255,61,${alpha})`;
                }

                ctx.lineWidth = 0.55;

                ctx.moveTo(
                    a.x,
                    a.y
                );

                ctx.lineTo(
                    b.x,
                    b.y
                );

                ctx.stroke();
            }
        }

        /* -----------------------------------------------------
           PARTICLES
           ----------------------------------------------------- */

        for (const p of particles) {
            const pulse =
                0.72 +
                Math.sin(
                    time * 0.001 +
                    p.phase
                ) *
                    0.18;

            ctx.beginPath();

            ctx.fillStyle =
                particleColour(
                    p,
                    0.26 * pulse
                );

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

            // Occasional spectral micro-trail.
            if (
                p.spectral > 0.72 &&
                p.size > 0.8
            ) {
                ctx.beginPath();

                ctx.strokeStyle =
                    particleColour(
                        p,
                        0.10
                    );

                ctx.lineWidth = 0.45;

                ctx.moveTo(
                    p.px,
                    p.py
                );

                ctx.lineTo(
                    p.x,
                    p.y
                );

                ctx.stroke();
            }
        }

        /* -----------------------------------------------------
           CENTRAL FIELD
           ----------------------------------------------------- */

        const corePulse =
            0.5 +
            Math.sin(
                time * 0.0012
            ) *
                0.5;

        const radius =
            Math.min(width, height) *
            (0.075 +
                corePulse * 0.008);

        const gradient =
            ctx.createRadialGradient(
                width * 0.5,
                height * 0.5,
                0,
                width * 0.5,
                height * 0.5,
                radius
            );

        gradient.addColorStop(
            0,
            colour(
                COLORS.green,
                0.075
            )
        );

        gradient.addColorStop(
            0.45,
            colour(
                COLORS.cyan,
                0.018
            )
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
            width * 0.5,
            height * 0.5,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    /* ---------------------------------------------------------
       ANIMATION LOOP
       --------------------------------------------------------- */

    function frame(now) {
        if (!running) return;

        animationFrame =
            requestAnimationFrame(frame);

        if (!visible) return;

        const delta =
            now - lastTime;

        lastTime = now;

        update(delta);
        draw();

        /* -----------------------------------------------------
           ADAPTIVE PERFORMANCE
           ----------------------------------------------------- */

        fpsFrames++;

        if (now - fpsTime > 1000) {
            const fps =
                fpsFrames /
                ((now - fpsTime) / 1000);

            fpsFrames = 0;
            fpsTime = now;

            if (fps < 46) {
                adaptiveReduction =
                    clamp(
                        adaptiveReduction + 0.18,
                        0,
                        0.65
                    );

                createParticles();
            }
        }
    }

    /* ---------------------------------------------------------
       VISIBILITY
       --------------------------------------------------------- */

    const observer =
        new IntersectionObserver(
            entries => {
                visible =
                    entries[0]?.isIntersecting ??
                    true;
            },
            {
                threshold: 0.05
            }
        );

    observer.observe(geometry);

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.hidden
            ) {
                visible = false;
            } else {
                visible = true;
                lastTime =
                    performance.now();
            }
        }
    );

    /* ---------------------------------------------------------
       RESIZE
       --------------------------------------------------------- */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(
                resize,
                180
            );
        },
        { passive: true }
    );

    /* ---------------------------------------------------------
       START
       --------------------------------------------------------- */

    resize();

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    animationFrame =
        requestAnimationFrame(frame);

})();
/* ============================================================
   IXVYN — PASS 03
   HERO SYSTEM COUPLING
   Cursor → Network → Node → Signal → Core
   ============================================================ */

(() => {
    "use strict";

    const geometry =
        document.querySelector(".hero-geometry");

    if (!geometry) return;

    const nodes =
        [...geometry.querySelectorAll(".geometry-node")];

    const core =
        geometry.querySelector(".geometry-core");

    if (!nodes.length || !core) return;

    const finePointer =
        window.matchMedia("(pointer: fine)").matches;

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (!finePointer || reducedMotion) return;

    /* ---------------------------------------------------------
       STATE
       --------------------------------------------------------- */

    let pointerX = 0;
    let pointerY = 0;

    let targetX = 0;
    let targetY = 0;

    let activeNode = null;
    let lastActivation = 0;

    let raf = null;

    /* ---------------------------------------------------------
       POINTER
       --------------------------------------------------------- */

    window.addEventListener(
        "pointermove",
        event => {

            const rect =
                geometry.getBoundingClientRect();

            targetX =
                event.clientX -
                (rect.left + rect.width / 2);

            targetY =
                event.clientY -
                (rect.top + rect.height / 2);
        },
        { passive: true }
    );

    /* ---------------------------------------------------------
       NODE POSITIONS
       --------------------------------------------------------- */

    function getNodeCenter(node) {

        const rect =
            node.getBoundingClientRect();

        const geometryRect =
            geometry.getBoundingClientRect();

        return {
            x:
                rect.left -
                geometryRect.left +
                rect.width / 2,

            y:
                rect.top -
                geometryRect.top +
                rect.height / 2
        };
    }

    /* ---------------------------------------------------------
       FIND THE NEAREST NODE
       --------------------------------------------------------- */

    function findNearestNode() {

        const geometryRect =
            geometry.getBoundingClientRect();

        const localX =
            targetX +
            geometryRect.width / 2;

        const localY =
            targetY +
            geometryRect.height / 2;

        let nearest = null;
        let nearestDistance = Infinity;

        nodes.forEach(node => {

            const point =
                getNodeCenter(node);

            const dx =
                point.x - localX;

            const dy =
                point.y - localY;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                distance < nearestDistance &&
                distance <
                    Math.min(
                        geometryRect.width,
                        geometryRect.height
                    ) * 0.23
            ) {
                nearest = node;
                nearestDistance = distance;
            }
        });

        return nearest;
    }

    /* ---------------------------------------------------------
       NODE ACTIVATION
       --------------------------------------------------------- */

    function activateNode(node) {

        if (!node) return;

        const now =
            performance.now();

        // Prevent frantic repeated activation.
        if (
            node === activeNode &&
            now - lastActivation < 900
        ) {
            return;
        }

        activeNode = node;
        lastActivation = now;

        node.classList.add(
            "network-intelligence"
        );

        setTimeout(() => {

            node.classList.remove(
                "network-intelligence"
            );

        }, 1100);

        /*
         * Give the central core a tiny response.
         */

        core.classList.add(
            "core-response"
        );

        setTimeout(() => {

            core.classList.remove(
                "core-response"
            );

        }, 700);
    }

    /* ---------------------------------------------------------
       CORE RESPONSE
       --------------------------------------------------------- */

    function updateCoreResponse() {

        const distanceFromCenter =
            Math.sqrt(
                pointerX * pointerX +
                pointerY * pointerY
            );

        const maxDistance =
            Math.min(
                geometry.clientWidth,
                geometry.clientHeight
            ) * 0.55;

        const influence =
            Math.max(
                0,
                1 -
                    distanceFromCenter /
                        maxDistance
            );

        /*
         * The closer the cursor gets to the core,
         * the more the core subtly responds.
         */

        const scale =
            1 +
            influence * 0.025;

        core.style.setProperty(
            "--core-interaction",
            scale
        );
    }

    /* ---------------------------------------------------------
       MAIN LOOP
       --------------------------------------------------------- */

    function update() {

        pointerX +=
            (targetX - pointerX) *
            0.075;

        pointerY +=
            (targetY - pointerY) *
            0.075;

        updateCoreResponse();

        const nearest =
            findNearestNode();

        if (nearest) {
            activateNode(nearest);
        }

        raf =
            requestAnimationFrame(
                update
            );
    }

    /* ---------------------------------------------------------
       RESET WHEN POINTER LEAVES WINDOW
       --------------------------------------------------------- */

    window.addEventListener(
        "pointerleave",
        () => {

            targetX = 0;
            targetY = 0;

        }
    );

    /* ---------------------------------------------------------
       START
       --------------------------------------------------------- */

    raf =
        requestAnimationFrame(
            update
        );

})();
/* ============================================================
   IXVYN — PASS 04 FIX
   MOBILE TOUCH RESPONSE
   ============================================================ */

(() => {
    "use strict";

    if (
        !window.matchMedia("(max-width: 700px)").matches
    ) return;

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) return;

    const geometry =
        document.querySelector(".hero-geometry");

    const core =
        geometry?.querySelector(".geometry-core");

    const nodes =
        geometry
            ? [...geometry.querySelectorAll(".geometry-node")]
            : [];

    if (!geometry || !core || !nodes.length) return;

    let touchActive = false;

    let touchX = 0;
    let touchY = 0;

    let targetX = 0;
    let targetY = 0;

    let lastNode = null;
    let lastNodeTime = 0;

    /* ---------------------------------------------------------
       TOUCH START
       --------------------------------------------------------- */

    document.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.touches[0];

            if (!touch) return;

            touchActive = true;

            targetX = touch.clientX;
            targetY = touch.clientY;

        },
        { passive: true }
    );

    /* ---------------------------------------------------------
       TOUCH MOVE
       --------------------------------------------------------- */

    document.addEventListener(
        "touchmove",
        event => {

            const touch =
                event.touches[0];

            if (!touch) return;

            targetX = touch.clientX;
            targetY = touch.clientY;

        },
        { passive: true }
    );

    /* ---------------------------------------------------------
       TOUCH END
       --------------------------------------------------------- */

    document.addEventListener(
        "touchend",
        () => {

            touchActive = false;

            core.style.setProperty(
                "--touch-scale",
                "1"
            );

        },
        { passive: true }
    );

    /* ---------------------------------------------------------
       FIND NODE UNDER / NEAR FINGER
       --------------------------------------------------------- */

    function checkNodes() {

        if (!touchActive) return;

        const rect =
            geometry.getBoundingClientRect();

        /*
         * Ignore touches that are nowhere near
         * the visual system.
         */

        const inside =
            targetX >= rect.left - 80 &&
            targetX <= rect.right + 80 &&
            targetY >= rect.top - 80 &&
            targetY <= rect.bottom + 80;

        if (!inside) return;

        let closest = null;
        let closestDistance = Infinity;

        nodes.forEach(node => {

            const nodeRect =
                node.getBoundingClientRect();

            const x =
                nodeRect.left +
                nodeRect.width / 2;

            const y =
                nodeRect.top +
                nodeRect.height / 2;

            const dx =
                targetX - x;

            const dy =
                targetY - y;

            const d =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                d < closestDistance
            ) {
                closestDistance = d;
                closest = node;
            }

        });

        /*
         * Wake a node when the finger comes
         * within a reasonable radius.
         */

        if (
            closest &&
            closestDistance < 95
        ) {

            const now =
                performance.now();

            if (
                closest !== lastNode ||
                now - lastNodeTime > 500
            ) {

                lastNode =
                    closest;

                lastNodeTime =
                    now;

                closest.classList.add(
                    "touch-awake"
                );

                setTimeout(
                    () => {
                        closest.classList.remove(
                            "touch-awake"
                        );
                    },
                    500
                );
            }
        }

        /* -----------------------------------------------------
           CORE PROXIMITY
           ----------------------------------------------------- */

        const cx =
            rect.left +
            rect.width / 2;

        const cy =
            rect.top +
            rect.height / 2;

        const dx =
            targetX - cx;

        const dy =
            targetY - cy;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        const influence =
            Math.max(
                0,
                1 -
                    distance /
                        (rect.width * .55)
            );

        core.style.setProperty(
            "--touch-scale",
            1 +
                influence * .045
        );

        /*
         * Store the touch position so the canvas
         * can eventually respond to it too.
         */

        geometry.style.setProperty(
            "--touch-x",
            `${targetX - rect.left}px`
        );

        geometry.style.setProperty(
            "--touch-y",
            `${targetY - rect.top}px`
        );
    }

    /* ---------------------------------------------------------
       LOW-COST LOOP
       --------------------------------------------------------- */

    function loop() {

        checkNodes();

        requestAnimationFrame(loop);

    }

    requestAnimationFrame(loop);

})();
