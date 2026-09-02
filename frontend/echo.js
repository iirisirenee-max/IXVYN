/* =========================================================
   IXVYN / ECHO
   Field Feedback System
   ========================================================= */

"use strict";


/* =========================================================
   STATE
   ========================================================= */

let civicCase = null;
let feedbackSubmitted = false;


/* =========================================================
   DOM
   ========================================================= */

const sourceStatus =
    document.getElementById("source-status");

const sourceSystem =
    document.getElementById("source-system");

const caseId =
    document.getElementById("case-id");

const condition =
    document.getElementById("condition");

const priority =
    document.getElementById("priority");

const route =
    document.getElementById("route");

const locationValue =
    document.getElementById("location");

const status =
    document.getElementById("status");

const fieldInput =
    document.getElementById("field-input");

const characterCount =
    document.getElementById("character-count");

const submitButton =
    document.getElementById("submit-feedback");

const fieldState =
    document.getElementById("field-state");

const feedbackSection =
    document.getElementById("feedback-section");

const feedbackText =
    document.getElementById("feedback-text");

const feedbackContext =
    document.getElementById("feedback-context");

const feedbackState =
    document.getElementById("feedback-state");

const adaptStatus =
    document.getElementById("adapt-status");

const adaptTitle =
    document.getElementById("adapt-title");

const adaptDescription =
    document.getElementById("adapt-description");


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCivicCase();

        setupFieldInput();

    }
);


/* =========================================================
   LOAD CIVIC CASE
   ========================================================= */

function loadCivicCase() {

    const created =
        sessionStorage.getItem(
            "civic_case_created"
        );


    const storedCaseId =
        sessionStorage.getItem(
            "civic_case_id"
        );


    const storedStatus =
        sessionStorage.getItem(
            "civic_case_status"
        );


    const storedCondition =
        sessionStorage.getItem(
            "civic_case_condition"
        );


    const storedPriority =
        sessionStorage.getItem(
            "civic_case_priority"
        );


    const storedRoute =
        sessionStorage.getItem(
            "civic_case_route"
        );


    const latitude =
        sessionStorage.getItem(
            "civic_case_lat"
        );


    const longitude =
        sessionStorage.getItem(
            "civic_case_lon"
        );


    /*
     * ECHO only becomes active when CIVIC has
     * actually created a case.
     */

    if (
        created !== "true" ||
        !storedCaseId
    ) {

        showWaitingState();

        return;
    }


    civicCase = {

        id:
            storedCaseId,

        status:
            storedStatus || "OPEN",

        condition:
            storedCondition || "UNKNOWN CONDITION",

        priority:
            storedPriority || "MEDIUM",

        route:
            storedRoute || "—",

        latitude:
            latitude
                ? Number(latitude)
                : null,

        longitude:
            longitude
                ? Number(longitude)
                : null

    };


    console.log(
        "[ECHO] CIVIC case received:",
        civicCase
    );


    populateCase(
        civicCase
    );

}


/* =========================================================
   WAITING STATE
   ========================================================= */

function showWaitingState() {

    document.body.dataset.ready =
        "false";


    sourceStatus.textContent =
        "AWAITING CIVIC CASE";


    sourceSystem.textContent =
        "CIVIC / WAITING";


    caseId.textContent =
        "—";


    condition.textContent =
        "—";


    priority.textContent =
        "—";


    route.textContent =
        "—";


    locationValue.textContent =
        "NO COORDINATES";


    status.textContent =
        "WAITING";


    fieldState.textContent =
        "WAITING";


    fieldInput.disabled =
        true;


    fieldInput.placeholder =
        "Create a CIVIC case first...";


    submitButton.disabled =
        true;


    adaptStatus.textContent =
        "AWAITING CIVIC CASE";


    adaptTitle.innerHTML =
        "THE FIELD<br>IS NOT CONNECTED.";


    adaptDescription.textContent =
        "Create a municipal case in CIVIC first. ECHO will then provide the field-feedback channel.";

}


/* =========================================================
   POPULATE CASE
   ========================================================= */

function populateCase(
    data
) {

    document.body.dataset.ready =
        "true";


    sourceStatus.textContent =
        "CIVIC CASE RECEIVED";


    sourceSystem.textContent =
        "CIVIC / ACTIVE";


    caseId.textContent =
        `CIVIC / ${data.id}`;


    condition.textContent =
        formatCondition(
            data.condition
        );


    priority.textContent =
        formatCondition(
            data.priority
        );


    route.textContent =
        formatCondition(
            data.route
        );


    locationValue.textContent =
        formatLocation(
            data.latitude,
            data.longitude
        );


    status.textContent =
        data.status;


    fieldState.textContent =
        "READY";


    fieldInput.disabled =
        false;


    fieldInput.placeholder =
        "Describe what is happening at the location...";


    adaptStatus.textContent =
        "AWAITING FIELD INPUT";


    adaptTitle.innerHTML =
        "THE FIELD<br>HAS NOT SPOKEN.";


    adaptDescription.textContent =
        "Submit a field observation to update the operational context of this incident.";

}


/* =========================================================
   FIELD INPUT
   ========================================================= */

function setupFieldInput() {

    fieldInput.addEventListener(
        "input",
        updateInputState
    );


    submitButton.addEventListener(
        "click",
        submitFeedback
    );


    updateInputState();

}


/* =========================================================
   INPUT STATE
   ========================================================= */

function updateInputState() {

    const text =
        fieldInput.value.trim();


    const length =
        fieldInput.value.length;


    characterCount.textContent =
        `${length} / 500`;


    /*
     * Hard-limit the field report.
     */

    if (length > 500) {

        fieldInput.value =
            fieldInput.value.slice(
                0,
                500
            );

    }


    submitButton.disabled =
        !civicCase ||
        text.length < 3 ||
        feedbackSubmitted;


    if (
        civicCase &&
        text.length >= 3 &&
        !feedbackSubmitted
    ) {

        fieldState.textContent =
            "INPUT READY";

    } else if (
        civicCase &&
        !feedbackSubmitted
    ) {

        fieldState.textContent =
            "READY";

    }

}


/* =========================================================
   SUBMIT FIELD FEEDBACK
   ========================================================= */

function submitFeedback() {

    if (
        !civicCase ||
        feedbackSubmitted
    ) {
        return;
    }


    const text =
        fieldInput.value
            .trim()
            .slice(0, 500);


    if (
        text.length < 3
    ) {
        return;
    }


    feedbackSubmitted =
        true;


    submitButton.disabled =
        true;


    fieldInput.disabled =
        true;


    submitButton.textContent =
        "FEEDBACK RECEIVED";


    fieldState.textContent =
        "RECEIVED";


    feedbackText.textContent =
        text;


    feedbackContext.textContent =
        `CIVIC / ${civicCase.id}`;


    feedbackState.textContent =
        "FIELD UPDATE";


    feedbackSection.hidden =
        false;


    /*
     * Update the operational state.
     */

    status.textContent =
        "FIELD UPDATED";


    adaptStatus.textContent =
        "FIELD FEEDBACK RECEIVED";


    adaptTitle.innerHTML =
        "CONTEXT<br>UPDATED.";


    adaptDescription.textContent =
        "The field observation has been attached to the civic incident and is now available as operational context.";


    document.body.dataset.feedback =
        "true";


    /*
     * Persist the field observation.
     * MEMORY will consume this later.
     */

    sessionStorage.setItem(
        "echo_feedback_submitted",
        "true"
    );


    sessionStorage.setItem(
        "echo_feedback_text",
        text
    );


    sessionStorage.setItem(
        "echo_feedback_timestamp",
        new Date().toISOString()
    );


    sessionStorage.setItem(
        "echo_feedback_case_id",
        civicCase.id
    );


    sessionStorage.setItem(
        "echo_feedback_condition",
        civicCase.condition
    );


    sessionStorage.setItem(
        "echo_feedback_priority",
        civicCase.priority
    );


    sessionStorage.setItem(
        "echo_feedback_route",
        civicCase.route
    );


    console.log(
        "[ECHO] Field feedback received:",
        text
    );


    feedbackSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   FORMAT CONDITION
   ========================================================= */

function formatCondition(
    value
) {

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
   FORMAT LOCATION
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
   DEBUG
   ========================================================= */

window.IXVYN_ECHO = {

    getCase() {
        return civicCase;
    },

    submitFeedback() {
        submitFeedback();
    }

};


console.log(
    "IXVYN ECHO field feedback interface ready."
);
