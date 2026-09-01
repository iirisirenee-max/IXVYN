/* =========================================================
   IXVYN — SYSTEMS INTERACTION // VISION ZERO UPGRADE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("IXVYN SYSTEMS spatial command driver online.");

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
       SYSTEM DATA SCHEMA
       ===================================================== */
    const systems = {
        lens: {
            title: "LENS",
            description:
                "Visual intelligence for detecting, classifying, and prioritizing visible infrastructure anomalies.",
            shape: "circle"
        },
        pathfinder: {
            title: "PATHFINDER",
            description:
                "Explore spatial safety attributes and localized road hazard blackspots through interactive dynamic mapping layers.",
            shape: "diamond"
        },
        civic: {
            title: "CIVIC",
            description:
                "Transform complex public safety logs and compliance deviations into actionable asset metrics.",
            shape: "diamond"
        },
        echo: {
            title: "ECHO",
            description:
                "Shape real-time automated maintenance deployment queues around the district.",
            shape: "circle"
        },
        memory: {
            title: "MEMORY",
            description:
                "Remember infrastructure decay rates over historical trends and preserve detected anomalies.",
            shape: "circle"
        }
    };

    /* =====================================================
       STATE & MAP LAYER REGISTERS
       ===================================================== */
    let activeSystem = null;
    let leafletMapInstance = null;

    /* =====================================================
       OPEN SYSTEM MODAL OVERLAY
       ===================================================== */
    function openSystem(systemName) {
        const system = systems[systemName];
        if (!system) return;

        activeSystem = systemName;

        /* ---------------------------------------------
           CONTENT MAPPING
        --------------------------------------------- */
        overlayTitle.textContent = system.title;
        overlayDescription.textContent = system.description;

        /* ---------------------------------------------
           RESET SYSTEM OVERLAY VISUAL CLASSES
        --------------------------------------------- */
        overlay.classList.remove(
            "system-lens", "system-pathfinder", "system-civic", "system-echo", "system-memory",
            "shape-circle", "shape-diamond"
        );

        /* ---------------------------------------------
           APPLY CURRENT CORE MATRIX
        --------------------------------------------- */
        overlay.classList.add(`system-${systemName}`);
        overlay.classList.add(`shape-${system.shape}`);

        /* ---------------------------------------------
           RESTART LAYOUT ANIMATIONS
        --------------------------------------------- */
        overlay.classList.remove("is-active");
        void overlay.offsetWidth; // Trigger DOM reflow calculation natively
        overlay.classList.add("is-active");

        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        /* ---------------------------------------------
           SIH MAP SPARK: INTERCEPT ACTIVE PATHFINDER MODAL
        --------------------------------------------- */
        if (systemName === "pathfinder") {
            // Append map layout view block dynamically if it hasn't been instantiated yet
            spawnMapCanvasElement();
        }

        setTimeout(() => {
            if (overlay.classList.contains("is-active")) {
                closeButton.focus();
            }
        }, 500);
    }/* =====================================================
       DYNAMIC MAP CANVAS GENERATION ENGINE
    ===================================================== */
    function spawnMapCanvasElement() {
        // Prevent layout collision or duplicate map bindings
        let existingCanvas = document.getElementById("ixvyn-spatial-map");
        if (existingCanvas) {
            existingCanvas.remove();
        }

        // Create a clean dedicated viewport frame wrapper matching your grid style
        const mapDiv = document.createElement("div");
        mapDiv.id = "ixvyn-spatial-map";
        mapDiv.style.width = "100%";
        mapDiv.style.height = "380px";
        mapDiv.style.marginTop = "24px";
        mapDiv.style.border = "1px solid var(--border-color, #222)";
        mapDiv.style.backgroundColor = "#0d0d0d";
        mapDiv.style.borderRadius = "2px";
        mapDiv.style.position = "relative";
        mapDiv.style.zIndex = "10";

        // Append the freshly minted node directly under the current system explanation text
        overlayDescription.parentNode.insertBefore(mapDiv, overlayDescription.nextSibling);

        // Baseline tracking coordinates fallback (Centered globally on New Delhi)
        let mapLat = 28.61390;
        let mapLon = 77.20900;

        // Check browser storage loops for active high-accuracy geolocation markers
        const sessionLat = sessionStorage.getItem("sih_lat");
        const sessionLon = sessionStorage.getItem("sih_lon");
        const sessionDefect = sessionStorage.getItem("sih_defect") || "INFRASTRUCTURE ANOMALY";
        const sessionSeverity = sessionStorage.getItem("sih_severity") || "PRIORITY CALIBRATION";
        const isTriggerActive = sessionStorage.getItem("sih_trigger") === "true";

        if (sessionLat && sessionLon) {
            mapLat = parseFloat(sessionLat);
            mapLon = parseFloat(sessionLon);
        }

        try {
            // Instantiate the open-source Leaflet map layer object context client-side
            leafletMapInstance = L.map('ixvyn-spatial-map', {
                zoomControl: false,
                attributionControl: false
            }).setView([mapLat, mapLon], 13);

            // Fetch free asset tile maps
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19
            }).addTo(leafletMapInstance);

            // Strapping custom CSS matrix filters directly to the canvas container to retain style matching
            mapDiv.style.filter = "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)";

            // Force a spatial layer render check to guarantee map tiles render evenly outside transitions
            setTimeout(() => {
                if (leafletMapInstance) {
                    leafletMapInstance.invalidateSize();
                    
                    // If a valid uploader trigger came across the shared storage queue, drop the pin live
                    if (isTriggerActive) {
                        const hazardMarker = L.marker([mapLat, mapLon]).addTo(leafletMapInstance);
                        hazardMarker.bindPopup(`
                            <div style="color:#000; font-family: monospace; font-size:11px; line-height:1.4;">
                                <b style="text-transform:uppercase;">[HAZARD DETECTED]</b><br>
                                TYPE: ${sessionDefect}<br>
                                SEV: ${sessionSeverity}<br>
                                LOC: ${mapLat.toFixed(4)}, ${mapLon.toFixed(4)}
                            </div>
                        `).openPopup();
                        
                        leafletMapInstance.panTo([mapLat, mapLon]);
                    }
                }
            }, 250);

        } catch (mapError) {
            console.error("IXVYN SYSTEMS: Spatial engine failure:", mapError.message);
        }
    }

    /* =====================================================
       CLOSE SYSTEM OVERLAY & TEARDOWN
    ===================================================== */
    function closeSystem() {
        overlay.classList.remove("is-active");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        // Safe teardown loop for Leaflet layers to clean hardware allocations
        if (leafletMapInstance) {
            leafletMapInstance.remove();
            leafletMapInstance = null;
        }

        let mapCanvas = document.getElementById("ixvyn-spatial-map");
        if (mapCanvas) {
            mapCanvas.remove();
        }

        activeSystem = null;
    }/* =====================================================
       PANEL INTERACTION CONTROLLERS
    ===================================================== */
    panels.forEach((panel) => {

        panel.addEventListener(
            "click",
            () => {
                const systemName = panel.dataset.system;
                if (!systemName) return;

                /* =========================================
                   LENS → REAL LENS EXPERIENCE REDIRECT
                   ========================================= */
                if (systemName === "lens") {
                    window.location.href = "lens.html";
                    return;
                }

                /* =========================================
                   MEMORY → REAL MEMORY EXPERIENCE REDIRECT
                   ========================================= */
                if (systemName === "memory") {
                    window.location.href = "memory.html";
                    return;
                }

                /* =========================================
                   PREVENT DOUBLE OVERLAY ACTIVATION
                   ========================================= */
                if (overlay.classList.contains("is-active")) return;

                /* =========================================
                   MICRO CLICK RESPONSE DELAY
                   ========================================= */
                panel.classList.add("is-opening");

                setTimeout(() => {
                    panel.classList.remove("is-opening");
                    openSystem(systemName);
                }, 180);
            }
        );

        /* =================================================
           3D VOLUMETRIC POINTER TILT CALCULATIONS
        ================================================= */
        panel.addEventListener(
            "pointermove",
            (event) => {
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                if (overlay.classList.contains("is-active")) return;

                const rect = panel.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const rotateX = ((y / rect.height) - 0.5) * -1.2;
                const rotateY = ((x / rect.width) - 0.5) * 1.2;

                panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            }
        );

        /* =================================================
           POINTER LEAVE RESET
        ================================================= */
        panel.addEventListener(
            "pointerleave",
            () => {
                panel.style.transform = "";
            }
        );
    });

    /* =====================================================
       INTERFACE INTERACTION CLOSURE EVENTS
    ===================================================== */
    closeButton.addEventListener("click", () => {
        closeSystem();
    });

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeSystem();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && overlay.classList.contains("is-active")) {
            closeSystem();
        }
    });

    /* =====================================================
       INITIAL STATE ASSIGNMENTS
    ===================================================== */
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    console.log("IXVYN systems interface online.");
});
