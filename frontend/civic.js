/* =========================================================
   IXVYN / CIVIC
   MUNICIPAL ACTION SYSTEM
   ========================================================= */

"use strict";


/* =========================================================
   STATE
   ========================================================= */

let civicEvidence = null;


/* =========================================================
   DOM
   ========================================================= */

const sourceStatus = document.getElementById("source-status");
const sourceSystem = document.getElementById("source-system");

const condition = document.getElementById("condition");
const priority = document.getElementById("priority");
const risk = document.getElementById("risk");
const route = document.getElementById("route");

const locationValue = document.getElementById("location");
const observation = document.getElementById("observation");

const caseTitle = document.getElementById("case-title");
const casePriority = document.getElementById("case-priority");
const caseIssue = document.getElementById("case-issue");
const caseDestination = document.getElementById("case-destination");
const caseResponse = document.getElementById("case-response");
const caseLocation = document.getElementById("case-location");

const recommendedAction = document.getElementById("recommended-action");
const caseStatus = document.getElementById("case-status");
const caseId = document.getElementById("case-id");

const actionStatus = document.getElementById("action-status");
const actionTitle = document.getElementById("action-title");
const actionDescription = document.getElementById("action-description");

const createCaseButton = document.getElementById("create-case");

const caseResult = document.getElementById("case-result");
const confirmedId = document.getElementById("confirmed-id");


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadPathfinderEvidence();

});


/* =========================================================
   LOAD PATHFINDER EVIDENCE
   ========================================================= */

function loadPathfinderEvidence() {

    /*
     * PATHFINDER receives the original LENS evidence.
     * We read the same session state here so the systems
     * remain connected without introducing a backend.
     */

    const defect = sessionStorage.getItem("sih_defect");
    const severity = sessionStorage.getItem("sih_severity");

    const latitude = sessionStorage.getItem("sih_lat");
    const longitude = sessionStorage.getItem("sih_lon");

    const routeDestination =
        sessionStorage.getItem("sih_route") ||
        sessionStorage.getItem("pathfinder_route");

    const routeRisk =
        sessionStorage.getItem("sih_risk") ||
        sessionStorage.getItem("pathfinder_risk");

    const routePriority =
        sessionStorage.getItem("sih_priority") ||
        sessionStorage.getItem("pathfinder_priority");

    const pathfinderReady =
        sessionStorage.getItem("pathfinder_complete") === "true";


    /*
     * If PATHFINDER has not completed a route yet,
     * CIVIC remains in its waiting state.
     */

    if (
        !defect ||
        !severity ||
        !pathfinderReady
    ) {

        showWaitingState();

        return;
    }


    civicEvidence = {

        defect: defect,

        severity: severity,

        latitude: latitude
            ? Number(latitude)
            : null,

        longitude: longitude
            ? Number(longitude)
            : null,

        route: routeDestination || null,

        risk: routeRisk || null,

        priority: routePriority || derivePriority(severity),

        observation:
            "Operational infrastructure evidence forwarded from PATHFINDER."

    };


    console.log(
        "[CIVIC] PATHFINDER evidence received:",
        civicEvidence
    );


    populateEvidence(civicEvidence);

    prepareMunicipalCase(civicEvidence);

}


/* =========================================================
   WAITING STATE
   ========================================================= */

function showWaitingState() {

    document.body.dataset.ready = "false";

    sourceStatus.textContent =
        "AWAITING PATHFINDER EVIDENCE";

    sourceSystem.textContent =
        "PATHFINDER / WAITING";

    actionStatus.textContent =
        "CASE NOT READY";

    actionTitle.innerHTML =
        "WAITING FOR<br>PATHFINDER.";

    actionDescription.textContent =
        "Complete an operational response in PATHFINDER first. CIVIC will then convert that response into a municipal case.";

    createCaseButton.disabled = true;

}


/* =========================================================
   POPULATE EVIDENCE
   ========================================================= */

function populateEvidence(data) {

    document.body.dataset.ready = "true";


    sourceStatus.textContent =
        "PATHFINDER EVIDENCE RECEIVED";

    sourceSystem.textContent =
        "PATHFINDER / RECEIVED";


    condition.textContent =
        formatCondition(data.defect);

    priority.textContent =
        data.priority || "—";

    risk.textContent =
        data.risk || "—";

    route.textContent =
        data.route || "—";


    locationValue.textContent =
        formatLocation(
            data.latitude,
            data.longitude
        );


    observation.textContent =
        data.observation;


    actionStatus.textContent =
        "CASE READY";

    actionTitle.innerHTML =
        "READY FOR<br>MUNICIPAL ACTION.";

    actionDescription.textContent =
        "PATHFINDER has supplied a verified operational route. CIVIC can now convert the evidence into a structured municipal case.";

    createCaseButton.disabled = false;

}


/* =========================================================
   PREPARE MUNICIPAL CASE
   ========================================================= */

function prepareMunicipalCase(data) {

    const title =
        formatCondition(data.defect);


    const destination =
        data.route ||
        deriveDestination(data.defect);


    const response =
        deriveResponse(data.defect);


    caseTitle.textContent =
        title;


    casePriority.textContent =
        data.priority ||
        derivePriority(data.severity);


    caseIssue.textContent =
        title;


    caseDestination.textContent =
        destination;


    caseResponse.textContent =
        response;


    caseLocation.textContent =
        formatLocation(
            data.latitude,
            data.longitude
        );


    recommendedAction.textContent =
        deriveMunicipalAction(
            data.defect,
            data.priority,
            destination
        );


    caseStatus.textContent =
        "READY";


    caseId.textContent =
        "NOT YET CREATED";

}


/* =========================================================
   CREATE CASE
   ========================================================= */

createCaseButton.addEventListener(
    "click",
    createMunicipalCase
);


function createMunicipalCase() {

    if (!civicEvidence) {
        return;
    }


    const generatedId =
        generateCaseId();


    caseId.textContent =
        generatedId;


    caseStatus.textContent =
        "OPEN";


    actionStatus.textContent =
        "CASE CREATED";


    actionTitle.innerHTML =
        "MUNICIPAL CASE<br>IS ACTIVE.";


    actionDescription.textContent =
        "The operational response has been converted into an actionable civic record.";


    createCaseButton.disabled = true;

    createCaseButton.textContent =
        "CASE CREATED";


    confirmedId.textContent =
        "CIVIC / " + generatedId;


    caseResult.hidden = false;


    /*
     * Persist the civic record so MEMORY can use it later.
     */

    sessionStorage.setItem(
        "civic_case_created",
        "true"
    );

    sessionStorage.setItem(
        "civic_case_id",
        generatedId
    );

    sessionStorage.setItem(
        "civic_case_status",
        "OPEN"
    );

    sessionStorage.setItem(
        "civic_case_timestamp",
        new Date().toISOString()
    );


    sessionStorage.setItem(
        "civic_case_condition",
        civicEvidence.defect || ""
    );

    sessionStorage.setItem(
        "civic_case_priority",
        civicEvidence.priority || ""
    );

    sessionStorage.setItem(
        "civic_case_risk",
        civicEvidence.risk || ""
    );

    sessionStorage.setItem(
        "civic_case_route",
        civicEvidence.route || ""
    );

    sessionStorage.setItem(
        "civic_case_lat",
        civicEvidence.latitude ?? ""
    );

    sessionStorage.setItem(
        "civic_case_lon",
        civicEvidence.longitude ?? ""
    );


    caseResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    console.log(
        "[CIVIC] Municipal case created:",
        generatedId
    );

}


/* =========================================================
   PRIORITY
   ========================================================= */

function derivePriority(severity) {

    const value =
        String(severity || "")
            .toUpperCase();


    if (
        value.includes("CRITICAL") ||
        value.includes("HIGH")
    ) {
        return "HIGH";
    }


    if (
        value.includes("MEDIUM") ||
        value.includes("MODERATE")
    ) {
        return "MEDIUM";
    }


    if (
        value.includes("LOW") ||
        value.includes("MINOR")
    ) {
        return "LOW";
    }


    return "MEDIUM";

}


/* =========================================================
   DESTINATION
   ========================================================= */

function deriveDestination(defect) {

    const value =
        String(defect || "")
            .toUpperCase();


    if (
        value.includes("WASTE") ||
        value.includes("OBSTRUCTION") ||
        value.includes("DEBRIS")
    ) {
        return "SANITATION / CLEARANCE";
    }


    return "ROAD MAINTENANCE";

}


/* =========================================================
   RESPONSE
   ========================================================= */

function deriveResponse(defect) {

    const value =
        String(defect || "")
            .toUpperCase();


    if (
        value.includes("WASTE") ||
        value.includes("OBSTRUCTION") ||
        value.includes("DEBRIS")
    ) {
        return "INSPECT → CLEAR → VERIFY";
    }


    return "INSPECT → REPAIR → VERIFY";

}


/* =========================================================
   MUNICIPAL ACTION
   ========================================================= */

function deriveMunicipalAction(
    defect,
    priority,
    destination
) {

    const value =
        String(defect || "")
            .toUpperCase();


    const level =
        String(priority || "")
            .toUpperCase();


    if (
        value.includes("WASTE") ||
        value.includes("OBSTRUCTION") ||
        value.includes("DEBRIS")
    ) {

        if (level === "HIGH") {
            return "Dispatch an immediate clearance and sanitation response. Verify that the obstruction has been removed and access restored.";
        }

        return "Assign the location for inspection and clearance. Verify that the obstruction has been removed.";

    }


    if (level === "HIGH") {

        return "Dispatch an urgent road-maintenance inspection. Assess structural risk, secure the affected area if necessary, complete repairs, and verify the result.";

    }


    return "Assign the location for road-maintenance inspection, complete the required repair, and verify the result.";

}


/* =========================================================
   CONDITION FORMAT
   ========================================================= */

function formatCondition(value) {

    if (!value) {
        return "—";
    }


    return String(value)
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();

}


/* =========================================================
   LOCATION FORMAT
   ========================================================= */

function formatLocation(
    latitude,
    longitude
) {

    if (
        latitude === null ||
        latitude === undefined ||
        longitude === null ||
        longitude === undefined ||
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
    ) {

        return "NO COORDINATES";

    }


    return (
        Number(latitude).toFixed(5) +
        ", " +
        Number(longitude).toFixed(5)
    );

}


/* =========================================================
   CASE ID
   ========================================================= */

function generateCaseId() {

    const now =
        new Date();


    const date =
        now.toISOString()
            .slice(0, 10)
            .replace(/-/g, "");


    const random =
        Math.random()
            .toString(36)
            .slice(2, 6)
            .toUpperCase();


    return (
        date +
        "-" +
        random
    );

}


/* =========================================================
   DEBUG
   ========================================================= */

window.IXVYN_CIVIC = {

    getEvidence() {
        return civicEvidence;
    },

    createCase() {
        createMunicipalCase();
    }

};
