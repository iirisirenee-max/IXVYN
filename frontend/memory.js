/* =========================================================
   IXVYN — MEMORY INTERACTION
   INFRASTRUCTURE MEMORY / SPATIAL RECORD
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "IXVYN MEMORY: Initializing infrastructure memory."
    );


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const STORAGE_KEY =
        "ixvyn_infrastructure_memory";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const memoryState =
        document.getElementById("memory-state");

    const memoryTotal =
        document.getElementById("memory-total");

    const memoryActive =
        document.getElementById("memory-active");

    const memoryLast =
        document.getElementById("memory-last");

    const memoryRecordCount =
        document.getElementById("memory-record-count");

    const memoryEmpty =
        document.getElementById("memory-empty");

    const memoryRecords =
        document.getElementById("memory-records");

    const memoryMapPoints =
        document.getElementById("memory-map-points");

    const clearMemoryButton =
        document.getElementById("clear-memory");


    /* =====================================================
       SAFETY CHECK
       ===================================================== */

    if (
        !memoryTotal ||
        !memoryActive ||
        !memoryLast ||
        !memoryRecordCount ||
        !memoryEmpty ||
        !memoryRecords ||
        !memoryMapPoints
    ) {

        console.warn(
            "IXVYN MEMORY: Required interface elements missing."
        );

        return;
    }


    /* =====================================================
       LOAD MEMORY
       ===================================================== */

    let records =
        loadMemory();

   /* =====================================================
   ECHO — INGEST FIELD FEEDBACK
   ===================================================== */

ingestEchoFeedback();


    /* =====================================================
       INITIALIZE
       ===================================================== */

    renderMemory();


    /* =====================================================
       STORAGE
       ===================================================== */

    function loadMemory() {

        try {

            const stored =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!stored) {
                return [];
            }


            const parsed =
                JSON.parse(stored);


            if (!Array.isArray(parsed)) {
                return [];
            }


            return parsed;

        } catch (error) {

            console.warn(
                "IXVYN MEMORY: Could not load memory.",
                error
            );

            return [];
        }
    }

   /* =====================================================
   ECHO — FIELD FEEDBACK INTO MEMORY
   ===================================================== */

function ingestEchoFeedback() {

    const submitted =
        sessionStorage.getItem(
            "echo_feedback_submitted"
        );

    const feedback =
        sessionStorage.getItem(
            "echo_feedback_text"
        );

    const caseId =
        sessionStorage.getItem(
            "echo_feedback_case_id"
        );


    if (
        submitted !== "true" ||
        !feedback ||
        !caseId
    ) {
        return;
    }


    /*
     * Prevent the same ECHO report from being
     * written into MEMORY more than once.
     */

    const memoryId =
        `ECHO-${caseId}`;


    const alreadyStored =
        records.some(
            record =>
                record.id === memoryId
        );


    if (alreadyStored) {
        return;
    }


    const latitude =
        Number(
            sessionStorage.getItem(
                "civic_case_lat"
            )
        );


    const longitude =
        Number(
            sessionStorage.getItem(
                "civic_case_lon"
            )
        );


    const echoRecord = {

        id:
            memoryId,

        source:
            "ECHO",

        caseId:
            caseId,

        defect:
            sessionStorage.getItem(
                "echo_feedback_condition"
            ) ||
            "FIELD OBSERVATION",

        confidence:
            "",

        severity:
            "FIELD UPDATE",

        priority:
            sessionStorage.getItem(
                "echo_feedback_priority"
            ) ||
            "—",

        route:
            sessionStorage.getItem(
                "echo_feedback_route"
            ) ||
            "—",

        description:
            feedback,

        action:
            "FIELD FEEDBACK RECEIVED",

        latitude:
            Number.isFinite(latitude)
                ? latitude
                : null,

        longitude:
            Number.isFinite(longitude)
                ? longitude
                : null,

        timestamp:
            sessionStorage.getItem(
                "echo_feedback_timestamp"
            ) ||
            new Date().toISOString(),

        status:
            "active"
    };


    records.push(
        echoRecord
    );


    saveMemory();


    console.log(
        "IXVYN MEMORY: ECHO field feedback remembered.",
        echoRecord
    );
}


    /* =====================================================
       SAVE MEMORY
       ===================================================== */

    function saveMemory() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(records)
            );


            console.log(
                "IXVYN MEMORY: Records persisted.",
                records.length
            );


            return true;

        } catch (error) {

            console.error(
                "IXVYN MEMORY: Could not save records.",
                error
            );


            return false;
        }
    }/* =====================================================
       RENDER EVERYTHING
       ===================================================== */

    function renderMemory() {

        updateSummary();

        renderRecords();

        renderMap();

        updateState();

    }


    /* =====================================================
       SUMMARY
       ===================================================== */

    function updateSummary() {

        const total =
            records.length;


        const active =
            records.filter(
                isActiveRecord
            ).length;


        memoryTotal.textContent =
            String(total).padStart(2, "0");


        memoryActive.textContent =
            String(active).padStart(2, "0");


        if (!records.length) {

            memoryLast.textContent =
                "—";

        } else {

            const latest =
                getLatestRecord();


            memoryLast.textContent =
                formatShortDate(
                    latest.timestamp
                );
        }


        memoryRecordCount.textContent =
            `${String(total).padStart(2, "0")} RECORD${total === 1 ? "" : "S"}`;
    }


    /* =====================================================
       ACTIVE RECORD
       ===================================================== */

    function isActiveRecord(record) {

        /*
         * A saved inspection is considered active
         * unless explicitly marked resolved.
         */

        return (
            record.status !== "resolved"
        );
    }


    /* =====================================================
       LATEST RECORD
       ===================================================== */

    function getLatestRecord() {

        return [...records].sort(
            (a, b) => {

                return (
                    new Date(b.timestamp) -
                    new Date(a.timestamp)
                );

            }
        )[0];
    }


    /* =====================================================
       RECORDS
       ===================================================== */

    function renderRecords() {

        memoryRecords.innerHTML =
            "";


        if (!records.length) {

            memoryEmpty.hidden =
                false;

            memoryRecords.hidden =
                true;

            return;
        }


        memoryEmpty.hidden =
            true;

        memoryRecords.hidden =
            false;


        const sortedRecords =
            [...records].sort(
                (a, b) => {

                    return (
                        new Date(b.timestamp) -
                        new Date(a.timestamp)
                    );

                }
            );


        sortedRecords.forEach(
            (record, index) => {

                const element =
                    createRecordElement(
                        record,
                        index
                    );


                memoryRecords.appendChild(
                    element
                );

            }
        );
    }/* =====================================================
       CREATE RECORD
       ===================================================== */

    function createRecordElement(
        record,
        index
    ) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "memory-record";


        const defect =
            cleanText(
                record.defect ||
                "UNKNOWN ANOMALY"
            ).toUpperCase();


        const severity =
            cleanText(
                record.severity ||
                "UNKNOWN"
            ).toUpperCase();


        const priority =
            cleanText(
                record.priority ||
                "—"
            ).toUpperCase();


        const latitude =
            formatCoordinate(
                record.latitude ??
                record.lat
            );


        const longitude =
            formatCoordinate(
                record.longitude ??
                record.lon
            );


        const timestamp =
            formatDate(
                record.timestamp
            );


        const recordNumber =
            String(
                record.sequence ||
                records.length - index
            ).padStart(
                5,
                "0"
            );


        const indexElement =
            document.createElement(
                "div"
            );

        indexElement.className =
            "memory-record-index";

        indexElement.textContent =
            `#${recordNumber}`;


        const defectElement =
            document.createElement(
                "div"
            );

        defectElement.className =
            "memory-record-defect";

        defectElement.textContent =
            defect;


        const metaElement =
            document.createElement(
                "div"
            );

        metaElement.className =
            "memory-record-meta";


        const severityElement =
            document.createElement(
                "span"
            );

        severityElement.textContent =
            `${severity} / ${priority}`;


        applySeverityClass(
            severityElement,
            severity
        );


        const confidenceElement =
            document.createElement(
                "span"
            );

        confidenceElement.textContent =
            formatConfidence(
                record.confidence
            );


        metaElement.appendChild(
            severityElement
        );

        metaElement.appendChild(
            confidenceElement
        );


        const locationElement =
            document.createElement(
                "div"
            );

        locationElement.className =
            "memory-record-location";


        const latElement =
            document.createElement(
                "span"
            );

        latElement.textContent =
            `LAT ${latitude}`;


        const lonElement =
            document.createElement(
                "span"
            );

        lonElement.textContent =
            `LON ${longitude}`;


        locationElement.appendChild(
            latElement
        );

        locationElement.appendChild(
            lonElement
        );


        const dateElement =
            document.createElement(
                "div"
            );

        dateElement.className =
            "memory-record-date";

        dateElement.textContent =
            timestamp;


        article.appendChild(
            indexElement
        );

        article.appendChild(
            defectElement
        );

        article.appendChild(
            metaElement
        );

        article.appendChild(
            locationElement
        );

        article.appendChild(
            dateElement
        );


        /*
         * Clicking a record highlights its
         * corresponding spatial point.
         */

        article.addEventListener(
            "click",
            () => {

                highlightMapPoint(
                    record.id
                );

            }
        );


        return article;
    }


    /* =====================================================
       SEVERITY CLASS
       ===================================================== */

    function applySeverityClass(
        element,
        severity
    ) {

        element.classList.remove(
            "memory-severity-high",
            "memory-severity-medium",
            "memory-severity-low"
        );


        if (
            severity.includes("HIGH") ||
            severity.includes("CRITICAL")
        ) {

            element.classList.add(
                "memory-severity-high"
            );

        } else if (
            severity.includes("MEDIUM")
        ) {

            element.classList.add(
                "memory-severity-medium"
            );

        } else {

            element.classList.add(
                "memory-severity-low"
            );
        }
    }/* =====================================================
       MAP
       ===================================================== */

    function renderMap() {

        memoryMapPoints.innerHTML =
            "";


        if (!records.length) {
            return;
        }


        const validRecords =
            records.filter(
                hasCoordinates
            );


        if (!validRecords.length) {
            return;
        }


        /*
         * Build a relative spatial distribution
         * from the saved coordinates.
         *
         * This is intentionally lightweight:
         * no external map service is required.
         */

        const latitudes =
            validRecords.map(
                record =>
                    Number(
                        record.latitude ??
                        record.lat
                    )
            );


        const longitudes =
            validRecords.map(
                record =>
                    Number(
                        record.longitude ??
                        record.lon
                    )
            );


        const minLat =
            Math.min(...latitudes);

        const maxLat =
            Math.max(...latitudes);

        const minLon =
            Math.min(...longitudes);

        const maxLon =
            Math.max(...longitudes);


        validRecords.forEach(
            (record, index) => {

                const latitude =
                    Number(
                        record.latitude ??
                        record.lat
                    );


                const longitude =
                    Number(
                        record.longitude ??
                        record.lon
                    );


                let x;
                let y;


                /*
                 * If all records are at almost exactly
                 * the same location, place them around
                 * the center instead of dividing by zero.
                 */

                if (
                    Math.abs(
                        maxLon - minLon
                    ) < 0.000001
                ) {

                    x =
                        50 +
                        ((index % 5) - 2) * 7;

                } else {

                    x =
                        15 +
                        (
                            (longitude - minLon) /
                            (maxLon - minLon)
                        ) * 70;
                }


                if (
                    Math.abs(
                        maxLat - minLat
                    ) < 0.000001
                ) {

                    y =
                        50 +
                        ((index % 5) - 2) * 7;

                } else {

                    /*
                     * Latitude increases upward,
                     * therefore invert Y for screen space.
                     */

                    y =
                        85 -
                        (
                            (latitude - minLat) /
                            (maxLat - minLat)
                        ) * 70;
                }


                x =
                    clamp(
                        x,
                        8,
                        92
                    );


                y =
                    clamp(
                        y,
                        8,
                        92
                    );


                const point =
                    document.createElement(
                        "button"
                    );


                point.type =
                    "button";


                point.className =
                    "memory-map-point";


                point.style.left =
                    `${x}%`;


                point.style.top =
                    `${y}%`;


                point.dataset.recordId =
                    record.id;


                point.title =
                    `${cleanText(record.defect || "ANOMALY")} — ${formatShortDate(record.timestamp)}`;


                point.setAttribute(
                    "aria-label",
                    `Inspection ${record.id || index + 1}`
                );


                point.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                        highlightMapPoint(
                            record.id
                        );

                    }
                );


                memoryMapPoints.appendChild(
                    point
                );

            }
        );
    }


    /* =====================================================
       MAP HIGHLIGHT
       ===================================================== */

    function highlightMapPoint(
        recordId
    ) {

        const points =
            memoryMapPoints.querySelectorAll(
                ".memory-map-point"
            );


        points.forEach(
            point => {

                point.classList.remove(
                    "is-selected"
                );

            }
        );


        const target =
            [...points].find(
                point =>
                    point.dataset.recordId ===
                    String(recordId)
            );


        if (!target) {
            return;
        }


        target.classList.add(
            "is-selected"
        );


        target.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });


        setTimeout(
            () => {

                target.classList.remove(
                    "is-selected"
                );

            },
            1800
        );
    }


    /* =====================================================
       CLEAR MEMORY
       ===================================================== */

    if (clearMemoryButton) {

        clearMemoryButton.addEventListener(
            "click",
            () => {

                if (!records.length) {
                    return;
                }


                const confirmed =
                    window.confirm(
                        "Clear all IXVYN infrastructure memory records?"
                    );


                if (!confirmed) {
                    return;
                }


                records =
                    [];


                saveMemory();

                renderMemory();


                memoryState.textContent =
                    "MEMORY CLEARED";


                setTimeout(
                    () => {

                        updateState();

                    },
                    1600
                );

            }
        );
    }


    /* =====================================================
       STATE
       ===================================================== */

    function updateState() {

        if (!memoryState) {
            return;
        }


        if (records.length) {

            memoryState.textContent =
                "ONLINE / RECORDING";

        } else {

            memoryState.textContent =
                "ONLINE";
        }
    }


    /* =====================================================
       COORDINATE VALIDATION
       ===================================================== */

    function hasCoordinates(record) {

        const latitude =
            Number(
                record.latitude ??
                record.lat
            );


        const longitude =
            Number(
                record.longitude ??
                record.lon
            );


        return (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
        );
    }


    /* =====================================================
       FORMAT COORDINATES
       ===================================================== */

    function formatCoordinate(
        value
    ) {

        const number =
            Number(value);


        if (!Number.isFinite(number)) {
            return "UNAVAILABLE";
        }


        return number.toFixed(5);
    }


    /* =====================================================
       UTILITIES & DATA FORMATTERS
       ===================================================== */

    function clamp(value, minimum, maximum) {
        return Math.min(Math.max(value, minimum), maximum);
    }

    function cleanText(text) {
        if (typeof text !== "string") return "";
        return text.replace(/[<>]/g, "").trim();
    }

    function formatConfidence(value) {
        if (value === null || value === undefined || value === "—") return "—";
        const num = parseFloat(value);
        if (Number.isFinite(num)) {
            return num <= 1 ? `${(num * 100).toFixed(1)}%` : `${num.toFixed(1)}%`;
        }
        return String(value);
    }

    function formatDate(isoString) {
        if (!isoString) return "—";
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return "—";
            return date.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }).toUpperCase();
        } catch (e) {
            return "—";
        }
    }

    function formatShortDate(isoString) {
        if (!isoString) return "—";
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return "—";
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit"
            }).toUpperCase();
        } catch (e) {
            return "—";
        }
    }
});
