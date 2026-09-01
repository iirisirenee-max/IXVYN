/* =========================================================
   IXVYN — LENS
   DIAGNOSTIC ENGINE / V2
   ---------------------------------------------------------
   Local diagnostic engine:
   - evaluates the user's actual written evidence
   - rewards specificity, examples, actions and reflection
   - detects uncertainty / vague intent
   - produces prioritized gaps and next evidence
   - keeps the interface/API-free for now
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    console.log("IXVYN LENS online.");

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const steps = document.querySelectorAll(".lens-step");

    const progressLabel = document.getElementById("progress-label");
    const progressCount = document.getElementById("progress-count");

    const intentInput = document.getElementById("intent");
    const intentCount = document.getElementById("intent-count");
    const intentNext = document.getElementById("intent-next");

    const knowledgeInput = document.getElementById("knowledge");
    const experienceInput = document.getElementById("experience");
    const interestInput = document.getElementById("interest");

    const analyzeButton = document.getElementById("analyze-button");

    const stateBack = document.getElementById("state-back");
    const diagnosisBack = document.getElementById("diagnosis-back");

    const metricKnowledge = document.getElementById("metric-knowledge");
    const metricExperience = document.getElementById("metric-experience");
    const metricExposure = document.getElementById("metric-exposure");
    const metricClarity = document.getElementById("metric-clarity");

    const barKnowledge = document.getElementById("bar-knowledge");
    const barExperience = document.getElementById("bar-experience");
    const barExposure = document.getElementById("bar-exposure");
    const barClarity = document.getElementById("bar-clarity");

    const gapList = document.getElementById("gap-list");
    const nextList = document.getElementById("next-list");

    /* =====================================================
       STATE
    ===================================================== */

    const state = {
        currentStep: 1,
        intent: "",
        knowledge: "",
        experience: "",
        interest: "",
        diagnosis: null
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

        state.currentStep = stepNumber;

        steps.forEach((step) => {

            step.classList.toggle(
                "is-active",
                Number(step.dataset.step) === stepNumber
            );

        });

        const information =
            stepInformation[stepNumber];

        if (information) {

            if (progressLabel) {
                progressLabel.textContent =
                    information.label;
            }

            if (progressCount) {
                progressCount.textContent =
                    information.count;
            }

        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    /* =====================================================
       CHARACTER COUNTER
    ===================================================== */

    if (intentInput && intentCount) {

        const updateIntentCount = () => {

            intentCount.textContent =
                `${intentInput.value.length} / 1000`;

        };

        intentInput.addEventListener(
            "input",
            updateIntentCount
        );

        updateIntentCount();

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
       TEXT NORMALIZATION
    ===================================================== */

    function normalize(text) {

        return String(text || "")
            .toLowerCase()
            .replace(
                /[^\p{L}\p{N}\s'-]/gu,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }

    function words(text) {

        const value =
            normalize(text);

        return value
            ? value.split(" ")
            : [];

    }

    function wordCount(text) {

        return words(text).length;

    }

    function sentenceCount(text) {

        const matches =
            String(text || "")
                .match(/[.!?]+/g);

        return Math.max(
            1,
            matches
                ? matches.length
                : 1
        );

    }

    function uniqueWordRatio(text) {

        const list =
            words(text);

        if (!list.length) {
            return 0;
        }

        return (
            new Set(list).size /
            list.length
        );

    }

    function clamp(
        value,
        min = 0,
        max = 100
    ) {

        return Math.max(
            min,
            Math.min(
                max,
                Math.round(value)
            )
        );

    }

    function countMatches(
        text,
        patterns
    ) {

        const value =
            normalize(text);

        return patterns.reduce(
            (count, pattern) => {

                const regex =
                    pattern instanceof RegExp
                        ? pattern
                        : new RegExp(
                            `\\b${pattern}\\b`,
                            "i"
                        );

                return count +
                    (
                        regex.test(value)
                            ? 1
                            : 0
                    );

            },
            0
        );

    }

    /* =====================================================
       EVIDENCE SIGNALS
    ===================================================== */

    const knowledgeSignals = [

        "know",
        "understand",
        "learned",
        "studied",
        "concept",
        "theory",
        "principle",
        "method",
        "research",
        "course",
        "class",
        "book",
        "paper",
        "algorithm",
        "framework",
        "fundamental",
        "basics",
        "foundation"

    ];

    const actionSignals = [

        "built",
        "made",
        "created",
        "worked",
        "tried",
        "tested",
        "designed",
        "developed",
        "implemented",
        "project",
        "prototype",
        "experiment",
        "practiced",
        "practice",
        "solved",
        "used",
        "applied",
        "deployed",
        "volunteered",
        "interned",
        "participated"

    ];

    const exposureSignals = [

        "internship",
        "interned",
        "mentor",
        "mentored",
        "professional",
        "industry",
        "company",
        "workplace",
        "team",
        "client",
        "community",
        "competition",
        "conference",
        "workshop",
        "volunteer",
        "job",
        "role",
        "field",
        "research",
        "real world",
        "real-world"

    ];

    const reflectionSignals = [

        "learned",
        "realized",
        "noticed",
        "discovered",
        "enjoyed",
        "liked",
        "disliked",
        "struggled",
        "difficult",
        "easy",
        "changed",
        "improved",
        "mistake",
        "feedback",
        "because",
        "therefore",
        "however",
        "although"

    ];

    const uncertaintySignals = [

        "maybe",
        "perhaps",
        "not sure",
        "unsure",
        "confused",
        "unclear",
        "don't know",
        "do not know",
        "i think",
        "possibly",
        "whatever",
        "anything",
        "something"

    ];

    const concreteSignals = [

        /\b\d+\b/,
        /\b20\d{2}\b/,
        /\bfirst\b/,
        /\bsecond\b/,
        /\bthird\b/,
        /\bfor example\b/,
        /\bspecifically\b/,
        /\bsuch as\b/,
        /\bbecause\b/,
        /\bwhen\b/,
        /\bafter\b/,
        /\bbefore\b/

    ];

    /* =====================================================
       SIGNAL SCORING
    ===================================================== */

    function evidenceQuality(text) {

        const length =
            String(text || "").trim().length;

        const wc =
            wordCount(text);

        const sentences =
            sentenceCount(text);

        const diversity =
            uniqueWordRatio(text);

        const lengthScore =
            Math.min(
                25,
                length / 14
            );

        const structureScore =
            Math.min(
                15,
                sentences * 4
            );

        const diversityScore =
            Math.min(
                10,
                diversity * 14
            );

        const concreteScore =
            Math.min(
                15,
                countMatches(
                    text,
                    concreteSignals
                ) * 5
            );

        return (
            lengthScore +
            structureScore +
            diversityScore +
            concreteScore +
            Math.min(
                10,
                wc / 12
            )
        );

    }

    /* =====================================================
       KNOWLEDGE SCORE
    ===================================================== */

    function calculateKnowledgeScore(text) {

        const value =
            normalize(text);

        if (!value) {
            return 0;
        }

        const signalScore =
            Math.min(
                30,
                countMatches(
                    value,
                    knowledgeSignals
                ) * 4
            );

        const evidence =
            evidenceQuality(text) *
            0.52;

        const specificity =
            Math.min(
                18,
                countMatches(
                    value,
                    concreteSignals
                ) * 3
            );

        const uncertaintyPenalty =
            Math.min(
                18,
                countMatches(
                    value,
                    uncertaintySignals
                ) * 4
            );

        return clamp(
            25 +
            signalScore +
            evidence +
            specificity -
            uncertaintyPenalty
        );

    }

    /* =====================================================
       EXPERIENCE SCORE
    ===================================================== */

    function calculateExperienceScore(text) {

        const value =
            normalize(text);

        if (!value) {
            return 0;
        }

        const actionScore =
            Math.min(
                42,
                countMatches(
                    value,
                    actionSignals
                ) * 7
            );

        const concreteScore =
            Math.min(
                18,
                countMatches(
                    value,
                    concreteSignals
                ) * 3
            );

        const evidence =
            Math.min(
                22,
                evidenceQuality(text) *
                0.7
            );

        const uncertaintyPenalty =
            Math.min(
                12,
                countMatches(
                    value,
                    uncertaintySignals
                ) * 3
            );

        return clamp(
            10 +
            actionScore +
            concreteScore +
            evidence -
            uncertaintyPenalty
        );

    }

    /* =====================================================
       EXPOSURE SCORE
    ===================================================== */

    function calculateExposureScore(
        experienceText,
        interestText
    ) {

        const experience =
            normalize(experienceText);

        const interest =
            normalize(interestText);

        const exposureSignalsFound =
            countMatches(
                experience,
                exposureSignals
            );

        const realWorldActions =
            countMatches(
                experience,
                [
                    "internship",
                    "interned",
                    "professional",
                    "company",
                    "client",
                    "competition",
                    "volunteer",
                    "workplace",
                    "real world",
                    "real-world"
                ]
            );

        const reflection =
            countMatches(
                interest,
                reflectionSignals
            );

        const evidence =
            Math.min(
                20,
                evidenceQuality(
                    experienceText
                ) * 0.55
            );

        return clamp(
            18 +
            Math.min(
                32,
                exposureSignalsFound * 6
            ) +
            Math.min(
                20,
                realWorldActions * 7
            ) +
            Math.min(
                12,
                reflection * 3
            ) +
            evidence
        );

    }

    /* =====================================================
       CLARITY SCORE
    ===================================================== */

    function calculateClarityScore(
        intentText,
        interestText
    ) {

        const intent =
            normalize(intentText);

        const interest =
            normalize(interestText);

        if (!intent) {
            return 0;
        }

        const intentWords =
            wordCount(intent);

        const intentSpecificity =
            Math.min(
                24,
                intentWords * 1.5
            );

        const uncertainty =
            Math.min(
                30,
                countMatches(
                    `${intent} ${interest}`,
                    uncertaintySignals
                ) * 6
            );

        const directionSignals =
            countMatches(
                `${intent} ${interest}`,
                [
                    "want",
                    "goal",
                    "aim",
                    "learn",
                    "build",
                    "explore",
                    "become",
                    "improve",
                    "understand",
                    "work",
                    "study",
                    "create"
                ]
            );

        const concrete =
            Math.min(
                20,
                countMatches(
                    `${intent} ${interest}`,
                    concreteSignals
                ) * 4
            );

        const structure =
            Math.min(
                15,
                sentenceCount(intentText) * 4
            );

        return clamp(
            30 +
            intentSpecificity +
            Math.min(
                24,
                directionSignals * 4
            ) +
            concrete +
            structure -
            uncertainty
        );

    }

    /* =====================================================
       STEP 01 → STEP 02
    ===================================================== */

    if (intentNext) {

        intentNext.addEventListener(
            "click",
            () => {

                const value =
                    intentInput
                        ? intentInput.value.trim()
                        : "";

                if (!hasText(value)) {

                    markInvalid(
                        intentInput
                    );

                    if (intentInput) {
                        intentInput.focus();
                    }

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
                    knowledgeInput
                        ? knowledgeInput.value.trim()
                        : "";

                const experience =
                    experienceInput
                        ? experienceInput.value.trim()
                        : "";

                const interest =
                    interestInput
                        ? interestInput.value.trim()
                        : "";

                if (!hasText(knowledge)) {

                    markInvalid(
                        knowledgeInput
                    );

                    if (knowledgeInput) {
                        knowledgeInput.focus();
                    }

                    return;
                }

                if (!hasText(experience)) {

                    markInvalid(
                        experienceInput
                    );

                    if (experienceInput) {
                        experienceInput.focus();
                    }

                    return;
                }

                if (!hasText(interest)) {

                    markInvalid(
                        interestInput
                    );

                    if (interestInput) {
                        interestInput.focus();
                    }

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

        const scores = {

            knowledge:
                calculateKnowledgeScore(
                    state.knowledge
                ),

            experience:
                calculateExperienceScore(
                    state.experience
                ),

            exposure:
                calculateExposureScore(
                    state.experience,
                    state.interest
                ),

            clarity:
                calculateClarityScore(
                    state.intent,
                    state.interest
                )

        };

        state.diagnosis =
            scores;

        renderMetric(
            metricKnowledge,
            barKnowledge,
            scores.knowledge
        );

        renderMetric(
            metricExperience,
            barExperience,
            scores.experience
        );

        renderMetric(
            metricExposure,
            barExposure,
            scores.exposure
        );

        renderMetric(
            metricClarity,
            barClarity,
            scores.clarity
        );

        generateGaps(
            scores
        );

        generateNextSteps(
            scores
        );

    }

    /* =====================================================
       RENDER METRIC
    ===================================================== */

    function renderMetric(
        numberElement,
        barElement,
        score
    ) {

        if (
            !numberElement ||
            !barElement
        ) {
            return;
        }

        numberElement.textContent =
            score;

        barElement.style.width =
            "0%";

        requestAnimationFrame(() => {

            setTimeout(() => {

                barElement.style.width =
                    `${score}%`;

            }, 120);

        });

    }

    /* =====================================================
       GAP GENERATION
       -----------------------------------------------------
       Gaps are ranked by severity instead of always
       appearing in a fixed order.
       ===================================================== */

    function generateGaps(scores) {

        if (!gapList) {
            return;
        }

        gapList.innerHTML =
            "";

        const gapDefinitions = [

            {
                key: "knowledge",

                threshold: 58,

                title:
                    "KNOWLEDGE DEPTH",

                description:
                    "Your written evidence shows an area of interest, but the foundations are not yet deep enough to support confident decisions.",

                severity:
                    58 - scores.knowledge
            },

            {
                key: "experience",

                threshold: 58,

                title:
                    "PRACTICAL EXPERIENCE",

                description:
                    "You have interest or understanding, but not enough evidence from actually attempting the work.",

                severity:
                    58 - scores.experience
            },

            {
                key: "exposure",

                threshold: 58,

                title:
                    "FIELD EXPOSURE",

                description:
                    "You have information about the area, but limited evidence of what the field feels like in real situations.",

                severity:
                    58 - scores.exposure
            },

            {
                key: "clarity",

                threshold: 62,

                title:
                    "INTENT CLARITY",

                description:
                    "Your direction contains uncertainty. More exploration may be more useful than committing to a single answer.",

                severity:
                    62 - scores.clarity
            }

        ];

        const gaps =
            gapDefinitions
                .filter(
                    (gap) =>
                        scores[gap.key] <
                        gap.threshold
                )
                .sort(
                    (a, b) =>
                        b.severity -
                        a.severity
                );

        if (gaps.length === 0) {

            gaps.push({

                title:
                    "EVIDENCE DEPTH",

                description:
                    "Your current picture is relatively strong. The remaining uncertainty is best resolved through real-world evidence rather than more speculation."

            });

        }

        gaps
            .slice(0, 4)
            .forEach(
                (gap, index) => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "gap-item";

                    item.style.animationDelay =
                        `${index * 100}ms`;

                    item.innerHTML = `

                        <span class="gap-number">
                            ${String(index + 1).padStart(2, "0")}
                        </span>

                        <span class="gap-title">
                            ${escapeHTML(gap.title)}
                        </span>

                        <span class="gap-description">
                            ${escapeHTML(gap.description)}
                        </span>

                    `;

                    gapList.appendChild(
                        item
                    );

                }
            );

    }

    /* =====================================================
       NEXT EVIDENCE
       -----------------------------------------------------
       Recommendations are tied directly to the weakest
       evidence dimension.
       ===================================================== */

    function generateNextSteps(scores) {

        if (!nextList) {
            return;
        }

        nextList.innerHTML =
            "";

        const candidates = [

            {
                key: "experience",

                score:
                    scores.experience,

                text:
                    "Try one small practical task related to your goal and record what happened."
            },

            {
                key: "exposure",

                score:
                    scores.exposure,

                text:
                    "Speak with someone who works or studies in this area and compare their reality with your expectations."
            },

            {
                key: "knowledge",

                score:
                    scores.knowledge,

                text:
                    "Identify the three foundational concepts you need to understand next."
            },

            {
                key: "clarity",

                score:
                    scores.clarity,

                text:
                    "Explore one adjacent direction before committing to a single path."
            }

        ];

        candidates.sort(
            (a, b) =>
                a.score -
                b.score
        );

        const selected =
            candidates.slice(
                0,
                3
            );

        if (
            selected.every(
                (item) =>
                    item.score >= 65
            )
        ) {

            selected.splice(
                0,
                selected.length,

                {
                    key:
                        "experiment",

                    score:
                        0,

                    text:
                        "Test your current understanding through one real-world experiment."
                },

                {
                    key:
                        "reflection",

                    score:
                        0,

                    text:
                        "Record what you enjoyed, disliked, and want to investigate further."
                },

                {
                    key:
                        "return",

                    score:
                        0,

                    text:
                        "Return to LENS with the new evidence and reassess your state."
                }

            );

        }

        selected.forEach(
            (step, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "next-item";

                item.innerHTML = `

                    <span class="next-number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <p>
                        ${escapeHTML(step.text)}
                    </p>

                `;

                nextList.appendChild(
                    item
                );

            }
        );

    }

    /* =====================================================
       SAFE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

    /* =====================================================
       REASSESS
    ===================================================== */

    if (diagnosisBack) {

        diagnosisBack.addEventListener(
            "click",
            () => {

                showStep(2);

            }
        );

    }

    /* =====================================================
       INPUT INVALID ANIMATION
    ===================================================== */

    const inputStyle =
        document.createElement(
            "style"
        );

    inputStyle.textContent = `

        .input-invalid {

            animation:
                inputShake .35s ease;

            border-color:
                rgba(255,80,80,.65)
                !important;

        }

        @keyframes inputShake {

            0%,
            100% {
                transform:
                    translateX(0);
            }

            25% {
                transform:
                    translateX(-4px);
            }

            75% {
                transform:
                    translateX(4px);
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
