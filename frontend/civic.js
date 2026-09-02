document.addEventListener("DOMContentLoaded", () => {

    const decisionStatus =
        document.getElementById("decision-status");

    const decisionValue =
        document.getElementById("decision-value");

    const interventionTitle =
        document.getElementById("intervention-title");

    const interventionRationale =
        document.getElementById("intervention-rationale");

    const actionType =
        document.getElementById("action-type");

    const locationInput =
        document.getElementById("location");

    const summaryInput =
        document.getElementById("summary");

    const evidenceInput =
        document.getElementById("evidence");

    const previewId =
        document.getElementById("preview-id");

    const previewAction =
        document.getElementById("preview-action");

    const previewLocation =
        document.getElementById("preview-location");

    const previewRisk =
        document.getElementById("preview-risk");

    const previewRationale =
        document.getElementById("preview-rationale");

    const submitBtn =
        document.getElementById("submit-btn");

    const resetBtn =
        document.getElementById("reset-btn");

    const memoryBtn =
        document.getElementById("memory-btn");

    const submittedPanel =
        document.getElementById("submitted-panel");

    const recordId =
        document.getElementById("record-id");

    const processing =
        document.getElementById("processing");

    const processingStage =
        document.getElementById("processing-stage");


    let decision = null;
    let assessment = null;
    let observation = null;
    let civicRecord = null;


    function parse(value) {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }


    function loadContext() {

        decision = parse(
            sessionStorage.getItem("ixvyn_human_decision")
        );

        assessment = parse(
            sessionStorage.getItem("ixvyn_signal_assessment")
        );

        observation = parse(
            sessionStorage.getItem("ixvyn_lens_observation")
        );

        if (!decision) {
            decisionStatus.textContent = "NO DECISION";
            decisionValue.textContent = "—";
            return;
        }

        decisionStatus.textContent = "DECISION RECEIVED";

        decisionValue.textContent =
            decision.decision || "UNKNOWN";

        const scenario =
            decision.scenario || {};

        interventionTitle.textContent =
            scenario.title ||
            "Intervention scenario";

        interventionRationale.textContent =
            scenario.rationale ||
            scenario.description ||
            "No rationale supplied.";

        previewRisk.textContent =
            assessment?.riskLevel ||
            "UNKNOWN";

        previewRationale.textContent =
            scenario.rationale ||
            scenario.description ||
            "Evidence-backed action.";

        const location =
            observation?.location ||
            {};

        if (
            location.lat !== null &&
            location.lat !== undefined &&
            location.lon !== null &&
            location.lon !== undefined
        ) {
            locationInput.value =
                `${location.lat}, ${location.lon}`;
        }

        summaryInput.value =
            scenario.description ||
            "";

        evidenceInput.value =
            buildEvidenceSummary();

        updatePreview();
    }


    function buildEvidenceSummary() {

        const parts = [];

        if (observation?.sceneSummary) {
            parts.push(
                `SCENE: ${observation.sceneSummary}`
            );
        }

        if (assessment?.headline) {
            parts.push(
                `SIGNAL: ${assessment.headline}`
            );
        }

        if (assessment?.reasoning) {
            parts.push(
                `ASSESSMENT: ${assessment.reasoning}`
            );
        }

        if (
            Array.isArray(assessment?.contributingFactors)
        ) {
            parts.push(
                "CONTRIBUTING FACTORS: " +
                assessment.contributingFactors.join("; ")
            );
        }

        if (
            Array.isArray(assessment?.conflictIndicators)
        ) {
            parts.push(
                "CONFLICT INDICATORS: " +
                assessment.conflictIndicators.join("; ")
            );
        }

        return parts.join("\n\n");
    }


    function updatePreview() {

        previewAction.textContent =
            actionType.value;

        previewLocation.textContent =
            locationInput.value.trim() ||
            "NOT SPECIFIED";
    }


    function setProcessing(active) {
        processing.classList.toggle(
            "hidden",
            !active
        );
    }


    function stage(text) {
        processingStage.textContent = text;
    }


    function delay(ms) {
        return new Promise(
            resolve => setTimeout(resolve, ms)
        );
    }


    async function submitAction() {

        if (!decision) {
            alert(
                "No human decision found. Complete TRAJECTORY first."
            );
            return;
        }

        if (
            String(decision.decision).toUpperCase() !==
            "APPROVED"
        ) {
            alert(
                "CIVIC action requires an APPROVED trajectory."
            );
            return;
        }

        if (!summaryInput.value.trim()) {
            alert(
                "Add a public-facing summary before submitting."
            );
            return;
        }

        setProcessing(true);

        try {

            stage("VALIDATING DECISION");
            await delay(450);

            stage("ASSEMBLING EVIDENCE");
            await delay(450);

            stage("CREATING CIVIC RECORD");
            await delay(450);

            const response = await fetch(
                "/api/civic",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        decision,
                        assessment,
                        observation,
                        action: {
                            type: actionType.value,
                            location:
                                locationInput.value.trim(),
                            summary:
                                summaryInput.value.trim(),
                            evidence:
                                evidenceInput.value.trim()
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Civic request failed: ${response.status}`
                );
            }

            const data =
                await response.json();

            civicRecord = {
                ...data,
                schema:
                    "IXVYN_CIVIC_ACTION_V1",
                createdAt:
                    new Date().toISOString(),
                status:
                    data.status || "SUBMITTED",
                decision,
                assessment,
                observation,
                action: {
                    type: actionType.value,
                    location:
                        locationInput.value.trim(),
                    summary:
                        summaryInput.value.trim(),
                    evidence:
                        evidenceInput.value.trim()
                }
            };

            localStorage.setItem(
                "ixvyn_civic_record",
                JSON.stringify(civicRecord)
            );

            sessionStorage.setItem(
                "ixvyn_civic_record",
                JSON.stringify(civicRecord)
            );

            setProcessing(false);

            recordId.textContent =
                civicRecord.id ||
                `IXVYN-${Date.now()}`;

            submittedPanel.classList.remove(
                "hidden"
            );

            submitBtn.textContent =
                "ACTION SUBMITTED";

        } catch (error) {

            console.error(error);

            setProcessing(false);

            alert(
                error.message ||
                "Unable to create civic action."
            );
        }
    }


    function saveToMemory() {

        if (!civicRecord) {
            civicRecord = parse(
                sessionStorage.getItem(
                    "ixvyn_civic_record"
                )
            );
        }

        if (!civicRecord) {
            alert(
                "No civic record is available to save."
            );
            return;
        }

        const memoryRecord = {
            id:
                civicRecord.id ||
                `IX-${Date.now()}`,

            schema:
                "IXVYN_SAFETY_MEMORY_V1",

            timestamp:
                new Date().toISOString(),

            status:
                "intervention_recorded",

            observation:
                observation || null,

            riskAssessment:
                assessment || null,

            humanDecision:
                decision || null,

            intervention:
                civicRecord.action || null,

            outcome:
                null
        };

        const existing =
            parse(
                localStorage.getItem(
                    "ixvyn_memory_records"
                )
            ) || [];

        const filtered =
            existing.filter(
                item =>
                    item.id !== memoryRecord.id
            );

        filtered.push(memoryRecord);

        localStorage.setItem(
            "ixvyn_memory_records",
            JSON.stringify(filtered)
        );

        sessionStorage.setItem(
            "ixvyn_memory_latest",
            JSON.stringify(memoryRecord)
        );

        memoryBtn.textContent =
            "SAVED TO MEMORY";

        memoryBtn.disabled = true;
    }


    function reset() {

        submittedPanel.classList.add(
            "hidden"
        );

        civicRecord = null;

        submitBtn.disabled = false;

        submitBtn.textContent =
            "SUBMIT CIVIC ACTION";

        memoryBtn.disabled = false;

        memoryBtn.textContent =
            "SAVE TO MEMORY";

        actionType.value =
            "SAFETY REVIEW";

        summaryInput.value =
            decision?.scenario?.description ||
            "";

        evidenceInput.value =
            buildEvidenceSummary();

        updatePreview();
    }


    actionType.addEventListener(
        "change",
        updatePreview
    );

    locationInput.addEventListener(
        "input",
        updatePreview
    );

    submitBtn.addEventListener(
        "click",
        submitAction
    );

    memoryBtn.addEventListener(
        "click",
        saveToMemory
    );

    resetBtn.addEventListener(
        "click",
        reset
    );

    loadContext();

});
