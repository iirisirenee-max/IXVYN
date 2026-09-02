document.addEventListener("DOMContentLoaded", () => {

    const status =
        document.getElementById("memory-status");

    const historyState =
        document.getElementById("history-state");

    const recordCount =
        document.getElementById("record-count");

    const interventionCount =
        document.getElementById("intervention-count");

    const outcomeCount =
        document.getElementById("outcome-count");

    const locationCount =
        document.getElementById("location-count");

    const timeline =
        document.getElementById("timeline");

    const latestPanel =
        document.getElementById("latest-panel");

    const latestStatus =
        document.getElementById("latest-status");

    const latestTitle =
        document.getElementById("latest-title");

    const latestSummary =
        document.getElementById("latest-summary");

    const latestRisk =
        document.getElementById("latest-risk");

    const latestIntervention =
        document.getElementById("latest-intervention");

    const latestOutcome =
        document.getElementById("latest-outcome");

    const reobserveBtn =
        document.getElementById("reobserve-btn");

    const clearBtn =
        document.getElementById("clear-btn");


    function parse(value) {

        try {
            return JSON.parse(value);
        } catch {
            return null;
        }

    }


    function getRecords() {

        const stored =
            parse(
                localStorage.getItem(
                    "ixvyn_memory_records"
                )
            );

        if (!Array.isArray(stored)) {
            return [];
        }

        return stored;

    }


    function formatDate(timestamp) {

        if (!timestamp) {
            return "TIME UNKNOWN";
        }

        const date =
            new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "TIME UNKNOWN";
        }

        return date.toLocaleString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).toUpperCase();

    }


    function getLocation(record) {

        const location =
            record?.observation?.location ||
            record?.location;

        if (!location) {
            return "LOCATION UNKNOWN";
        }

        if (
            location.lat !== null &&
            location.lat !== undefined &&
            location.lon !== null &&
            location.lon !== undefined
        ) {
            return `${location.lat}, ${location.lon}`;
        }

        if (typeof location === "string") {
            return location;
        }

        return "LOCATION UNKNOWN";

    }


    function getRisk(record) {

        const risk =
            record?.riskAssessment;

        if (!risk) {
            return "UNKNOWN";
        }

        if (
            risk.riskLevel &&
            risk.riskScore !== undefined
        ) {
            return `${risk.riskLevel} / ${risk.riskScore}`;
        }

        return risk.riskLevel ||
            "UNKNOWN";

    }


    function getIntervention(record) {

        const intervention =
            record?.intervention;

        if (!intervention) {
            return "NONE";
        }

        if (typeof intervention === "string") {
            return intervention;
        }

        return (
            intervention.type ||
            intervention.title ||
            "RECORDED"
        );

    }


    function getSummary(record) {

        return (
            record?.observation?.sceneSummary ||
            record?.intervention?.summary ||
            record?.action?.summary ||
            "No summary available."
        );

    }


    function render(records) {

        recordCount.textContent =
            records.length;

        interventionCount.textContent =
            records.filter(
                item =>
                    item.intervention
            ).length;

        outcomeCount.textContent =
            records.filter(
                item =>
                    item.outcome
            ).length;

        const locations =
            new Set(
                records
                    .map(getLocation)
                    .filter(
                        value =>
                            value !==
                            "LOCATION UNKNOWN"
                    )
            );

        locationCount.textContent =
            locations.size;

        if (!records.length) {

            status.textContent =
                "EMPTY";

            historyState.textContent =
                "NO RECORDS";

            timeline.innerHTML = `
                <div class="empty-state">

                    <div class="empty-number">
                        00
                    </div>

                    <div>
                        <h2>
                            MEMORY IS EMPTY.
                        </h2>

                        <p>
                            Complete an observation,
                            assessment, decision, and
                            civic action to begin building
                            the safety record.
                        </p>
                    </div>

                </div>
            `;

            latestPanel.classList.add(
                "hidden"
            );

            return;
        }

        status.textContent =
            "ACTIVE";

        historyState.textContent =
            `${records.length} RECORD${
                records.length === 1 ? "" : "S"
            }`;

        const ordered =
            [...records].sort(
                (a, b) =>
                    new Date(b.timestamp || 0) -
                    new Date(a.timestamp || 0)
            );

        timeline.innerHTML =
            ordered.map(
                (record, index) =>
                    renderRecord(
                        record,
                        index,
                        ordered.length
                    )
            ).join("");

        renderLatest(
            ordered[0]
        );

    }


    function renderRecord(
        record,
        index,
        total
    ) {

        const statusText =
            record.status ||
            "RECORDED";

        const intervention =
            getIntervention(record);

        const outcome =
            record.outcome
                ? "OUTCOME RECORDED"
                : "OUTCOME PENDING";

        return `
            <article class="memory-record">

                <div class="record-index">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                ${
                    index < total - 1
                        ? `<div class="record-line"></div>`
                        : ""
                }

                <div class="record-node"></div>

                <div class="record-main">

                    <h3>
                        ${escapeHTML(
                            getSummary(record)
                        )}
                    </h3>

                    <p>
                        ${
                            escapeHTML(
                                formatDate(
                                    record.timestamp
                                )
                            )
                        }
                    </p>

                    <div class="record-meta">

                        <span>
                            STATE //
                            ${escapeHTML(
                                statusText
                            )}
                        </span>

                        <span>
                            RISK //
                            ${escapeHTML(
                                getRisk(record)
                            )}
                        </span>

                        <span>
                            ACTION //
                            ${escapeHTML(
                                intervention
                            )}
                        </span>

                        <span>
                            ${
                                escapeHTML(
                                    getLocation(record)
                                )
                            }
                        </span>

                        <span>
                            ${
                                escapeHTML(outcome)
                            }
                        </span>

                    </div>

                </div>

            </article>
        `;

    }


    function renderLatest(record) {

        latestPanel.classList.remove(
            "hidden"
        );

        latestStatus.textContent =
            record.status ||
            "RECORDED";

        latestTitle.textContent =
            getLocation(record);

        latestSummary.textContent =
            getSummary(record);

        latestRisk.textContent =
            getRisk(record);

        latestIntervention.textContent =
            getIntervention(record);

        latestOutcome.textContent =
            record.outcome
                ? getOutcomeText(record.outcome)
                : "PENDING";

    }


    function getOutcomeText(outcome) {

        if (!outcome) {
            return "PENDING";
        }

        if (typeof outcome === "string") {
            return outcome;
        }

        return (
            outcome.result ||
            outcome.status ||
            "RECORDED"
        );

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function startReobservation() {

        const latest =
            getRecords()
                .sort(
                    (a, b) =>
                        new Date(b.timestamp || 0) -
                        new Date(a.timestamp || 0)
                )[0];

        if (!latest) {

            alert(
                "There is no location in memory to re-observe yet."
            );

            return;
        }

        sessionStorage.setItem(
            "ixvyn_reobserve_context",
            JSON.stringify(latest)
        );

        /*
         * Return to LENS with the memory context.
         * LENS remains responsible for observing.
         */

        window.location.href =
            "lens.html";

    }


    function clearMemory() {

        const confirmed =
            confirm(
                "Clear all locally stored IXVYN memory records?"
            );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem(
            "ixvyn_memory_records"
        );

        localStorage.removeItem(
            "ixvyn_civic_record"
        );

        sessionStorage.removeItem(
            "ixvyn_memory_latest"
        );

        render([]);

    }


    reobserveBtn.addEventListener(
        "click",
        startReobservation
    );

    clearBtn.addEventListener(
        "click",
        clearMemory
    );


    /*
     * Import the latest CIVIC memory record if
     * CIVIC has just completed an action.
     */

    const latestCivic =
        parse(
            sessionStorage.getItem(
                "ixvyn_memory_latest"
            )
        );

    if (latestCivic) {

        const existing =
            getRecords();

        const exists =
            existing.some(
                record =>
                    record.id ===
                    latestCivic.id
            );

        if (!exists) {

            existing.push(
                latestCivic
            );

            localStorage.setItem(
                "ixvyn_memory_records",
                JSON.stringify(existing)
            );

        }

    }


    render(
        getRecords()
    );

});
