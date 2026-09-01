document.addEventListener("DOMContentLoaded", () => {

    console.log("IXVYN is alive.");


    /*
    =====================================================
    BEGIN BUTTON
    PAGE 3 → SYSTEMS PAGE
    =====================================================
    */

    const beginButton =
        document.getElementById("begin-button");

    const directionPage =
        document.querySelector(".direction-page");


    if (beginButton && directionPage) {

        beginButton.addEventListener("click", () => {

            /*
            Start the cinematic transition.
            */

            directionPage.classList.add("transitioning");


            /*
            Give the geometry time to collapse
            before entering systems.html.
            */

            setTimeout(() => {

                window.location.href =
                    "systems.html";

            }, 900);

        });

    }


    /*
    =====================================================
    INITIATE EXPLORATION
    =====================================================
    */

    const initiate =
        document.querySelector(".initiate");

    if (initiate) {

        initiate.addEventListener("click", (event) => {

            const target =
                document.querySelector("#systems");

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        });

    }


    /*
    =====================================================
    SYSTEM CARD MICRO-INTERACTION
    =====================================================
    */

    const cards =
        document.querySelectorAll(".system-card");

    cards.forEach((card) => {

        card.addEventListener("mouseenter", () => {

            card.dataset.hovered =
                "true";

        });

        card.addEventListener("mouseleave", () => {

            delete card.dataset.hovered;

        });

    });

});


/*
=========================================================
IXVYN — RESTORE PAGE AFTER BACK / RETURN
=========================================================

The browser can restore the previous page from its
back-forward cache with the "transitioning" class still
attached.

That makes the SELECT A DIRECTION page appear invisible.

pageshow fires when the page is restored, so we reset
temporary visual states here.
=========================================================
*/

window.addEventListener("pageshow", () => {

    /*
    Remove any leftover transition state.
    */

    document
        .querySelectorAll(".transitioning")
        .forEach((element) => {

            element.classList.remove(
                "transitioning"
            );

        });


    /*
    Remove leftover opening states.
    */

    document
        .querySelectorAll(".is-opening")
        .forEach((element) => {

            element.classList.remove(
                "is-opening"
            );

        });


    /*
    Remove leftover active states.
    */

    document
        .querySelectorAll(".is-active")
        .forEach((element) => {

            element.classList.remove(
                "is-active"
            );

        });


    /*
    Restore normal scrolling.
    */

    document.body.style.overflow = "";

});
