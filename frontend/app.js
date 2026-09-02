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
   IXVYN — PASS 04.1
   TOUCH-DRIVEN INTELLIGENCE FIELD
   Finger → Field → Core
   ============================================================ */

(() => {
    "use strict";

    const mobile =
        window.matchMedia("(max-width: 700px)");

    if (!mobile.matches) return;

    const geometry =
        document.querySelector(".hero-geometry");

    if (!geometry) return;

    const canvas =
        geometry.querySelector(
            ".ixvyn-intelligence-field"
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    if (!ctx) return;

    /* ---------------------------------------------------------
       TOUCH STATE
       --------------------------------------------------------- */

    let touchActive = false;

    let touchX = 0;
    let touchY = 0;

    let targetX = 0;
    let targetY = 0;

    let touchStrength = 0;

    /* ---------------------------------------------------------
       FIND CANVAS SIZE
       --------------------------------------------------------- */

    function canvasPoint(touch) {

        const rect =
            canvas.getBoundingClientRect();

        return {
            x:
                (touch.clientX - rect.left) *
                (canvas.width / rect.width),

            y:
                (touch.clientY - rect.top) *
                (canvas.height / rect.height)
        };
    }

    /* ---------------------------------------------------------
       TOUCH START
       --------------------------------------------------------- */

    document.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.touches[0];

            if (!touch) return;

            const point =
                canvasPoint(touch);

            targetX = point.x;
            targetY = point.y;

            touchX = targetX;
            touchY = targetY;

            touchStrength = 1;

            touchActive = true;

            geometry.classList.add(
                "ixvyn-touching"
            );

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

            const point =
                canvasPoint(touch);

            targetX = point.x;
            targetY = point.y;

            touchActive = true;

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

        },
        { passive: true }
    );

    document.addEventListener(
        "touchcancel",
        () => {

            touchActive = false;

        },
        { passive: true }
    );

    /* ---------------------------------------------------------
       VISUAL TOUCH FIELD
       --------------------------------------------------------- */

    function drawTouchField() {

        if (!touchActive) {

            touchStrength *= 0.92;

            return;

        }

        touchX +=
            (targetX - touchX) *
            0.18;

        touchY +=
            (targetY - touchY) *
            0.18;

        touchStrength =
            Math.min(
                1,
                touchStrength + 0.08
            );

        /*
         * A small spectral field follows the finger.
         *
         * This is intentionally NOT a giant glow.
         */

        const radius =
            Math.min(
                canvas.width,
                canvas.height
            ) * 0.13;

        const gradient =
            ctx.createRadialGradient(
                touchX,
                touchY,
                0,
                touchX,
                touchY,
                radius
            );

        gradient.addColorStop(
            0,
            "rgba(184,255,61,0.16)"
        );

        gradient.addColorStop(
            0.28,
            "rgba(53,231,238,0.075)"
        );

        gradient.addColorStop(
            0.58,
            "rgba(143,114,255,0.035)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            touchX,
            touchY,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
         * Expanding interaction ring.
         */

        const pulse =
            (
                performance.now() *
                0.0018
            ) % 1;

        ctx.beginPath();

        ctx.strokeStyle =
            `rgba(
                184,
                255,
                61,
                ${(
                    0.22 *
                    (1 - pulse)
                ).toFixed(3)}
            )`;

        ctx.lineWidth = 1;

        ctx.arc(
            touchX,
            touchY,
            radius *
                (0.35 + pulse * 0.65),
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }

    /* ---------------------------------------------------------
       CORE RESPONSE
       --------------------------------------------------------- */

    function updateCore() {

        const core =
            geometry.querySelector(
                ".geometry-core"
            );

        if (!core) return;

        const rect =
            geometry.getBoundingClientRect();

        const centerX =
            rect.left +
            rect.width / 2;

        const centerY =
            rect.top +
            rect.height / 2;

        /*
         * Convert the finger into viewport
         * coordinates for proximity testing.
         */

        const fingerRect =
            canvas.getBoundingClientRect();

        const fingerViewportX =
            fingerRect.left +
            touchX *
                (
                    fingerRect.width /
                    canvas.width
                );

        const fingerViewportY =
            fingerRect.top +
            touchY *
                (
                    fingerRect.height /
                    canvas.height
                );

        const dx =
            fingerViewportX -
            centerX;

        const dy =
            fingerViewportY -
            centerY;

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
                        (rect.width * 0.55)
            );

        const scale =
            1 +
            influence *
            touchStrength *
            0.055;

        core.style.setProperty(
            "--touch-scale",
            scale.toFixed(3)
        );

        core.style.setProperty(
            "--touch-x",
            `${dx * 0.025}px`
        );

        core.style.setProperty(
            "--touch-y",
            `${dy * 0.025}px`
        );

    }

    /* ---------------------------------------------------------
       ANIMATION
       --------------------------------------------------------- */

    function loop() {

        drawTouchField();

        updateCore();

        requestAnimationFrame(
            loop
        );

    }

    requestAnimationFrame(
        loop
    );

})();
/* ============================================================
   IXVYN — PASS 05
   THE CIVIC NETWORK
   Five systems become a living distributed network.
   ============================================================ */

(() => {
    "use strict";

    const systems =
        document.querySelector(".systems");

    if (!systems) return;

    const cards =
        [...systems.querySelectorAll(".system-card")];

    if (!cards.length) return;

    /* ---------------------------------------------------------
       NETWORK LAYER
       --------------------------------------------------------- */

    const network =
        document.createElement("div");

    network.className =
        "ixvyn-civic-network";

    network.setAttribute(
        "aria-hidden",
        "true"
    );

    network.innerHTML = `
        <div class="network-axis"></div>

        <div class="network-pulse"></div>

        <div class="network-threads">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>

        <div class="network-orbit orbit-a"></div>
        <div class="network-orbit orbit-b"></div>
    `;

    systems.insertBefore(
        network,
        systems.firstChild
    );

    /* ---------------------------------------------------------
       CARD CONNECTION
       --------------------------------------------------------- */

    cards.forEach(
        (card, index) => {

            const node =
                document.createElement("span");

            node.className =
                "network-node";

            node.dataset.system =
                card.dataset.system ||
                card.dataset.module ||
                "";

            node.dataset.index =
                index;

            network.appendChild(node);

            /*
             * Desktop hover.
             */

            card.addEventListener(
                "mouseenter",
                () => {

                    node.classList.add(
                        "network-node-active"
                    );

                    network.classList.add(
                        "network-engaged"
                    );

                }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    node.classList.remove(
                        "network-node-active"
                    );

                    network.classList.remove(
                        "network-engaged"
                    );

                }
            );

            /*
             * Mobile tap / focus.
             */

            card.addEventListener(
                "touchstart",
                () => {

                    node.classList.add(
                        "network-node-active"
                    );

                    network.classList.add(
                        "network-engaged"
                    );

                    setTimeout(
                        () => {

                            node.classList.remove(
                                "network-node-active"
                            );

                            network.classList.remove(
                                "network-engaged"
                            );

                        },
                        900
                    );

                },
                { passive: true }
            );
        }
    );

    /* ---------------------------------------------------------
       POSITION NODES
       --------------------------------------------------------- */

    function positionNodes() {

        const systemRect =
            systems.getBoundingClientRect();

        const networkRect =
            network.getBoundingClientRect();

        const centerX =
            networkRect.width / 2;

        cards.forEach(
            (card, index) => {

                const node =
                    network.querySelector(
                        `.network-node[data-index="${index}"]`
                    );

                if (!node) return;

                const rect =
                    card.getBoundingClientRect();

                const y =
                    rect.top -
                    systemRect.top +
                    rect.height / 2;

                /*
                 * Slight asymmetry keeps it organic.
                 */

                const offset =
                    Math.sin(
                        index * 1.7
                    ) * 20;

                node.style.left =
                    `${centerX + offset}px`;

                node.style.top =
                    `${y}px`;
            }
        );
    }

    /* ---------------------------------------------------------
       SCROLL ACTIVATION
       --------------------------------------------------------- */

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            const index =
                                cards.indexOf(
                                    entry.target
                                );

                            const node =
                                network.querySelector(
                                    `.network-node[data-index="${index}"]`
                                );

                            if (node) {

                                node.classList.add(
                                    "network-node-visible"
                                );

                            }
                        }
                    }
                );
            },
            {
                threshold: 0.35
            }
        );

    cards.forEach(
        card => observer.observe(card)
    );

    /* ---------------------------------------------------------
       RESIZE
       --------------------------------------------------------- */

    let resizeTimer;

    function requestPosition() {

        clearTimeout(
            resizeTimer
        );

        resizeTimer =
            setTimeout(
                positionNodes,
                120
            );
    }

    window.addEventListener(
        "resize",
        requestPosition,
        { passive: true }
    );

    /* ---------------------------------------------------------
       INITIALIZE
       --------------------------------------------------------- */

    requestAnimationFrame(
        () => {

            positionNodes();

            network.classList.add(
                "network-ready"
            );

        }
    );

})();
/* ============================================================
   IXVYN — PASS 06
   CINEMATIC PAGE STATES

   SEE
      ↓
   UNDERSTAND
      ↓
   RESPOND
      ↓
   ADAPT
      ↓
   REMEMBER

   The page itself changes state as you travel through it.
   ============================================================ */

(() => {
    "use strict";

    const root =
        document.documentElement;

    const systems =
        document.querySelector(".systems");

    const direction =
        document.querySelector(".direction");

    const about =
        document.querySelector(".about");

    if (!systems || !direction) return;

    /* ---------------------------------------------------------
       STATE DEFINITIONS
       --------------------------------------------------------- */

    const states = [
        "see",
        "understand",
        "respond",
        "adapt",
        "remember"
    ];

    let currentState = "";
    let ticking = false;

    /* ---------------------------------------------------------
       FIND PAGE PROGRESS
       --------------------------------------------------------- */

    function calculateState() {

        const viewport =
            window.innerHeight;

        const systemsRect =
            systems.getBoundingClientRect();

        const directionRect =
            direction.getBoundingClientRect();

        let state =
            "see";

        /*
         * HERO / TOP
         * ----------------------------------------------------
         */

        if (
            systemsRect.top >
            viewport * 0.72
        ) {
            state = "see";
        }

        /*
         * SYSTEMS
         * ----------------------------------------------------
         */

        else if (
            systemsRect.top >
            viewport * 0.18
        ) {
            state = "understand";
        }

        /*
         * LOWER SYSTEMS
         * ----------------------------------------------------
         */

        else if (
            directionRect.top >
            viewport * 0.62
        ) {
            state = "respond";
        }

        /*
         * DIRECTION
         * ----------------------------------------------------
         */

        else if (
            directionRect.top >
            viewport * 0.18
        ) {
            state = "adapt";
        }

        /*
         * AFTER DIRECTION
         * ----------------------------------------------------
         */

        else {
            state = "remember";
        }

        if (state === currentState)
            return;

        currentState = state;

        root.dataset.ixvynState =
            state;

        /*
         * Broadcast the state to any future
         * IXVYN subsystem.
         */

        window.dispatchEvent(
            new CustomEvent(
                "ixvyn:statechange",
                {
                    detail: {
                        state
                    }
                }
            )
        );
    }

    /* ---------------------------------------------------------
       SCROLL LOOP
       --------------------------------------------------------- */

    function requestUpdate() {

        if (ticking)
            return;

        ticking = true;

        requestAnimationFrame(
            () => {

                calculateState();

                ticking = false;

            }
        );
    }

    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestUpdate,
        { passive: true }
    );

    /* ---------------------------------------------------------
       INITIAL STATE
       --------------------------------------------------------- */

    calculateState();

})();
/* ============================================================
   IXVYN — PASS 07
   CIVIC TRAJECTORY
   DIRECTION becomes a living trajectory.
   ============================================================ */

(() => {
    "use strict";

    const section =
        document.querySelector(".direction");

    if (!section) return;

    const title =
        section.querySelector(".direction-main h2");

    if (!title) return;

    const words =
        [...title.querySelectorAll(".loop-word")];

    if (words.length !== 5) return;

    /* ---------------------------------------------------------
       TRAJECTORY LAYER
       --------------------------------------------------------- */

    const visual =
        document.createElement("div");

    visual.className =
        "ixvyn-trajectory";

    visual.setAttribute(
        "aria-hidden",
        "true"
    );

    visual.innerHTML = `
        <svg
            class="trajectory-svg"
            viewBox="0 0 700 900"
            preserveAspectRatio="none"
        >
            <path
                class="trajectory-trace"
                d="
                    M 80 110
                    C 210 120, 480 150, 590 255
                    C 665 325, 560 390, 360 430
                    C 155 470, 80 555, 205 650
                    C 315 730, 520 700, 625 790
                "
            />

            <path
                class="trajectory-memory"
                d="
                    M 80 110
                    C 210 120, 480 150, 590 255
                    C 665 325, 560 390, 360 430
                    C 155 470, 80 555, 205 650
                    C 315 730, 520 700, 625 790
                "
            />
        </svg>

        <div class="trajectory-signal"></div>

        <div class="trajectory-nodes">
            <span data-stage="0"></span>
            <span data-stage="1"></span>
            <span data-stage="2"></span>
            <span data-stage="3"></span>
            <span data-stage="4"></span>
        </div>

        <div class="trajectory-readout">
            <span>TRAJECTORY /</span>
            <strong>00</strong>
        </div>
    `;

    section.insertBefore(
        visual,
        section.firstChild
    );

    const signal =
        visual.querySelector(
            ".trajectory-signal"
        );

    const nodes =
        [...visual.querySelectorAll(
            ".trajectory-nodes span"
        )];

    const readout =
        visual.querySelector(
            ".trajectory-readout strong"
        );

    const path =
        visual.querySelector(
            ".trajectory-trace"
        );

    const memoryPath =
        visual.querySelector(
            ".trajectory-memory"
        );

    /* ---------------------------------------------------------
       POSITION STAGE NODES
       --------------------------------------------------------- */

    const positions = [
        [11, 12],
        [84, 28],
        [51, 48],
        [28, 72],
        [89, 88]
    ];

    nodes.forEach((node, index) => {
        node.style.left =
            `${positions[index][0]}%`;

        node.style.top =
            `${positions[index][1]}%`;
    });

    /* ---------------------------------------------------------
       PATH DRAW
       --------------------------------------------------------- */

    const pathLength =
        path.getTotalLength();

    path.style.strokeDasharray =
        `${pathLength}`;

    path.style.strokeDashoffset =
        `${pathLength}`;

    memoryPath.style.strokeDasharray =
        `${pathLength}`;

    memoryPath.style.strokeDashoffset =
        `${pathLength}`;

    /* ---------------------------------------------------------
       SCROLL STATE
       --------------------------------------------------------- */

    let progress = 0;
    let targetProgress = 0;
    let ticking = false;

    function calculateProgress() {

        const rect =
            section.getBoundingClientRect();

        const viewport =
            window.innerHeight;

        const travel =
            Math.max(
                section.offsetHeight -
                viewport * 0.35,
                1
            );

        targetProgress =
            Math.max(
                0,
                Math.min(
                    1,
                    (viewport * 0.78 - rect.top) /
                    travel
                )
            );
    }

    function render() {

        progress +=
            (targetProgress - progress) *
            0.075;

        const activeIndex =
            Math.min(
                4,
                Math.floor(
                    progress * 5
                )
            );

        /* Main trajectory reveal */

        path.style.strokeDashoffset =
            pathLength *
            (1 - progress);

        /* Memory trail grows behind it */

        memoryPath.style.strokeDashoffset =
            pathLength *
            (1 - Math.max(
                0,
                progress - 0.08
            ));

        /* Stage nodes */

        nodes.forEach(
            (node, index) => {

                node.classList.toggle(
                    "trajectory-node-past",
                    index < activeIndex
                );

                node.classList.toggle(
                    "trajectory-node-active",
                    index === activeIndex
                );
            }
        );

        /* Signal */

        const signalProgress =
            Math.min(
                0.985,
                progress
            );

        const point =
            path.getPointAtLength(
                pathLength *
                signalProgress
            );

        signal.style.left =
            `${(point.x / 700) * 100}%`;

        signal.style.top =
            `${(point.y / 900) * 100}%`;

        /* Readout */

        readout.textContent =
            String(
                activeIndex + 1
            ).padStart(2, "0");

        /* Existing words */

        words.forEach(
            (word, index) => {

                word.classList.toggle(
                    "trajectory-current",
                    index === activeIndex
                );

                word.classList.toggle(
                    "trajectory-completed",
                    index < activeIndex
                );
            }
        );

        ticking = false;
    }

    function requestRender() {

        calculateProgress();

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(
            render
        );
    }

    window.addEventListener(
        "scroll",
        requestRender,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestRender
    );

    requestRender();

    const visibility =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        visual.classList.toggle(
                            "trajectory-visible",
                            entry.isIntersecting
                        );

                    }
                );

            },
            {
                threshold: 0.05
            }
        );

    visibility.observe(section);

})();
/* ============================================================
   IXVYN — PASS 08
   MEMORY CONVERGENCE
   ============================================================ */

(() => {
    "use strict";

    const about = document.querySelector(".about");
    if (!about) return;

    const content = about.querySelector(".about-content");
    const heading = about.querySelector("h2");

    if (!content || !heading) return;

    /* ---------------------------------------------------------
       MEMORY FIELD
       --------------------------------------------------------- */

    const field = document.createElement("div");
    field.className = "ixvyn-memory-field";
    field.setAttribute("aria-hidden", "true");

    field.innerHTML = `
        <div class="memory-orbit memory-orbit-a"></div>
        <div class="memory-orbit memory-orbit-b"></div>

        <svg class="memory-traces"
             viewBox="0 0 1000 700"
             preserveAspectRatio="none">
            <path class="memory-trace"
                d="M0 110 C180 90 260 210 410 260 S700 250 1000 350"/>
            <path class="memory-trace"
                d="M0 590 C190 570 270 440 430 410 S730 470 1000 350"/>
            <path class="memory-trace memory-trace-faint"
                d="M40 350 C230 350 300 160 500 170 S760 300 960 350"/>
        </svg>

        <div class="memory-core">
            <span class="memory-core-ring"></span>
            <span class="memory-core-point"></span>
        </div>

        <div class="memory-status">
            <span>MEMORY /</span>
            <strong>STABLE</strong>
        </div>
    `;

    about.insertBefore(field, about.firstChild);

    const traces =
        [...field.querySelectorAll(".memory-trace")];

    const core =
        field.querySelector(".memory-core");

    const status =
        field.querySelector(".memory-status");

    /* ---------------------------------------------------------
       TRACE DRAW
       --------------------------------------------------------- */

    traces.forEach(trace => {
        const length = trace.getTotalLength();

        trace.style.strokeDasharray = length;
        trace.style.strokeDashoffset = length;

        trace.dataset.length = length;
    });

    /* ---------------------------------------------------------
       SCROLL CONVERGENCE
       --------------------------------------------------------- */

    let progress = 0;
    let target = 0;
    let raf = 0;

    function measure() {
        const rect = about.getBoundingClientRect();
        const vh = window.innerHeight;

        const range =
            Math.max(
                about.offsetHeight - vh * 0.45,
                1
            );

        target = Math.max(
            0,
            Math.min(
                1,
                (vh * 0.72 - rect.top) / range
            )
        );

        if (!raf) {
            raf = requestAnimationFrame(render);
        }
    }

    function render() {
        raf = 0;

        progress +=
            (target - progress) * 0.075;

        const eased =
            progress * progress *
            (3 - 2 * progress);

        traces.forEach((trace, index) => {
            const length =
                Number(trace.dataset.length);

            const offset =
                length * (1 - eased);

            trace.style.strokeDashoffset =
                offset;
        });

        /*
         * The farther into MEMORY we travel,
         * the more the system settles.
         */

        const scale =
            0.72 + eased * 0.28;

        const glow =
            0.15 + eased * 0.45;

        core.style.transform =
            `translate(-50%, -50%) scale(${scale})`;

        core.style.setProperty(
            "--memory-glow",
            glow
        );

        field.style.setProperty(
            "--memory-progress",
            eased
        );

        if (eased > 0.78) {
            status.classList.add("memory-stable");
        } else {
            status.classList.remove("memory-stable");
        }
    }

    window.addEventListener(
        "scroll",
        measure,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        measure
    );

    measure();

    /* ---------------------------------------------------------
       VISIBILITY
       --------------------------------------------------------- */

    const observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    field.classList.toggle(
                        "memory-visible",
                        entry.isIntersecting
                    );
                });
            },
            { threshold: 0.05 }
        );

    observer.observe(about);

})();
/* ============================================================
   IXVYN — RESTORE HOMEPAGE AFTER SYSTEM BACK NAVIGATION
   ============================================================ */

window.addEventListener("pageshow", () => {

    const handoff =
        document.querySelector(".ixvyn-handoff");

    if (!handoff) return;

    handoff.classList.remove("active");

    handoff.remove();

});
