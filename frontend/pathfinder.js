/* =========================================================
   IXVYN / SIGNAL
   ASSESSMENT LAYER

   LENS observes.
   SIGNAL assesses.
   SIGNAL does NOT choose interventions.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const assessButton =
        document.getElementById("assess-button");

    const trajectoryButton =
        document.getElementById("trajectory-button");

    const reassessButton =
        document.getElementById("reassess-button");

    const processing =
        document.getElementById("processing");

    const signalResult =
        document.getElementById("signal-result");

    const systemStatus =
        document.getElementById("system-status");

    const inputState =
        document.getElementById("input-state");

    const actionNote =
        document.getElementById("action-note");


    let lensObservation = null;
    let signalAssessment = null;


    /* =====================================================
       SAFE TEXT
    ===================================================== */

    function text(value, fallback = "NOT OBSERVABLE") {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return fallback;
        }

        if (Array.isArray(value)) {
            return value.length
                ? value.join(" · ")
                : fallback;
        }

        if (typeof value === "object") {

            return Object.entries(value)
                .map(([key, value]) => {

                    if (
                        value === null ||
                        value === undefined ||
                        value === ""
                    ) {
                        return `${key.toUpperCase()}: ${fallback}`;
                    }

                    return `${key.toUpperCase()}: ${value}`;
                })
                .join(" · ");
        }

        return String(value);
    }


    /* =====================================================
       ARRAY NORMALIZER
    ===================================================== */

    function array(value) {

        if (!Array.isArray(value) || !value.length) {
            return [];
        }

        return value.map(item => {

            if (typeof item === "string") {
                return item;
            }

            if (!item || typeof item !== "object") {
                return String(item);
            }

            return (
                item.label ||
                item.type ||
                item.description ||
                item.factor ||
                item.reason ||
                JSON.stringify(item)
            );

        });
    }


    /* =====================================================
       LOAD LENS OBSERVATION
    ===================================================== */

    function loadLensObservation() {

        const raw =
            sessionStorage.getItem(
                "ixvyn_lens_observation"
            );

        if (!raw) {

            inputState.textContent =
                "WAITING FOR LENS";

            systemStatus.textContent =
                "STANDBY";

            assessButton.disabled = true;

            return false;
        }


        try {

            lensObservation =
                JSON.parse(raw);

        } catch (error) {

            console.error(
                "IXVYN SIGNAL: invalid LENS observation",
                error
            );

            inputState.textContent =
                "INVALID OBSERVATION";

            assessButton.disabled = true;

            return false;
        }


        renderObservation(
            lensObservation
        );

        inputState.textContent =
            "LENS OBSERVATION READY";

        systemStatus.textContent =
            "SIGNAL READY";

        assessButton.disabled =
            false;

        actionNote.textContent =
            "Observation received. SIGNAL can now assess the safety signal.";

        return true;
    }


    /* =====================================================
       RENDER OBSERVATION
    ===================================================== */

    function renderObservation(data) {

        const road =
            data.road || {};

        const people =
            data.people || {};

        const vehicles =
            data.vehicles || {};

        const visibility =
            data.visibility || {};


        document.getElementById(
            "scene-summary"
        ).textContent =
            data.sceneSummary ||
            "Scene observed.";


        document.getElementById(
            "scene-road"
        ).textContent =
            text(
                road.sceneType ||
                road.geometry ||
                data.sceneType
            );


        document.getElementById(
            "scene-people"
        ).textContent =
            text(
                people.presence
            );


        document.getElementById(
            "scene-vehicles"
        ).textContent =
            text(
                vehicles.presence
            );


        document.getElementById(
            "scene-visibility"
        ).textContent =
            text(
                visibility.state
            );
    }


    /* =====================================================
       PROCESSING
    ===================================================== */

    async function runAssessment() {

        if (!lensObservation) {
            return;
        }

        assessButton.disabled = true;

        signalResult.hidden = true;

        processing.hidden = false;

        systemStatus.textContent =
            "ASSESSING";

        inputState.textContent =
            "SIGNAL SYNTHESIS";


        const processLines = [
            document.getElementById("process-line-1"),
            document.getElementById("process-line-2"),
            document.getElementById("process-line-3"),
            document.getElementById("process-line-4")
        ];


        processLines.forEach(
            line => line.classList.remove("active")
        );


        try {

            for (
                let i = 0;
                i < processLines.length;
                i++
            ) {

                processLines[i]
                    .classList.add("active");

                await wait(500);
            }


            const response =
                await fetch(
                    "/api/signal",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            observation:
                                lensObservation
                        })
                    }
                );


            const responseText =
                await response.text();


            let data = null;


            try {

                data =
                    responseText
                        ? JSON.parse(responseText)
                        : null;

            } catch {

                throw new Error(
                    `SIGNAL server returned HTTP ${response.status}.`
                );
            }


            if (
                !response.ok ||
                !data
            ) {

                throw new Error(
                    data?.error ||
                    `SIGNAL assessment failed (${response.status}).`
                );
            }


            signalAssessment =
                data.assessment ||
                data;


            saveSignalAssessment(
                signalAssessment
            );

            renderAssessment(
                signalAssessment
            );


            processing.hidden = true;

            signalResult.hidden = false;

            systemStatus.textContent =
                "SIGNAL ASSESSED";

            inputState.textContent =
                "ASSESSMENT COMPLETE";


            signalResult.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


        } catch (error) {

            console.error(
                "IXVYN SIGNAL ERROR:",
                error
            );

            processing.hidden = true;

            assessButton.disabled = false;

            systemStatus.textContent =
                "ASSESSMENT ERROR";

            inputState.textContent =
                "FAILED";

            actionNote.textContent =
                error.message ||
                "Unable to complete SIGNAL assessment.";

        }

    }


    /* =====================================================
       RENDER ASSESSMENT
    ===================================================== */

    function renderAssessment(result) {

        const score =
            Number(result.riskScore);


        document.getElementById(
            "risk-score"
        ).textContent =
            Number.isFinite(score)
                ? Math.round(score)
                : "—";


        document.getElementById(
            "risk-level"
        ).textContent =
            text(
                result.riskLevel,
                "UNASSESSED"
            ).toUpperCase();


        document.getElementById(
            "risk-headline"
        ).textContent =
            result.headline ||
            "Safety signal assessed.";


        document.getElementById(
            "risk-reasoning"
        ).textContent =
            result.reasoning ||
            "No reasoning was returned.";


        renderList(
            "factors-list",
            result.contributingFactors
        );


        renderList(
            "conflicts-list",
            result.conflictIndicators
        );


        renderList(
            "exposure-list",
            result.exposure
        );


        renderList(
            "vulnerable-list",
            result.vulnerableRoadUsers
        );


        document.getElementById(
            "evidence-strength"
        ).textContent =
            text(
                result.evidenceStrength,
                "UNKNOWN"
            ).toUpperCase();


        renderBulletList(
            "supported-list",
            result.evidence?.supported
        );


        renderBulletList(
            "unknown-list",
            result.evidence?.unknowns
        );
    }


    /* =====================================================
       RESULT LIST
    ===================================================== */

    function renderList(
        elementId,
        value
    ) {

        const container =
            document.getElementById(
                elementId
            );

        if (!container) {
            return;
        }


        const values =
            array(value);


        if (!values.length) {

            container.innerHTML =
                `<div>NONE IDENTIFIED</div>`;

            return;
        }


        container.innerHTML =
            values
                .map(item =>
                    `<div>${escapeHTML(item)}</div>`
                )
                .join("");
    }


    /* =====================================================
       BULLET LIST
    ===================================================== */

    function renderBulletList(
        elementId,
        value
    ) {

        const container =
            document.getElementById(
                elementId
            );

        if (!container) {
            return;
        }


        const values =
            array(value);


        if (!values.length) {

            container.innerHTML =
                `<li>NONE IDENTIFIED</li>`;

            return;
        }


        container.innerHTML =
            values
                .map(item =>
                    `<li>${escapeHTML(item)}</li>`
                )
                .join("");
    }


    /* =====================================================
       SAVE SIGNAL
    ===================================================== */

    function saveSignalAssessment(
        assessment
    ) {

        const record = {

            schema:
                "IXVYN_SAFETY_SIGNAL_V1",

            source:
                "SIGNAL",

            timestamp:
                new Date().toISOString(),

            observation:
                lensObservation,

            assessment: {

                riskScore:
                    assessment.riskScore ??
                    null,

                riskLevel:
                    assessment.riskLevel ??
                    "UNKNOWN",

                headline:
                    assessment.headline ||
                    "",

                reasoning:
                    assessment.reasoning ||
                    "",

                contributingFactors:
                    assessment.contributingFactors ||
                    [],

                conflictIndicators:
                    assessment.conflictIndicators ||
                    [],

                exposure:
                    assessment.exposure ||
                    [],

                vulnerableRoadUsers:
                    assessment.vulnerableRoadUsers ||
                    [],

                evidenceStrength:
                    assessment.evidenceStrength ||
                    "UNKNOWN",

                evidence:
                    assessment.evidence ||
                    {
                        supported: [],
                        unknowns: []
                    }
            },

            intervention:
                null,

            humanDecision:
                null,

            outcome:
                null,

            status:
                "assessed"
        };


        sessionStorage.setItem(
            "ixvyn_signal_assessment",
            JSON.stringify(record)
        );
    }


    /* =====================================================
       TRAJECTORY HANDOFF
    ===================================================== */

    trajectoryButton.addEventListener(
        "click",
        () => {

            if (!signalAssessment) {
                return;
            }


            sessionStorage.setItem(
                "ixvyn_trajectory_input",
                JSON.stringify({
                    source: "SIGNAL",

                    observation:
                        lensObservation,

                    assessment:
                        signalAssessment,

                    timestamp:
                        new Date().toISOString()
                })
            );


            sessionStorage.setItem(
                "ixvyn_trajectory_trigger",
                "true"
            );


            /*
             * Keep the existing route so the homepage
             * does not need to change immediately.
             *
             * TRAJECTORY can replace this destination
             * once its page is built.
             */

            window.location.href =
                "trajectory.html";
        }
    );


    /* =====================================================
       REASSESS
    ===================================================== */

    reassessButton.addEventListener(
        "click",
        () => {

            signalResult.hidden = true;

            signalAssessment = null;

            assessButton.disabled = false;

            inputState.textContent =
                "LENS OBSERVATION READY";

            systemStatus.textContent =
                "SIGNAL READY";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );


    /* =====================================================
       HELPERS
    ===================================================== */

    function wait(ms) {

        return new Promise(
            resolve =>
                setTimeout(resolve, ms)
        );
    }


    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /* =====================================================
       INIT
    ===================================================== */

    loadLensObservation();

});
