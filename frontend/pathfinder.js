/* =========================================================
   IXVYN / PATHFINDER
   Operational Response Routing
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DOM
       ===================================================== */

    const systemState =
        document.getElementById("system-state");

    const evidenceCard =
        document.getElementById("evidence-card");

    const evidenceState =
        document.getElementById("evidence-state");

    const condition =
        document.getElementById("condition");

    const evidenceSeverity =
        document.getElementById("evidence-severity");

    const evidenceConfidence =
        document.getElementById("evidence-confidence");

    const locationValue =
        document.getElementById("location-value");

    const locationCoordinates =
        document.getElementById("location-coordinates");

    const evidenceDescription =
        document.getElementById("evidence-description");

    const generateButton =
        document.getElementById("generate-button");

    const routingSection =
        document.getElementById("routing-section");

    const routeCondition =
        document.getElementById("route-condition");

    const priorityFill =
        document.getElementById("priority-fill");

    const routePriority =
        document.getElementById("route-priority");

    const priorityReason =
        document.getElementById("priority-reason");

    const routeRisk =
        document.getElementById("route-risk");

    const riskDescription =
        document.getElementById("risk-description");

    const routeDestination =
        document.getElementById("route-destination");

    const routeDescription =
        document.getElementById("route-description");

    const responseStep1 =
        document.getElementById("response-step-1");

    const responseStep2 =
        document.getElementById("response-step-2");

    const responseStep3 =
        document.getElementById("response-step-3");

    const responseDescription =
        document.getElementById("response-description");

    const summarySection =
        document.getElementById("summary-section");

    const summaryTitle =
        document.getElementById("summary-title");

    const summaryText =
        document.getElementById("summary-text");

    const summaryPriority =
        document.getElementById("summary-priority");

    const summaryRoute =
        document.getElementById("summary-route");

    const summaryStatus =
        document.getElementById("summary-status");

    const newRouteButton =
        document.getElementById("new-route");


    /* =====================================================
       STATE
       ===================================================== */

    let lensEvidence = null;
    let routeGenerated = false;


    /* =====================================================
       HELPERS
       ===================================================== */

    function sleep(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }


    function safeText(value, fallback = "—") {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return fallback;
        }

        return String(value);
    }


    function normalize(value) {

        return String(value || "")
            .trim()
            .toUpperCase();
    }


    /* =====================================================
       LOAD LENS EVIDENCE
       ===================================================== */

    function loadLensEvidence() {

        /*
         * These are the REAL keys currently written
         * by LENS.
         */

        const defect =
            sessionStorage.getItem("sih_defect");

        const severity =
            sessionStorage.getItem("sih_severity");

        const trigger =
            sessionStorage.getItem("sih_trigger");

        const latitude =
            sessionStorage.getItem("sih_lat");

        const longitude =
            sessionStorage.getItem("sih_lon");


        /*
         * PATHFINDER activates only when LENS has
         * actually produced an inspection.
         */

        if (
            trigger !== "true" ||
            !defect ||
            !severity
        ) {

            showWaitingState();

            return;
        }


        lensEvidence = {

            defect: defect,

            severity: severity,

            latitude:
                latitude
                    ? Number(latitude)
                    : null,

            longitude:
                longitude
                    ? Number(longitude)
                    : null,

            confidence: null,

            description:
                "Infrastructure evidence forwarded from LENS visual inspection."

        };


        console.log(
            "[PATHFINDER] LENS evidence received:",
            lensEvidence
        );


        populateEvidence(
            lensEvidence
        );
    }


    /* =====================================================
       WAITING STATE
       ===================================================== */

    function showWaitingState() {

        lensEvidence = null;

        evidenceCard.classList.remove(
            "is-loaded"
        );

        evidenceState.textContent =
            "WAITING";

        condition.textContent =
            "—";

        evidenceSeverity.textContent =
            "SEVERITY —";

        evidenceConfidence.textContent =
            "CONFIDENCE —";

        locationValue.textContent =
            "—";

        locationCoordinates.textContent =
            "NO COORDINATES";

        evidenceDescription.textContent =
            "No LENS inspection has been forwarded yet.";

        generateButton.disabled =
            true;

        systemState.textContent =
            "AWAITING EVIDENCE";
    }


    /* =====================================================
       POPULATE EVIDENCE
       ===================================================== */

    function populateEvidence(data) {

        evidenceCard.classList.add(
            "is-loaded"
        );

        evidenceState.textContent =
            "RECEIVED";

        systemState.textContent =
            "EVIDENCE RECEIVED";

        generateButton.disabled =
            false;


        const defect =
            data.defect ||
            data.classification ||
            data.condition ||
            data.label ||
            "UNKNOWN CONDITION";


        const severity =
            data.severity ||
            "UNKNOWN";


        condition.textContent =
            normalize(defect);


        evidenceSeverity.textContent =
            `SEVERITY ${normalize(severity)}`;


        if (
            data.confidence !== null &&
            data.confidence !== undefined
        ) {

            const confidence =
                parseFloat(data.confidence);


            if (
                Number.isFinite(confidence)
            ) {

                const percentage =
                    confidence <= 1
                        ? Math.round(confidence * 100)
                        : Math.round(confidence);

                evidenceConfidence.textContent =
                    `CONFIDENCE ${percentage}%`;

            } else {

                evidenceConfidence.textContent =
                    "CONFIDENCE —";
            }

        } else {

            evidenceConfidence.textContent =
                "CONFIDENCE —";
        }


        evidenceDescription.textContent =
            safeText(
                data.description,
                "Infrastructure evidence forwarded from LENS visual inspection."
            );


        /* -------------------------------------------------
           LOCATION
           ------------------------------------------------- */

        const latitude =
            data.latitude;

        const longitude =
            data.longitude;


        if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
        ) {

            locationValue.textContent =
                "GEOLOCATED";

            locationCoordinates.textContent =
                `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        } else {

            locationValue.textContent =
                "LOCATION PENDING";

            locationCoordinates.textContent =
                "NO COORDINATES";
        }
    }


    /* =====================================================
       DECISION ENGINE
       ===================================================== */

    function deriveRoute(data) {

        const defect =
            normalize(
                data.defect
            );


        const severity =
            normalize(
                data.severity
            );


        /* =================================================
           PRIORITY
           ================================================= */

        let priority =
            "MEDIUM";

        let priorityScore =
            62;


        if (
            severity.includes("CRITICAL") ||
            severity.includes("SEVERE") ||
            severity.includes("HIGH")
        ) {

            priority =
                "HIGH";

            priorityScore =
                92;

        } else if (
            severity.includes("LOW") ||
            severity.includes("MINOR")
        ) {

            priority =
                "LOW";

            priorityScore =
                35;
        }


        /* =================================================
           RISK
           ================================================= */

        let risk =
            "INFRASTRUCTURE HAZARD";


        let riskDescriptionText =
            "Observed damage may affect safe use of public infrastructure.";


        if (
            defect.includes("POTHOLE")
        ) {

            risk =
                "VEHICLE / PEDESTRIAN HAZARD";

            riskDescriptionText =
                "Road-surface damage may create collision, vehicle-damage, or pedestrian safety risk.";

        } else if (
            defect.includes("CRACK") ||
            defect.includes("ROAD DAMAGE") ||
            defect.includes("DAMAGE")
        ) {

            risk =
                "ROAD SAFETY HAZARD";

            riskDescriptionText =
                "Surface deterioration may worsen with traffic and environmental exposure.";

        } else if (
            defect.includes("WASTE") ||
            defect.includes("OBSTRUCTION") ||
            defect.includes("DEBRIS")
        ) {

            risk =
                "ACCESS / SANITATION HAZARD";

            riskDescriptionText =
                "The obstruction may restrict access, mobility, or normal public-space use.";
        }


        /* =================================================
           ROUTE
           ================================================= */

        let route =
            "INFRASTRUCTURE MAINTENANCE";


        let routeDescriptionText =
            "Forward the observation to the appropriate municipal maintenance workflow.";


        if (
            defect.includes("POTHOLE") ||
            defect.includes("ROAD") ||
            defect.includes("CRACK") ||
            defect.includes("DAMAGE")
        ) {

            route =
                "ROAD MAINTENANCE";

            routeDescriptionText =
                "Route to road-maintenance inspection and repair workflow.";

        } else if (
            defect.includes("WASTE") ||
            defect.includes("OBSTRUCTION") ||
            defect.includes("DEBRIS")
        ) {

            route =
                "SANITATION / CLEARANCE";

            routeDescriptionText =
                "Route to clearance or sanitation response workflow.";
        }


        /* =================================================
           RESPONSE
           ================================================= */

        let response = {

            step1:
                "INSPECT",

            step2:
                "REPAIR",

            step3:
                "VERIFY",

            description:
                "Inspect the reported condition, execute the appropriate intervention, then verify the outcome."

        };


        if (
            defect.includes("WASTE") ||
            defect.includes("OBSTRUCTION") ||
            defect.includes("DEBRIS")
        ) {

            response = {

                step1:
                    "INSPECT",

                step2:
                    "CLEAR",

                step3:
                    "VERIFY",

                description:
                    "Inspect the obstruction, clear the affected area, then verify that access has been restored."

            };
        }


        return {

            condition:
                defect ||
                "UNKNOWN CONDITION",

            priority,

            priorityScore,

            priorityReason:
                `Priority derived from observed severity: ${severity || "UNSPECIFIED"}.`,

            risk,

            riskDescription:
                riskDescriptionText,

            route,

            routeDescription:
                routeDescriptionText,

            response
        };
    }


    /* =====================================================
       GENERATE ROUTE
       ===================================================== */

    async function generateRoute() {

        if (
            !lensEvidence ||
            routeGenerated
        ) {
            return;
        }


        routeGenerated =
            true;


        generateButton.disabled =
            true;


        generateButton
            .querySelector(
                "span:first-child"
            )
            .textContent =
                "ROUTING EVIDENCE";


        systemState.textContent =
            "ROUTING";


        const header =
            document.querySelector(
                ".pf-header"
            );


        if (header) {
            header.classList.add(
                "is-active"
            );
        }


        clearRouteState();


        const route =
            deriveRoute(
                lensEvidence
            );


        /* -------------------------------------------------
           CONDITION
           ------------------------------------------------- */

        await sleep(450);


        routeCondition.textContent =
            route.condition;


        activateNode(
            "condition"
        );


        /* -------------------------------------------------
           PRIORITY
           ------------------------------------------------- */

        await sleep(350);


        routePriority.textContent =
            route.priority;


        priorityReason.textContent =
            route.priorityReason;


        activateNode(
            "priority"
        );


        requestAnimationFrame(() => {

            priorityFill.style.width =
                `${route.priorityScore}%`;

        });


        /* -------------------------------------------------
           RISK
           ------------------------------------------------- */

        await sleep(350);


        routeRisk.textContent =
            route.risk;


        riskDescription.textContent =
            route.riskDescription;


        activateNode(
            "risk"
        );


        /* -------------------------------------------------
           ROUTE
           ------------------------------------------------- */

        await sleep(350);


        routeDestination.textContent =
            route.route;


        routeDescription.textContent =
            route.routeDescription;


        activateNode(
            "route"
        );


        /* -------------------------------------------------
           RESPONSE
           ------------------------------------------------- */

        await sleep(350);


        responseStep1.textContent =
            route.response.step1;

        responseStep2.textContent =
            route.response.step2;

        responseStep3.textContent =
            route.response.step3;

        responseDescription.textContent =
            route.response.description;


        activateNode(
            "response"
        );


        routingSection.classList.add(
            "is-generated"
        );


        /* -------------------------------------------------
           SUMMARY
           ------------------------------------------------- */

        await sleep(500);


        renderSummary(
            route
        );


        summarySection.classList.add(
            "is-generated"
        );


        systemState.textContent =
            "ROUTE IDENTIFIED";


        generateButton
            .querySelector(
                "span:first-child"
            )
            .textContent =
                "ROUTE GENERATED";


        if (header) {

            header.classList.remove(
                "is-active"
            );
        }
    }


    /* =====================================================
       ACTIVATE NODE
       ===================================================== */

    function activateNode(
        nodeName
    ) {

        const node =
            document.querySelector(
                `.pf-route-node[data-node="${nodeName}"]`
            );


        if (!node) {
            return;
        }


        node.classList.add(
            "is-active"
        );


        const previousLine =
            node.previousElementSibling;


        if (
            previousLine &&
            previousLine.classList.contains(
                "pf-route-line"
            )
        ) {

            previousLine.classList.add(
                "is-active"
            );
        }
    }


    /* =====================================================
       CLEAR ROUTE
       ===================================================== */

    function clearRouteState() {

        document
            .querySelectorAll(
                ".pf-route-node"
            )
            .forEach(node => {

                node.classList.remove(
                    "is-active"
                );

            });


        document
            .querySelectorAll(
                ".pf-route-line"
            )
            .forEach(line => {

                line.classList.remove(
                    "is-active"
                );

            });


        routingSection.classList.remove(
            "is-generated"
        );


        summarySection.classList.remove(
            "is-generated"
        );


        priorityFill.style.width =
            "0%";


        routeCondition.textContent =
            "—";

        routePriority.textContent =
            "—";

        routeRisk.textContent =
            "—";

        routeDestination.textContent =
            "—";


        priorityReason.textContent =
            "Priority will be derived from severity.";


        riskDescription.textContent =
            "Potential impact will be assessed from the observed condition.";


        routeDescription.textContent =
            "Operational destination will be selected from the condition.";


        responseStep1.textContent =
            "INSPECT";

        responseStep2.textContent =
            "REPAIR";

        responseStep3.textContent =
            "VERIFY";


        responseDescription.textContent =
            "No response route generated.";


        summaryTitle.textContent =
            "AWAITING ROUTE";


        summaryText.textContent =
            "Forward evidence from LENS to generate an operational response.";


        summaryPriority.textContent =
            "—";

        summaryRoute.textContent =
            "—";

        summaryStatus.textContent =
            "PENDING";
    }


    /* =====================================================
       SUMMARY
       ===================================================== */

    function renderSummary(
        route
    ) {

        summaryTitle.textContent =
            `${route.priority} RESPONSE`;


        summaryText.textContent =
            `PATHFINDER routed ${route.condition.toLowerCase()} through ${route.route.toLowerCase()} with a ${route.priority.toLowerCase()} operational priority.`;


        summaryPriority.textContent =
            route.priority;


        summaryRoute.textContent =
            route.route;


        summaryStatus.textContent =
            "ROUTE CONFIRMED";
    }


    /* =====================================================
       NEW ROUTE
       ===================================================== */

    function resetRoute() {

        routeGenerated =
            false;


        clearRouteState();


        generateButton.disabled =
            !lensEvidence;


        generateButton
            .querySelector(
                "span:first-child"
            )
            .textContent =
                "GENERATE RESPONSE";


        systemState.textContent =
            lensEvidence
                ? "EVIDENCE RECEIVED"
                : "AWAITING EVIDENCE";
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    generateButton.addEventListener(
        "click",
        generateRoute
    );


    newRouteButton.addEventListener(
        "click",
        resetRoute
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    loadLensEvidence();


    console.log(
        "IXVYN PATHFINDER operational routing interface ready."
    );

});
