document.addEventListener("DOMContentLoaded", () => {

    const assessBtn = document.getElementById("assess-btn");
    const resetBtn = document.getElementById("reset-btn");

    const processing = document.getElementById("processing");
    const processingStage = document.getElementById("processing-stage");

    const riskValue = document.getElementById("risk-value");
    const riskLevel = document.getElementById("risk-level");
    const riskHeadline = document.getElementById("risk-headline");
    const riskReasoning = document.getElementById("risk-reasoning");
    const signalStatus = document.getElementById("signal-status");

    const scenarioList = document.getElementById("scenario-list");
    const decisionPanel = document.getElementById("decision-panel");

    const approveBtn = document.getElementById("approve-btn");
    const modifyBtn = document.getElementById("modify-btn");
    const rejectBtn = document.getElementById("reject-btn");

    let lensObservation = null;
    let signalAssessment = null;
    let selectedScenario = null;

    function safeJSON(value) {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }

    function loadInput() {
        lensObservation = safeJSON(
            sessionStorage.getItem("ixvyn_lens_observation")
        );

        signalAssessment = safeJSON(
            sessionStorage.getItem("ixvyn_signal_assessment")
        );

        if (!signalAssessment) {
            const trajectoryInput = safeJSON(
                sessionStorage.getItem("ixvyn_trajectory_input")
            );

            if (trajectoryInput) {
                signalAssessment = trajectoryInput;
            }
        }

        renderSignal();
    }

    function renderSignal() {

        if (!signalAssessment) {
            signalStatus.textContent = "NO SIGNAL";
            return;
        }

        signalStatus.textContent = "SIGNAL RECEIVED";

        const score = Number(signalAssessment.riskScore);

        riskValue.textContent =
            Number.isFinite(score) ? Math.round(score) : "—";

        riskLevel.textContent =
            signalAssessment.riskLevel || "UNKNOWN";

        riskHeadline.textContent =
            signalAssessment.headline ||
            "Safety assessment received.";

        riskReasoning.textContent =
            signalAssessment.reasoning ||
            "No reasoning was supplied by SIGNAL.";
    }

    function setProcessing(active) {
        processing.classList.toggle("hidden", !active);
    }

    function stage(text) {
        processingStage.textContent = text;
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function renderScenarios(scenarios) {

        if (!Array.isArray(scenarios) || !scenarios.length) {
            scenarioList.innerHTML = `
                <div class="empty-state">
                    <span>00</span>
                    <p>
                        No intervention scenarios could be generated
                        from the available evidence.
                    </p>
                </div>
            `;

            return;
        }

        scenarioList.innerHTML = scenarios.map((item, index) => {

            const title =
                item.title ||
                item.name ||
                `INTERVENTION SCENARIO ${index + 1}`;

            const description =
                item.description ||
                item.rationale ||
                "No description supplied.";

            const impact =
                item.expectedImpact ||
                item.impact ||
                "UNKNOWN IMPACT";

            const cost =
                item.budget ||
                item.cost ||
                "UNSPECIFIED";

            const horizon =
                item.timeHorizon ||
                item.timeline ||
                "UNSPECIFIED";

            return `
                <article class="scenario"
                    data-index="${index}">

                    <div class="scenario-top">
                        <span class="scenario-number">
                            ${String(index + 1).padStart(2, "0")}
                            / OPTION
                        </span>

                        <span class="scenario-impact">
                            ${escapeHTML(impact)}
                        </span>
                    </div>

                    <h3>${escapeHTML(title)}</h3>

                    <p>${escapeHTML(description)}</p>

                    <div class="scenario-meta">
                        <span>
                            COST // ${escapeHTML(cost)}
                        </span>

                        <span>
                            HORIZON // ${escapeHTML(horizon)}
                        </span>
                    </div>

                </article>
            `;
        }).join("");

        document.querySelectorAll(".scenario").forEach(card => {

            card.addEventListener("click", () => {

                document
                    .querySelectorAll(".scenario")
                    .forEach(item =>
                        item.classList.remove("selected")
                    );

                card.classList.add("selected");

                selectedScenario =
                    scenarios[Number(card.dataset.index)];

                decisionPanel.classList.remove("hidden");
            });

        });
    }

    async function generateTrajectories() {

        if (!signalAssessment) {
            alert(
                "No SIGNAL assessment found. Complete LENS → SIGNAL first."
            );
            return;
        }

        setProcessing(true);

        try {

            stage("READING SAFETY SIGNAL");
            await delay(500);

            stage("MAPPING CONTRIBUTING CONDITIONS");
            await delay(500);

            stage("GENERATING INTERVENTION SPACE");
            await delay(500);

            const response = await fetch("/api/trajectory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    observation: lensObservation,
                    assessment: signalAssessment
                })
            });

            if (!response.ok) {
                throw new Error(
                    `Trajectory request failed: ${response.status}`
                );
            }

            const data = await response.json();

            if (!data || !Array.isArray(data.scenarios)) {
                throw new Error(
                    "Invalid trajectory response."
                );
            }

            renderScenarios(data.scenarios);

            sessionStorage.setItem(
                "ixvyn_trajectory_scenarios",
                JSON.stringify(data)
            );

            setProcessing(false);

            assessBtn.textContent = "TRAJECTORIES GENERATED";

        } catch (error) {

            console.error(error);

            setProcessing(false);

            alert(
                error.message ||
                "Unable to generate intervention scenarios."
            );
        }
    }

    function approveSelected() {

        if (!selectedScenario) {
            alert("Select an intervention scenario first.");
            return;
        }

        const decision = {
            schema: "IXVYN_HUMAN_DECISION_V1",
            timestamp: new Date().toISOString(),
            decision: "APPROVED",
            scenario: selectedScenario,
            assessment: signalAssessment
        };

        sessionStorage.setItem(
            "ixvyn_human_decision",
            JSON.stringify(decision)
        );

        sessionStorage.setItem(
            "ixvyn_civic_trigger",
            "true"
        );

        window.location.href = "civic.html";
    }

    function modifySelected() {

        if (!selectedScenario) {
            alert("Select an intervention scenario first.");
            return;
        }

        const decision = {
            schema: "IXVYN_HUMAN_DECISION_V1",
            timestamp: new Date().toISOString(),
            decision: "MODIFY",
            scenario: selectedScenario,
            assessment: signalAssessment
        };

        sessionStorage.setItem(
            "ixvyn_human_decision",
            JSON.stringify(decision)
        );

        alert(
            "Modification state recorded. CIVIC can use this decision for the next action step."
        );
    }

    function rejectSelected() {

        if (!selectedScenario) {
            alert("Select an intervention scenario first.");
            return;
        }

        const decision = {
            schema: "IXVYN_HUMAN_DECISION_V1",
            timestamp: new Date().toISOString(),
            decision: "REJECTED",
            scenario: selectedScenario,
            assessment: signalAssessment
        };

        sessionStorage.setItem(
            "ixvyn_human_decision",
            JSON.stringify(decision)
        );

        alert(
            "Scenario rejected. No civic action was triggered."
        );
    }

    function reset() {
        selectedScenario = null;

        scenarioList.innerHTML = `
            <div class="empty-state">
                <span>01</span>
                <p>
                    Assess the observed scene to generate
                    intervention scenarios.
                </p>
            </div>
        `;

        decisionPanel.classList.add("hidden");

        assessBtn.textContent =
            "GENERATE TRAJECTORIES";
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    assessBtn.addEventListener(
        "click",
        generateTrajectories
    );

    resetBtn.addEventListener(
        "click",
        reset
    );

    approveBtn.addEventListener(
        "click",
        approveSelected
    );

    modifyBtn.addEventListener(
        "click",
        modifySelected
    );

    rejectBtn.addEventListener(
        "click",
        rejectSelected
    );

    loadInput();
});
