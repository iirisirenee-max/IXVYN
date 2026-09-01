/* =========================================================
   IXVYN — LENS
   DIAGNOSTIC ENGINE / V1
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("IXVYN LENS online.");


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const steps =
        document.querySelectorAll(".lens-step");

    const progressLabel =
        document.getElementById("progress-label");

    const progressCount =
        document.getElementById("progress-count");

    const intentInput =
        document.getElementById("intent");

    const intentCount =
        document.getElementById("intent-count");

    const intentNext =
        document.getElementById("intent-next");

    const knowledgeInput =
        document.getElementById("knowledge");

    const experienceInput =
        document.getElementById("experience");

    const interestInput =
        document.getElementById("interest");

    const analyzeButton =
        document.getElementById("analyze-button");

    const stateBack =
        document.getElementById("state-back");

    const diagnosisBack =
        document.getElementById("diagnosis-back");


    /* =====================================================
       DIAGNOSIS ELEMENTS
    ===================================================== */

    const metricKnowledge =
        document.getElementById("metric-knowledge");

    const metricExperience =
        document.getElementById("metric-experience");

    const metricExposure =
        document.getElementById("metric-exposure");

    const metricClarity =
        document.getElementById("metric-clarity");


    const barKnowledge =
        document.getElementById("bar-knowledge");

    const barExperience =
        document.getElementById("bar-experience");

    const barExposure =
        document.getElementById("bar-exposure");

    const barClarity =
        document.getElementById("bar-clarity");


    const gapList =
        document.getElementById("gap-list");

    const nextList =
        document.getElementById("next-list");


    /* =====================================================
       STATE
    ===================================================== */

    const state = {

        currentStep: 1,

        intent: "",

        knowledge: "",

        experience: "",

        interest: ""

    };


    /* =====================================================
       STEP LABELS
    ===================================================== */

    const stepInformation = {

        1: {
            label: "LENS / 01 — INTENT",
            count: "01 / 03"
        },

        2: {
            label: "LENS / 02 — CURRENT STATE",
            count: "02 / 03"
        },

        3: {
            label: "LENS / 03 — DIAGNOSIS",
            count: "03 / 03"
        }

    };


    /* =====================================================
       SHOW STEP
    ===================================================== */

    function showStep(stepNumber) {

        state.currentStep =
            stepNumber;


        steps.forEach((step) => {

            step.classList.toggle(
                "is-active",
                Number(step.dataset.step) === stepNumber
            );

        });


        const information =
            stepInformation[stepNumber];


        if (information) {

            progressLabel.textContent =
                information.label;

            progressCount.textContent =
                information.count;

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       CHARACTER COUNTER
    ===================================================== */

    if (intentInput) {

        intentInput.addEventListener(
            "input",
            () => {

                intentCount.textContent =
                    `${intentInput.value.length} / 1000`;

            }
        );

    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function hasText(value) {

        return (
            typeof value === "string" &&
            value.trim().length >= 8
        );

    }


    function markInvalid(element) {

        if (!element) return;


        element.classList.add(
            "input-invalid"
        );


        setTimeout(() => {

            element.classList.remove(
                "input-invalid"
            );

        }, 700);

    }


    /* =====================================================
       STEP 01 → STEP 02
    ===================================================== */

    if (intentNext) {

        intentNext.addEventListener(
            "click",
            () => {

                const value =
                    intentInput.value.trim();


                if (!hasText(value)) {

                    markInvalid(
                        intentInput
                    );

                    intentInput.focus();

                    return;
                }


                state.intent =
                    value;


                showStep(2);

            }
        );

    }


    /* =====================================================
       STEP 02 → STEP 01
    ===================================================== */

    if (stateBack) {

        stateBack.addEventListener(
            "click",
            () => {

                showStep(1);

            }
        );

    }


    /* =====================================================
       STEP 02 → ANALYSIS
    ===================================================== */

    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            () => {

                const knowledge =
                    knowledgeInput.value.trim();

                const experience =
                    experienceInput.value.trim();

                const interest =
                    interestInput.value.trim();


                /*
                We don't require perfect answers.

                We only need enough information
                to produce a useful first diagnostic.
                */

                if (!hasText(knowledge)) {

                    markInvalid(
                        knowledgeInput
                    );

                    knowledgeInput.focus();

                    return;
                }


                if (!hasText(experience)) {

                    markInvalid(
                        experienceInput
                    );

                    experienceInput.focus();

                    return;
                }


                if (!hasText(interest)) {

                    markInvalid(
                        interestInput
                    );

                    interestInput.focus();

                    return;
                }


                state.knowledge =
                    knowledge;

                state.experience =
                    experience;

                state.interest =
                    interest;


                analyze();


                showStep(3);

            }
        );

    }


    /* =====================================================
       DIAGNOSTIC ENGINE
       ===================================================== */

    function analyze() {

        const knowledgeLength =
            state.knowledge.length;

        const experienceLength =
            state.experience.length;

        const interestLength =
            state.interest.length;

        const intentLength =
            state.intent.length;


        /*
        V1 uses response depth as a simple
        proxy for diagnostic confidence.

        This is deliberately transparent.

        Later this function can be replaced
        by the actual AI reasoning layer.
        */


        const knowledgeScore =
            calculateKnowledgeScore(
                knowledgeLength
            );


        const experienceScore =
            calculateExperienceScore(
                experienceLength
            );


        const exposureScore =
            calculateExposureScore(
                experienceLength,
                interestLength
            );


        const clarityScore =
            calculateClarityScore(
                intentLength,
                interestLength
            );


        renderMetric(
            metricKnowledge,
            barKnowledge,
            knowledgeScore
        );


        renderMetric(
            metricExperience,
            barExperience,
            experienceScore
        );


        renderMetric(
            metricExposure,
            barExposure,
            exposureScore
        );


        renderMetric(
            metricClarity,
            barClarity,
            clarityScore
        );


        generateGaps(
            knowledgeScore,
            experienceScore,
            exposureScore,
            clarityScore
        );


        generateNextSteps(
            knowledgeScore,
            experienceScore,
            exposureScore,
            clarityScore
        );

    }


    /* =====================================================
       SCORE FUNCTIONS
    ===================================================== */

    function calculateKnowledgeScore(length) {

        if (length < 40) return 25;

        if (length < 100) return 42;

        if (length < 180) return 58;

        if (length < 300) return 72;

        return 84;

    }


    function calculateExperienceScore(length) {

        if (length < 40) return 18;

        if (length < 100) return 32;

        if (length < 180) return 48;

        if (length < 300) return 65;

        return 80;

    }


    function calculateExposureScore(
        experienceLength,
        interestLength
    ) {

        const combined =
            experienceLength +
            interestLength;


        if (combined < 100) return 18;

        if (combined < 220) return 32;

        if (combined < 400) return 49;

        if (combined < 650) return 67;

        return 81;

    }


    function calculateClarityScore(
        intentLength,
        interestLength
    ) {

        const combined =
            intentLength +
            interestLength;


        if (combined < 100) return 30;

        if (combined < 220) return 45;

        if (combined < 400) return 61;

        if (combined < 650) return 76;

        return 88;

    }


    /* =====================================================
       RENDER METRIC
    ===================================================== */

    function renderMetric(
        numberElement,
        barElement,
        score
    ) {

        if (!numberElement ||
            !barElement) {
            return;
        }


        numberElement.textContent =
            score;


        /*
        Delay the bar slightly so the
        diagnostic feels like it is resolving.
        */

        requestAnimationFrame(() => {

            setTimeout(() => {

                barElement.style.width =
                    `${score}%`;

            }, 120);

        });

    }


    /* =====================================================
       GAP GENERATION
    ===================================================== */

    function generateGaps(
        knowledge,
        experience,
        exposure,
        clarity
    ) {

        gapList.innerHTML =
            "";


        const gaps = [];


        if (knowledge < 55) {

            gaps.push({

                title:
                    "KNOWLEDGE DEPTH",

                description:
                    "You have identified an area of interest, but there may still be important concepts or foundations you haven't explored yet."

            });

        }


        if (experience < 55) {

            gaps.push({

                title:
                    "PRACTICAL EXPERIENCE",

                description:
                    "Your current understanding has not yet been matched by enough direct attempts, projects, or real-world experiences."

            });

        }


        if (exposure < 55) {

            gaps.push({

                title:
                    "FIELD EXPOSURE",

                description:
                    "You may know about the subject without yet knowing what working, studying, or participating in the field actually feels like."

            });

        }


        if (clarity < 60) {

            gaps.push({

                title:
                    "INTENT CLARITY",

                description:
                    "Your destination is still somewhat undefined. More exploration may be useful before making a major decision."

            });

        }


        /*
        If the user scores relatively high,
        don't pretend there are artificial gaps.
        */

        if (gaps.length === 0) {

            gaps.push({

                title:
                    "EVIDENCE DEPTH",

                description:
                    "Your starting picture is relatively strong. The remaining uncertainty is best resolved through real-world evidence rather than more speculation."

            });

        }


        gaps
            .slice(0, 4)
            .forEach((gap, index) => {

                const item =
                    document.createElement("div");

                item.className =
                    "gap-item";


                item.style.animationDelay =
                    `${index * 100}ms`;


                item.innerHTML = `

                    <span class="gap-number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <span class="gap-title">
                        ${gap.title}
                    </span>

                    <span class="gap-description">
                        ${gap.description}
                    </span>

                `;


                gapList.appendChild(
                    item
                );

            });

    }


    /* =====================================================
       NEXT EVIDENCE
    ===================================================== */

    function generateNextSteps(
        knowledge,
        experience,
        exposure,
        clarity
    ) {

        nextList.innerHTML =
            "";


        const nextSteps = [];


        if (experience < 55) {

            nextSteps.push(
                "Try one small practical task related to your goal."
            );

        }


        if (exposure < 55) {

            nextSteps.push(
                "Speak with someone who already works or studies in this area."
            );

        }


        if (knowledge < 55) {

            nextSteps.push(
                "Identify the three foundational concepts you need to understand next."
            );

        }


        if (clarity < 60) {

            nextSteps.push(
                "Explore one adjacent direction before committing to a single path."
            );

        }


        /*
        Prevent an empty recommendation list.
        */

        if (nextSteps.length === 0) {

            nextSteps.push(
                "Test your current understanding through a real-world experiment."
            );

            nextSteps.push(
                "Record what you enjoyed, disliked, and want to investigate further."
            );

            nextSteps.push(
                "Return to LENS with the new evidence."
            );

        }


        nextSteps
            .slice(0, 3)
            .forEach((step, index) => {

                const item =
                    document.createElement("div");

                item.className =
                    "next-item";


                item.innerHTML = `

                    <span class="next-number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <p>
                        ${step}
                    </p>

                `;


                nextList.appendChild(
                    item
                );

            });

    }


    /* =====================================================
       REASSESS
    ===================================================== */

    if (diagnosisBack) {

        diagnosisBack.addEventListener(
            "click",
            () => {

                /*
                Keep the user's answers.

                This lets them revisit their
                current state rather than losing
                everything.
                */

                showStep(2);

            }
        );

    }


    /* =====================================================
       INPUT INVALID ANIMATION
    ===================================================== */

    const inputStyle =
        document.createElement("style");


    inputStyle.textContent = `

        .input-invalid {
            animation:
                inputShake
                .35s
                ease;
            border-color:
                rgba(255,80,80,.65) !important;
        }

        @keyframes inputShake {

            0%,
            100% {
                transform: translateX(0);
            }

            25% {
                transform: translateX(-4px);
            }

            75% {
                transform: translateX(4px);
            }

        }

    `;


    document.head.appendChild(
        inputStyle
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    showStep(1);

});
