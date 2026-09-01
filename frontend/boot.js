/* =========================================================
   IXVYN — CINEMATIC BOOT SEQUENCE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const boot = document.getElementById("ixvyn-boot");

    if (!boot) {
        return;
    }


    const message =
        document.getElementById("boot-message");

    const messageSmall =
        message?.querySelector(".boot-message-small");

    const messageMain =
        message?.querySelector(".boot-message-main");

    const final =
        document.getElementById("boot-final");

    const systems =
        document.getElementById("boot-systems");


    /* =====================================================
       REDUCED MOTION
    ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       IMMEDIATE EXIT FOR REDUCED MOTION
    ===================================================== */

    if (reducedMotion) {

        if (messageSmall) {
            messageSmall.textContent =
                "SYSTEM READY";
        }

        if (messageMain) {
            messageMain.textContent =
                "100.000000%";
        }

        boot.classList.add("is-final");

        setTimeout(() => {
            boot.classList.add("is-complete");
        }, 100);

        return;
    }


    /* =====================================================
       BOOT PROGRESS
    ===================================================== */

    const stages = [
        {
            progress: 12,
            label: "INITIALIZING CIVIC CORE"
        },
        {
            progress: 27,
            label: "CALIBRATING SPATIAL LAYER"
        },
        {
            progress: 44,
            label: "BUILDING INFRASTRUCTURE GRAPH"
        },
        {
            progress: 63,
            label: "ACTIVATING CITY LAYER"
        },
        {
            progress: 81,
            label: "SYNCHRONIZING SYSTEMS"
        },
        {
            progress: 100,
            label: "INITIALIZATION COMPLETE"
        }
    ];


    let currentProgress = 0;


    function updateProgress(value, label) {

        currentProgress = value;

        if (messageSmall) {
            messageSmall.textContent = label;
        }

        if (messageMain) {
            messageMain.textContent =
                `${value.toFixed(6)}%`;
        }

    }


    /* =====================================================
       SYSTEM ACTIVATION
    ===================================================== */

    const systemItems =
        document.querySelectorAll(
            ".boot-system"
        );


    function activateSystems() {

        systemItems.forEach(
            (item, index) => {

                setTimeout(() => {

                    item.classList.add(
                        "system-active"
                    );

                }, index * 180);

            }
        );

    }


    /* =====================================================
       BOOT TIMELINE
    ===================================================== */

    const timeline = [

        {
            delay: 250,
            progress: 12,
            label: "INITIALIZING CIVIC CORE"
        },

        {
            delay: 750,
            progress: 27,
            label: "CALIBRATING SPATIAL LAYER"
        },

        {
            delay: 1250,
            progress: 44,
            label: "BUILDING INFRASTRUCTURE GRAPH"
        },

        {
            delay: 1800,
            progress: 63,
            label: "ACTIVATING CITY LAYER"
        },

        {
            delay: 2350,
            progress: 81,
            label: "SYNCHRONIZING SYSTEMS"
        }

    ];


    timeline.forEach(stage => {

        setTimeout(() => {

            updateProgress(
                stage.progress,
                stage.label
            );

        }, stage.delay);

    });


    /* =====================================================
       ACTIVATE SYSTEMS
    ===================================================== */

    setTimeout(() => {

        activateSystems();

    }, 1900);


    /* =====================================================
       FINAL REVEAL
    ===================================================== */

    setTimeout(() => {

        updateProgress(
            100,
            "INITIALIZATION COMPLETE"
        );

        boot.classList.add("is-final");

    }, 3300);


    /* =====================================================
       EXIT BOOT SCREEN
    ===================================================== */

    setTimeout(() => {

        boot.classList.add(
            "is-complete"
        );

        document.body.classList.add(
            "boot-complete"
        );

    }, 4800);


    /* =====================================================
       CLEANUP
    ===================================================== */

    setTimeout(() => {

        if (boot) {
            boot.remove();
        }

    }, 6200);

});
