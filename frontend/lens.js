/* =========================================================
   IXVYN — LENS / ROAD-SCENE OBSERVATION INTELLIGENCE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("IXVYN LENS visual intelligence online.");


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const imageInput = document.getElementById("image-input");
    const uploadZone = document.getElementById("upload-zone");
    const analyzeButton = document.getElementById("analyze-button");

    const inspectionInput = document.getElementById("inspection-input");
    const inspectionPreview = document.getElementById("inspection-preview");
    const previewImage = document.getElementById("preview-image");
    const fileName = document.getElementById("file-name");

    const systemState = document.getElementById("system-state");
    const analysisState = document.getElementById("analysis-state");
    const analysisStatus = document.getElementById("analysis-status");
    const inspectionResults = document.getElementById("inspection-results");

    const resultImage = document.getElementById("result-image");
    const resultDefect = document.getElementById("result-defect");
    const resultConfidence = document.getElementById("result-confidence");
    const resultSeverity = document.getElementById("result-severity");
    const resultPriority = document.getElementById("result-priority");
    const resultDescription = document.getElementById("result-description");
    const resultAction = document.getElementById("result-action");

    const analysisTimer = document.getElementById("analysis-timer");
    const resultProcessingTime = document.getElementById("result-processing-time");

    const resultLat = document.getElementById("result-lat");
    const resultLon = document.getElementById("result-lon");

    const newInspection = document.getElementById("new-inspection");
    const saveMemoryButton = document.getElementById("save-memory");

    const progressVision = document.getElementById("progress-vision");
    const progressClassification = document.getElementById("progress-classification");
    const progressSeverity = document.getElementById("progress-severity");

    const barVision = document.getElementById("bar-vision");
    const barClassification = document.getElementById("bar-classification");
    const barSeverity = document.getElementById("bar-severity");

    const resultOverlay = document.querySelector(".result-overlay");


    /* =====================================================
       STATE
    ===================================================== */

    let selectedFile = null;
    let selectedImageURL = null;

    let currentAnalysisResult = null;

    let currentLatitude = null;
    let currentLongitude = null;

    let analysisRunning = false;
    let memorySaved = false;

    let analysisStartTime = null;
    let analysisElapsedTime = null;
    let analysisTimerInterval = null;


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (
        !imageInput ||
        !uploadZone ||
        !analyzeButton ||
        !inspectionInput ||
        !inspectionPreview ||
        !previewImage ||
        !analysisState ||
        !inspectionResults
    ) {
        console.error(
            "IXVYN LENS: Required interface elements are missing."
        );
        return;
    }


    /* =====================================================
       IMAGE INPUT
       
       IMPORTANT:
       The HTML uses:
       
       <label for="image-input">
       
       We intentionally DO NOT call imageInput.click().
       This preserves mobile file-picker behavior.
    ===================================================== */

    imageInput.addEventListener("change", (event) => {

        const file = event.target.files?.[0];

        if (!file) return;

        processFile(file);
    });


    /* =====================================================
       PROCESS FILE
    ===================================================== */

    function processFile(file) {

        console.log(
            "IXVYN LENS: Processing:",
            file.name
        );

        if (
            !file.type ||
            !file.type.startsWith("image/")
        ) {
            alert("Please select an image file.");
            return;
        }

        selectedFile = file;

        if (selectedImageURL) {
            URL.revokeObjectURL(selectedImageURL);
        }

        selectedImageURL = URL.createObjectURL(file);

        previewImage.src = selectedImageURL;

        if (resultImage) {
            resultImage.src = selectedImageURL;
        }

        if (fileName) {
            fileName.textContent = file.name;
        }

        inspectionPreview.hidden = false;

        analyzeButton.disabled = false;

        systemState.textContent = "FRAME READY";

        uploadZone.classList.add("has-file");

        console.log("IXVYN LENS: FRAME READY.");
    }


    /* =====================================================
       DRAG AND DROP
    ===================================================== */

    uploadZone.addEventListener("dragover", (event) => {

        event.preventDefault();

        uploadZone.classList.add("is-dragging");
    });


    uploadZone.addEventListener("dragleave", () => {

        uploadZone.classList.remove("is-dragging");
    });


    uploadZone.addEventListener("drop", (event) => {

        event.preventDefault();

        uploadZone.classList.remove("is-dragging");

        const file = event.dataTransfer.files?.[0];

        if (!file) return;

        processFile(file);
    });


    /* =====================================================
       ANALYSIS BUTTON
    ===================================================== */

    analyzeButton.addEventListener(
        "click",
        beginAnalysis
    );


    /* =====================================================
       BEGIN ANALYSIS
    ===================================================== */

    async function beginAnalysis() {

        if (
            !selectedFile ||
            analysisRunning
        ) {
            return;
        }

        analysisRunning = true;

        analyzeButton.disabled = true;

        systemState.textContent = "OBSERVING";


        /* -------------------------------------------------
           SHOW ANALYSIS STATE
        ------------------------------------------------- */

        analysisState.hidden = false;

        inspectionInput.hidden = true;

        inspectionPreview.hidden = true;

        inspectionResults.hidden = true;

        analysisState.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        /* -------------------------------------------------
           RESET PROGRESS
        ------------------------------------------------- */

        setProgress(
            progressVision,
            barVision,
            0
        );

        setProgress(
            progressClassification,
            barClassification,
            0
        );

        setProgress(
            progressSeverity,
            barSeverity,
            0
        );

        analysisStatus.textContent = "INITIALIZING";


        try {

            /* -------------------------------------------------
               REAL AI TIMER
            ------------------------------------------------- */

            analysisStartTime = performance.now();

            analysisElapsedTime = null;

            if (analysisTimerInterval) {

                clearInterval(
                    analysisTimerInterval
                );
            }

            if (analysisTimer) {
                analysisTimer.textContent = "0.00s";
            }

            analysisTimerInterval = setInterval(() => {

                if (
                    !Number.isFinite(
                        analysisStartTime
                    )
                ) {
                    return;
                }

                const elapsed =
                    (
                        performance.now() -
                        analysisStartTime
                    ) / 1000;

                if (analysisTimer) {

                    analysisTimer.textContent =
                        `${elapsed.toFixed(2)}s`;
                }

            }, 50);


            /* -------------------------------------------------
               START REAL AI REQUEST IMMEDIATELY
            ------------------------------------------------- */

            const aiRequest =
                analyzeImageWithGemini();


            /* -------------------------------------------------
               VISUAL ANALYSIS
            ------------------------------------------------- */

            await animateProgress(
                progressVision,
                barVision,
                100,
                1100,
                "SCENE PERCEPTION"
            );


            /* -------------------------------------------------
               ROAD / PEOPLE / VEHICLES
            ------------------------------------------------- */

            await animateProgress(
                progressClassification,
                barClassification,
                100,
                900,
                "ROAD / PEOPLE / VEHICLES"
            );


            /* -------------------------------------------------
               INFRASTRUCTURE / INTERACTIONS
            ------------------------------------------------- */

            await animateProgress(
                progressSeverity,
                barSeverity,
                100,
                700,
                "INFRASTRUCTURE / INTERACTIONS"
            );


            /* -------------------------------------------------
               WAIT FOR GEMINI
            ------------------------------------------------- */

            const result = await aiRequest;


            /* -------------------------------------------------
               STOP TIMER
            ------------------------------------------------- */

            if (
                Number.isFinite(
                    analysisStartTime
                )
            ) {

                analysisElapsedTime =
                    (
                        performance.now() -
                        analysisStartTime
                    ) / 1000;
            }

            if (analysisTimerInterval) {

                clearInterval(
                    analysisTimerInterval
                );

                analysisTimerInterval = null;
            }

            if (analysisTimer) {

                analysisTimer.textContent =
                    `${(
                        analysisElapsedTime || 0
                    ).toFixed(2)}s`;
            }

            if (resultProcessingTime) {

                resultProcessingTime.textContent =
                    `${(
                        analysisElapsedTime || 0
                    ).toFixed(2)}s`;
            }


            analysisStatus.textContent =
                "OBSERVATION COMPLETE";


            console.log(
                "IXVYN LENS: REAL AI RESULT:",
                result
            );


            renderResult(result);


            await sleep(500);

            showResults();


        } catch (error) {

            console.error(
                "IXVYN LENS: Analysis failed:",
                error
            );

            if (analysisTimerInterval) {

                clearInterval(
                    analysisTimerInterval
                );

                analysisTimerInterval = null;
            }

            analysisStatus.textContent =
                "ANALYSIS FAILED";

            showAnalysisError(error);

            analysisRunning = false;

            analyzeButton.disabled = false;

            systemState.textContent =
                "ANALYSIS ERROR";

            return;
        }


        analysisRunning = false;
    }


    /* =====================================================
       REAL GEMINI REQUEST
    ===================================================== */

    async function analyzeImageWithGemini() {

        console.log(
            "IXVYN LENS: Preparing image for AI..."
        );


        const preparedImage =
            await prepareImageForAI(
                selectedFile
            );


        console.log(
            "IXVYN LENS: Sending frame to /api/analyze..."
        );


        const response = await fetch(
            "/api/analyze",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    image:
                        preparedImage.data,

                    mimeType:
                        preparedImage.mimeType
                })
            }
        );


        let data = null;

        const responseText =
            await response.text();


        try {

            data =
                responseText
                    ? JSON.parse(
                        responseText
                    )
                    : null;

        } catch (parseError) {

            console.error(
                "IXVYN: /api/analyze returned non-JSON:",
                responseText
            );

            throw new Error(
                `Analysis server returned HTTP ${response.status}.`
            );
        }


        if (!response.ok) {

            console.error(
                "IXVYN: Analysis API error:",
                response.status,
                data
            );

            throw new Error(
                data?.details ||
                data?.error ||
                data?.message ||
                `Gemini analysis failed with HTTP ${response.status}.`
            );
        }


        if (
            !data ||
            data.success === false
        ) {

            throw new Error(
                data?.details ||
                data?.error ||
                data?.message ||
                "No valid analysis result was returned."
            );
        }


        console.log(
            "IXVYN LENS: Gemini analysis received:",
            data
        );


        return data;
    }


    /* =====================================================
       PREPARE IMAGE FOR AI
    ===================================================== */

    function prepareImageForAI(file) {

        return new Promise((resolve, reject) => {

            if (!file) {

                reject(
                    new Error(
                        "No image selected."
                    )
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload = () => {

                const image =
                    new Image();


                image.onload = () => {

                    const MAX_SIZE = 1600;

                    let width =
                        image.naturalWidth;

                    let height =
                        image.naturalHeight;


                    if (
                        width > MAX_SIZE ||
                        height > MAX_SIZE
                    ) {

                        const scale =
                            Math.min(
                                MAX_SIZE / width,
                                MAX_SIZE / height
                            );

                        width =
                            Math.round(
                                width * scale
                            );

                        height =
                            Math.round(
                                height * scale
                            );
                    }


                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width = width;

                    canvas.height = height;


                    const context =
                        canvas.getContext("2d");


                    if (!context) {

                        reject(
                            new Error(
                                "Could not prepare image."
                            )
                        );

                        return;
                    }


                    context.drawImage(
                        image,
                        0,
                        0,
                        width,
                        height
                    );


                    const dataURL =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.82
                        );


                    resolve({
                        data: dataURL,
                        mimeType: "image/jpeg"
                    });
                };


                image.onerror = () => {

                    reject(
                        new Error(
                            "Could not read the selected image."
                        )
                    );
                };


                image.src =
                    reader.result;
            };


            reader.onerror = () => {

                reject(
                    new Error(
                        "Could not load image file."
                    )
                );
            };


            reader.readAsDataURL(file);
        });
    }


    /* =====================================================
       RENDER OBSERVATION
       
       LENS OBSERVES.
       LENS DOES NOT DETERMINE RISK.
       LENS DOES NOT PRESCRIBE INTERVENTIONS.
    ===================================================== */

    function renderResult(result) {

        if (!result) return;

        currentAnalysisResult = result;


        /* -------------------------------------------------
           SAFE VALUE HELPERS
        ------------------------------------------------- */

        const safe = (
            value,
            fallback = "NOT OBSERVABLE"
        ) => {

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
                    .map(
                        ([key, val]) =>
                            `${key.toUpperCase()}: ${
                                val ?? fallback
                            }`
                    )
                    .join(" · ");
            }


            return String(value);
        };


        const list = (value) => {

            if (
                !Array.isArray(value) ||
                !value.length
            ) {
                return "NONE OBSERVED";
            }


            return value
                .map((item) => {

                    if (
                        typeof item === "string"
                    ) {
                        return item;
                    }


                    return (
                        item?.label ||
                        item?.type ||
                        item?.description ||
                        JSON.stringify(item)
                    );
                })
                .join(" · ");
        };


        /* -------------------------------------------------
           ROAD SCENE
        ------------------------------------------------- */

        if (resultDefect) {

            resultDefect.textContent =
                result.sceneType ||
                result.road?.sceneType ||
                "ROAD SCENE";
        }


        /* -------------------------------------------------
           CONFIDENCE
        ------------------------------------------------- */

        if (resultConfidence) {

            const confidence =
                Number(
                    result.confidence
                );


            resultConfidence.textContent =
                Number.isFinite(
                    confidence
                )
                    ? `${Math.round(
                        confidence <= 1
                            ? confidence * 100
                            : confidence
                    )}%`
                    : "UNKNOWN";
        }


        /* -------------------------------------------------
           OBSERVATIONS
        ------------------------------------------------- */

        if (resultSeverity) {

            resultSeverity.textContent =
                result.observations?.length
                    ? list(
                        result.observations
                    )
                    : safe(
                        result.infrastructure,
                        "NO SAFETY JUDGMENT"
                    );
        }


        /* -------------------------------------------------
           EVIDENCE
        ------------------------------------------------- */

        if (resultPriority) {

            const clear =
                result.evidence?.clear || [];

            const uncertain =
                result.evidence?.uncertain || [];


            resultPriority.textContent =
                clear.length ||
                uncertain.length
                    ? `${clear.length} CLEAR / ${uncertain.length} UNCERTAIN`
                    : "FORWARD TO SIGNAL";
        }


        /* -------------------------------------------------
           SCENE SUMMARY
        ------------------------------------------------- */

        if (resultDescription) {

            const lines = [

                result.sceneSummary ||
                result.analysis ||
                "Road-scene observation completed.",

                `ROAD — ${
                    safe(result.road)
                }`,

                `PEOPLE — ${
                    safe(result.people)
                }`,

                `VEHICLES — ${
                    safe(result.vehicles)
                }`,

                `INFRASTRUCTURE — ${
                    safe(result.infrastructure)
                }`,

                `OBSTRUCTIONS — ${
                    list(result.obstructions)
                }`,

                `VISIBILITY — ${
                    safe(result.visibility)
                }`,

                `INTERACTIONS — ${
                    list(result.interactions)
                }`,

                `EVIDENCE — ${
                    safe(result.evidence)
                }`
            ];


            resultDescription.textContent =
                lines.join("\n\n");
        }


        /* -------------------------------------------------
           HANDOFF
        ------------------------------------------------- */

        if (resultAction) {

            resultAction.textContent =
                "Observed evidence is ready for SIGNAL. LENS does not determine risk or prescribe an intervention.";
        }


        /* -------------------------------------------------
           PROCESSING TIME
        ------------------------------------------------- */

        if (resultProcessingTime) {

            resultProcessingTime.textContent =
                Number.isFinite(
                    analysisElapsedTime
                )
                    ? `${analysisElapsedTime.toFixed(2)}s`
                    : "—";
        }


        /* -------------------------------------------------
           IMAGE
        ------------------------------------------------- */

        if (
            resultImage &&
            selectedImageURL
        ) {

            resultImage.src =
                selectedImageURL;
        }


        /* -------------------------------------------------
           LOCATION
        ------------------------------------------------- */

        if (resultLat) {

            resultLat.textContent =
                currentLatitude ?? "—";
        }


        if (resultLon) {

            resultLon.textContent =
                currentLongitude ?? "—";
        }


        /* -------------------------------------------------
           OPTIONAL OBSERVATION BOUNDING BOX
        ------------------------------------------------- */

        if (resultOverlay) {

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );


            const box =
                result.observationBoxes?.[0] ||
                result.boundingBox ||
                result.bounding_box ||
                result.detection;


            if (
                box &&
                typeof box === "object"
            ) {

                const x =
                    Number(
                        box.x ??
                        box.left ??
                        box.x_min
                    );

                const y =
                    Number(
                        box.y ??
                        box.top ??
                        box.y_min
                    );

                const w =
                    Number(
                        box.width ??
                        box.w ??
                        (
                            Number(
                                box.x_max
                            ) -
                            Number(
                                box.x_min
                            )
                        )
                    );

                const h =
                    Number(
                        box.height ??
                        box.h ??
                        (
                            Number(
                                box.y_max
                            ) -
                            Number(
                                box.y_min
                            )
                        )
                    );


                if (
                    [
                        x,
                        y,
                        w,
                        h
                    ].every(
                        Number.isFinite
                    )
                ) {

                    const scale =
                        [
                            x,
                            y,
                            w,
                            h
                        ].every(
                            (value) =>
                                value <= 1
                        )
                            ? 100
                            : (
                                [
                                    x,
                                    y,
                                    w,
                                    h
                                ].every(
                                    (value) =>
                                        value <= 100
                                )
                                    ? 1
                                    : 0.1
                            );


                    resultOverlay.style.display =
                        "block";

                    resultOverlay.style.left =
                        `${x * scale}%`;

                    resultOverlay.style.top =
                        `${y * scale}%`;

                    resultOverlay.style.width =
                        `${w * scale}%`;

                    resultOverlay.style.height =
                        `${h * scale}%`;

                    resultOverlay.setAttribute(
                        "data-ai-detection",
                        "true"
                    );
                }
            }
        }


        /* =================================================
           LENS → SIGNAL
           
           Pass evidence.
           Never pass a LENS-generated risk judgement.
        ================================================= */

        const lensEvidence = {

            source: "LENS",

            schema:
                "IXVYN_SCENE_OBSERVATION_V2",

            timestamp:
                new Date().toISOString(),

            road:
                result.road || {},

            people:
                result.people || {},

            vehicles:
                result.vehicles || {},

            infrastructure:
                result.infrastructure || {},

            obstructions:
                result.obstructions || [],

            visibility:
                result.visibility || {},

            interactions:
                result.interactions || [],

            observations:
                result.observations || [],

            evidence:
                result.evidence || {},

            sceneSummary:
                result.sceneSummary ||
                result.analysis ||
                "Scene observed.",

            confidence:
                Number.isFinite(
                    Number(
                        result.confidence
                    )
                )
                    ? Number(
                        result.confidence
                    )
                    : null,

            location: {
                lat:
                    currentLatitude ?? null,

                lon:
                    currentLongitude ?? null
            }
        };


        sessionStorage.setItem(
            "ixvyn_lens_observation",
            JSON.stringify(
                lensEvidence
            )
        );


        sessionStorage.setItem(
            "ixvyn_signal_trigger",
            "true"
        );


        console.log(
            "IXVYN LENS: Scene observation forwarded to SIGNAL.",
            lensEvidence
        );


        systemState.textContent =
            "SCENE OBSERVED";
    }


    /* =====================================================
       SHOW RESULTS
    ===================================================== */

    function showResults() {

        inspectionResults.hidden =
            false;

        analysisState.hidden =
            true;

        inspectionResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =====================================================
       ANALYSIS ERROR
    ===================================================== */

    function showAnalysisError(error) {

        if (resultDescription) {

            resultDescription.textContent =
                error?.message ||
                "The scene could not be analyzed.";
        }


        if (resultAction) {

            resultAction.textContent =
                "Retry the observation with another frame.";
        }


        inspectionResults.hidden =
            false;

        analysisState.hidden =
            true;
    }


    /* =====================================================
       SAVE OBSERVATION TO MEMORY
    ===================================================== */

    function saveToMemory() {

        if (!currentAnalysisResult) {

            console.warn(
                "IXVYN LENS: Nothing to save."
            );

            return;
        }


        const memoryKey =
            "ixvyn_infrastructure_memory";


        let memory = [];


        try {

            memory =
                JSON.parse(
                    localStorage.getItem(
                        memoryKey
                    ) || "[]"
                );


            if (
                !Array.isArray(memory)
            ) {
                memory = [];
            }

        } catch (error) {

            console.warn(
                "IXVYN LENS: Memory store reset.",
                error
            );

            memory = [];
        }


        const record = {

            id:
                `IX-${Date.now()}`,

            schema:
                "IXVYN_SCENE_OBSERVATION_V2",

            timestamp:
                new Date().toISOString(),

            sceneType:
                currentAnalysisResult.sceneType ||
                currentAnalysisResult.road?.sceneType ||
                "ROAD SCENE",

            confidence:
                currentAnalysisResult.confidence ??
                null,

            road:
                currentAnalysisResult.road ||
                {},

            people:
                currentAnalysisResult.people ||
                {},

            vehicles:
                currentAnalysisResult.vehicles ||
                {},

            infrastructure:
                currentAnalysisResult.infrastructure ||
                {},

            obstructions:
                currentAnalysisResult.obstructions ||
                [],

            visibility:
                currentAnalysisResult.visibility ||
                {},

            interactions:
                currentAnalysisResult.interactions ||
                [],

            observations:
                currentAnalysisResult.observations ||
                [],

            evidence:
                currentAnalysisResult.evidence ||
                {},

            sceneSummary:
                currentAnalysisResult.sceneSummary ||
                currentAnalysisResult.analysis ||
                "",

            latitude:
                currentLatitude,

            longitude:
                currentLongitude,

            /*
             * These fields intentionally begin empty.
             * SIGNAL / TRAJECTORY / MEMORY will populate
             * the later stages of the safety lifecycle.
             */

            riskAssessment:
                null,

            intervention:
                null,

            outcome:
                null,

            status:
                "observed"
        };


        memory.unshift(record);


        /* -------------------------------------------------
           KEEP MEMORY BOUNDED
        ------------------------------------------------- */

        if (
            memory.length > 100
        ) {

            memory =
                memory.slice(
                    0,
                    100
                );
        }


        localStorage.setItem(
            memoryKey,
            JSON.stringify(
                memory
            )
        );


        memorySaved = true;


        if (saveMemoryButton) {

            saveMemoryButton.textContent =
                "SAVED TO MEMORY";

            saveMemoryButton.classList.add(
                "is-saved"
            );
        }


        console.log(
            "IXVYN MEMORY: Observation saved:",
            record
        );
    }


    /* =====================================================
       SAVE BUTTON
    ===================================================== */

    if (saveMemoryButton) {

        saveMemoryButton.addEventListener(
            "click",
            saveToMemory
        );
    }


    /* =====================================================
       NEW INSPECTION
    ===================================================== */

    if (newInspection) {

        newInspection.addEventListener(
            "click",
            resetInspection
        );
    }


    function resetInspection() {

        console.log(
            "IXVYN LENS: Starting new inspection."
        );


        /* -------------------------------------------------
           STOP TIMER
        ------------------------------------------------- */

        if (analysisTimerInterval) {

            clearInterval(
                analysisTimerInterval
            );

            analysisTimerInterval =
                null;
        }


        analysisStartTime = null;

        analysisElapsedTime = null;


        /* -------------------------------------------------
           CLEAN OBJECT URL
        ------------------------------------------------- */

        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );

            selectedImageURL = null;
        }


        /* -------------------------------------------------
           RESET STATE
        ------------------------------------------------- */

        selectedFile = null;

        currentAnalysisResult = null;

        currentLatitude = null;

        currentLongitude = null;

        memorySaved = false;

        analysisRunning = false;


        /* -------------------------------------------------
           RESET INPUT
        ------------------------------------------------- */

        if (imageInput) {

            imageInput.value = "";
        }


        /* -------------------------------------------------
           RESET IMAGES
        ------------------------------------------------- */

        if (previewImage) {

            previewImage.removeAttribute(
                "src"
            );
        }


        if (resultImage) {

            resultImage.removeAttribute(
                "src"
            );
        }


        /* -------------------------------------------------
           RESET FILE NAME
        ------------------------------------------------- */

        if (fileName) {

            fileName.textContent = "";
        }


        /* -------------------------------------------------
           RESET BUTTON
        ------------------------------------------------- */

        if (analyzeButton) {

            analyzeButton.disabled = true;
        }


        /* -------------------------------------------------
           RESET MEMORY BUTTON
        ------------------------------------------------- */

        if (saveMemoryButton) {

            saveMemoryButton.textContent =
                "SAVE OBSERVATION";

            saveMemoryButton.classList.remove(
                "is-saved"
            );
        }


        /* -------------------------------------------------
           RESET OVERLAY
        ------------------------------------------------- */

        if (resultOverlay) {

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );
        }


        /* -------------------------------------------------
           RESET PROGRESS
        ------------------------------------------------- */

        setProgress(
            progressVision,
            barVision,
            0
        );

        setProgress(
            progressClassification,
            barClassification,
            0
        );

        setProgress(
            progressSeverity,
            barSeverity,
            0
        );


        /* -------------------------------------------------
           RESET TIMER
        ------------------------------------------------- */

        if (analysisTimer) {

            analysisTimer.textContent =
                "0.00s";
        }


        if (resultProcessingTime) {

            resultProcessingTime.textContent =
                "—";
        }


        /* -------------------------------------------------
           RESET LOCATION
        ------------------------------------------------- */

        if (resultLat) {

            resultLat.textContent =
                "—";
        }


        if (resultLon) {

            resultLon.textContent =
                "—";
        }


        /* -------------------------------------------------
           RESET SYSTEM
        ------------------------------------------------- */

        systemState.textContent =
            "READY";


        analysisStatus.textContent =
            "WAITING FOR FRAME";


        /* -------------------------------------------------
           RESET PANELS
        ------------------------------------------------- */

        inspectionInput.hidden =
            false;

        inspectionPreview.hidden =
            true;

        analysisState.hidden =
            true;

        inspectionResults.hidden =
            true;


        if (uploadZone) {

            uploadZone.classList.remove(
                "has-file",
                "is-dragging"
            );
        }


        inspectionInput.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        console.log(
            "IXVYN LENS: Ready for new frame."
        );
    }


    /* =====================================================
       PROGRESS HELPERS
    ===================================================== */

    function setProgress(
        progressElement,
        barElement,
        value
    ) {

        const safeValue =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(value) || 0
                )
            );


        if (progressElement) {

            progressElement.textContent =
                `${Math.round(
                    safeValue
                )}%`;
        }


        if (barElement) {

            barElement.style.width =
                `${safeValue}%`;
        }
    }


    /* =====================================================
       ANIMATED PROGRESS
    ===================================================== */

    function animateProgress(
        progressElement,
        barElement,
        target,
        duration,
        statusText
    ) {

        return new Promise(
            (resolve) => {

                const start =
                    performance.now();


                const initial =
                    parseFloat(
                        (
                            progressElement?.textContent ||
                            "0"
                        ).replace(
                            "%",
                            ""
                        )
                    ) || 0;


                if (statusText) {

                    analysisStatus.textContent =
                        statusText;
                }


                function frame(currentTime) {

                    const elapsed =
                        currentTime -
                        start;


                    const rawProgress =
                        Math.min(
                            elapsed /
                            duration,
                            1
                        );


                    const eased =
                        1 -
                        Math.pow(
                            1 -
                            rawProgress,
                            3
                        );


                    const value =
                        initial +
                        (
                            target -
                            initial
                        ) *
                        eased;


                    setProgress(
                        progressElement,
                        barElement,
                        value
                    );


                    if (
                        rawProgress <
                        1
                    ) {

                        requestAnimationFrame(
                            frame
                        );

                    } else {

                        setProgress(
                            progressElement,
                            barElement,
                            target
                        );

                        resolve();
                    }
                }


                requestAnimationFrame(frame);
            }
        );
    }


    /* =====================================================
       SLEEP
    ===================================================== */

    function sleep(milliseconds) {

        return new Promise(
            (resolve) => {

                setTimeout(
                    resolve,
                    milliseconds
                );
            }
        );
    }


    /* =====================================================
       CLEANUP
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (analysisTimerInterval) {

                clearInterval(
                    analysisTimerInterval
                );

                analysisTimerInterval =
                    null;
            }


            if (selectedImageURL) {

                URL.revokeObjectURL(
                    selectedImageURL
                );

                selectedImageURL = null;
            }
        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    systemState.textContent =
        "READY";


    if (analysisStatus) {

        analysisStatus.textContent =
            "WAITING FOR FRAME";
    }


    if (analyzeButton) {

        analyzeButton.disabled =
            true;
    }


    if (analysisState) {

        analysisState.hidden =
            true;
    }


    if (inspectionResults) {

        inspectionResults.hidden =
            true;
    }


    if (inspectionPreview) {

        inspectionPreview.hidden =
            true;
    }


    console.log(
        "IXVYN LENS: Interface initialized."
    );

});
