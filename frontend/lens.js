/* =========================================================
   IXVYN — LENS / ROAD-SCENE OBSERVATION INTELLIGENCE
   LENS = OBSERVE
   LENS does NOT calculate risk, severity, priority, or intervention.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("IXVYN LENS: visual intelligence online.");

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
    const analysisTimer = document.getElementById("analysis-timer");

    const inspectionResults =
        document.getElementById("inspection-results");

    const resultImage =
        document.getElementById("result-image");

    const resultOverlay =
        document.getElementById("result-overlay");

    const resultDefect =
        document.getElementById("result-defect");

    const resultConfidence =
        document.getElementById("result-confidence");

    const resultSeverity =
        document.getElementById("result-severity");

    const resultPriority =
        document.getElementById("result-priority");

    const resultProcessingTime =
        document.getElementById("result-processing-time");

    const resultDescription =
        document.getElementById("result-description");

    const resultAction =
        document.getElementById("result-action");

    const resultLat =
        document.getElementById("result-lat");

    const resultLon =
        document.getElementById("result-lon");

    const newInspection =
        document.getElementById("new-inspection");

    const saveMemoryButton =
        document.getElementById("save-memory");

    /* =====================================================
       PROGRESS
    ===================================================== */

    const progressVision =
        document.getElementById("progress-vision");

    const progressClassification =
        document.getElementById("progress-classification");

    const progressSeverity =
        document.getElementById("progress-severity");

    const barVision =
        document.getElementById("bar-vision");

    const barClassification =
        document.getElementById("bar-classification");

    const barSeverity =
        document.getElementById("bar-severity");

    /* =====================================================
       STATE
    ===================================================== */

    let selectedFile = null;
    let selectedImageURL = null;

    let currentAnalysisResult = null;

    let currentLatitude = null;
    let currentLongitude = null;

    let analysisRunning = false;
    let analysisStartTime = null;
    let analysisElapsedTime = null;
    let analysisTimerInterval = null;

    let memorySaved = false;

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
            "IXVYN LENS: required interface element missing."
        );
        return;
    }

    /* =====================================================
       MOBILE-SAFE FILE INPUT

       IMPORTANT:
       uploadZone is already:
       <label for="image-input">

       DO NOT call imageInput.click() here.
       That can cause duplicate picker behaviour on mobile.
    ===================================================== */

    imageInput.addEventListener("change", event => {

        const file = event.target.files?.[0];

        if (!file) return;

        processFile(file);
    });

    /* =====================================================
       PROCESS FILE
    ===================================================== */

    function processFile(file) {

        if (!file.type || !file.type.startsWith("image/")) {

            alert("Please select an image file.");

            return;
        }

        selectedFile = file;

        if (selectedImageURL) {
            URL.revokeObjectURL(selectedImageURL);
        }

        selectedImageURL =
            URL.createObjectURL(file);

        previewImage.src =
            selectedImageURL;

        if (resultImage) {
            resultImage.src =
                selectedImageURL;
        }

        if (fileName) {
            fileName.textContent =
                file.name;
        }

        inspectionPreview.hidden = false;

        analyzeButton.disabled = false;

        uploadZone.classList.add("has-file");

        systemState.textContent =
            "FRAME READY";

        console.log(
            "IXVYN LENS: frame ready.",
            file.name
        );
    }

    /* =====================================================
       DRAG / DROP
    ===================================================== */

    uploadZone.addEventListener("dragover", event => {

        event.preventDefault();

        uploadZone.classList.add("is-dragging");
    });

    uploadZone.addEventListener("dragleave", () => {

        uploadZone.classList.remove("is-dragging");
    });

    uploadZone.addEventListener("drop", event => {

        event.preventDefault();

        uploadZone.classList.remove("is-dragging");

        const file =
            event.dataTransfer?.files?.[0];

        if (!file) return;

        processFile(file);
    });

    /* =====================================================
       ANALYZE
    ===================================================== */

    analyzeButton.addEventListener(
        "click",
        beginAnalysis
    );

    async function beginAnalysis() {

        if (
            !selectedFile ||
            analysisRunning
        ) {
            return;
        }

        analysisRunning = true;

        analyzeButton.disabled = true;

        systemState.textContent =
            "ANALYZING";

        inspectionInput.hidden = true;
        inspectionPreview.hidden = true;

        inspectionResults.hidden = true;
        analysisState.hidden = false;

        analysisState.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

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

        analysisStatus.textContent =
            "INITIALIZING";

        analysisStartTime =
            performance.now();

        analysisElapsedTime = null;

        if (analysisTimerInterval) {
            clearInterval(analysisTimerInterval);
        }

        if (analysisTimer) {
            analysisTimer.textContent =
                "0.00s";
        }

        analysisTimerInterval =
            setInterval(() => {

                if (!Number.isFinite(analysisStartTime)) {
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

        try {

            /*
             * Start the real Gemini request immediately.
             */
            const aiRequest =
                analyzeImageWithGemini();

            /*
             * These are interface stages.
             * The AI request itself is already running.
             */

            await animateProgress(
                progressVision,
                barVision,
                100,
                700,
                "SCENE PERCEPTION"
            );

            await animateProgress(
                progressClassification,
                barClassification,
                100,
                700,
                "ROAD / PEOPLE / VEHICLES"
            );

            await animateProgress(
                progressSeverity,
                barSeverity,
                100,
                700,
                "INFRASTRUCTURE / INTERACTIONS"
            );

            const result =
                await aiRequest;

            if (Number.isFinite(analysisStartTime)) {

                analysisElapsedTime =
                    (
                        performance.now() -
                        analysisStartTime
                    ) / 1000;
            }

            stopTimer();

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

            renderResult(result);

            await sleep(350);

            showResults();

        } catch (error) {

            console.error(
                "IXVYN LENS: analysis failed:",
                error
            );

            stopTimer();

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
       REAL GEMINI API REQUEST
    ===================================================== */

    async function analyzeImageWithGemini() {

        const preparedImage =
            await prepareImageForAI(
                selectedFile
            );

        const response =
            await fetch(
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

        const responseText =
            await response.text();

        let data = null;

        try {

            data =
                responseText
                    ? JSON.parse(responseText)
                    : null;

        } catch (error) {

            console.error(
                "IXVYN: API returned invalid JSON:",
                responseText
            );

            throw new Error(
                `Analysis server returned HTTP ${response.status}.`
            );
        }

        if (!response.ok) {

            throw new Error(
                data?.details ||
                data?.error ||
                data?.message ||
                `Analysis failed with HTTP ${response.status}.`
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
                "No valid observation was returned."
            );
        }

        /*
         * Backend returns:
         * {
         *   success: true,
         *   schema: "...",
         *   ...
         * }
         */

        return data;
    }

    /* =====================================================
       IMAGE PREPARATION
    ===================================================== */

    function prepareImageForAI(file) {

        return new Promise(
            (resolve, reject) => {

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

                        canvas.width =
                            width;

                        canvas.height =
                            height;

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
                                "Could not read selected image."
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
            }
        );
    }

    /* =====================================================
       RENDER OBSERVATION
    ===================================================== */

    function renderResult(result) {

        if (!result) return;

        currentAnalysisResult = result;

        const safe = (
            value,
            fallback = "NOT OBSERVABLE FROM FRAME"
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
                            `${key.toUpperCase()}: ${val ?? fallback}`
                    )
                    .join(" · ");
            }

            return String(value);
        };

        const list = value => {

            if (
                !Array.isArray(value) ||
                !value.length
            ) {
                return "NONE OBSERVED";
            }

            return value
                .map(item => {

                    if (typeof item === "string") {
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

        /* ---------------------------------------------
           SCENE
        --------------------------------------------- */

        if (resultDefect) {

            resultDefect.textContent =
                result.sceneType ||
                result.road?.sceneType ||
                "ROAD SCENE";
        }

        /* ---------------------------------------------
           CONFIDENCE
        --------------------------------------------- */

        if (resultConfidence) {

            const confidence =
                Number(result.confidence);

            resultConfidence.textContent =
                Number.isFinite(confidence)
                    ? `${Math.round(
                        confidence <= 1
                            ? confidence * 100
                            : confidence
                    )}%`
                    : "UNKNOWN";
        }

        /* ---------------------------------------------
           OBSERVATIONS
        --------------------------------------------- */

        if (resultSeverity) {

            resultSeverity.textContent =
                result.observations?.length
                    ? list(result.observations)
                    : safe(
                        result.infrastructure,
                        "NO SPECIFIC OBSERVATIONS"
                    );
        }

        /* ---------------------------------------------
           EVIDENCE
        --------------------------------------------- */

        if (resultPriority) {

            const clear =
                result.evidence?.clear?.length || 0;

            const uncertain =
                result.evidence?.uncertain?.length || 0;

            const notObservable =
                result.evidence?.notObservable?.length || 0;

            resultPriority.textContent =
                `${clear} CLEAR / ${uncertain} UNCERTAIN / ${notObservable} NOT OBSERVABLE`;
        }

        /* ---------------------------------------------
           SCENE SUMMARY
        --------------------------------------------- */

        if (resultDescription) {

            const lines = [

                result.sceneSummary ||
                result.analysis ||
                "Road-scene observation completed.",

                `ROAD — ${safe(result.road)}`,

                `PEOPLE — ${safe(result.people)}`,

                `VEHICLES — ${safe(result.vehicles)}`,

                `INFRASTRUCTURE — ${safe(result.infrastructure)}`,

                `OBSTRUCTIONS — ${list(result.obstructions)}`,

                `VISIBILITY — ${safe(result.visibility)}`,

                `INTERACTIONS — ${list(result.interactions)}`,

                `EVIDENCE — ${safe(result.evidence)}`
            ];

            resultDescription.textContent =
                lines.join("\n\n");
        }

        /* ---------------------------------------------
           HANDOFF
        --------------------------------------------- */

        if (resultAction) {

            resultAction.textContent =
                "Observed evidence is ready for SIGNAL. LENS does not determine risk or prescribe an intervention.";
        }

        /* ---------------------------------------------
           IMAGE
        --------------------------------------------- */

        if (
            resultImage &&
            selectedImageURL
        ) {

            resultImage.src =
                selectedImageURL;
        }

        /* ---------------------------------------------
           LOCATION
        --------------------------------------------- */

        if (resultLat) {

            resultLat.textContent =
                currentLatitude ?? "—";
        }

        if (resultLon) {

            resultLon.textContent =
                currentLongitude ?? "—";
        }

        /* ---------------------------------------------
           OPTIONAL OBSERVATION BOX
        --------------------------------------------- */

        if (resultOverlay) {

            resultOverlay.style.display =
                "none";

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
                            Number(box.x_max) -
                            Number(box.x_min)
                        )
                    );

                const h =
                    Number(
                        box.height ??
                        box.h ??
                        (
                            Number(box.y_max) -
                            Number(box.y_min)
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
                            value => value <= 1
                        )
                            ? 100
                            : (
                                [
                                    x,
                                    y,
                                    w,
                                    h
                                ].every(
                                    value => value <= 100
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
           Evidence only.
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
                    Number(result.confidence)
                )
                    ? Number(result.confidence)
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
            JSON.stringify(lensEvidence)
        );

        sessionStorage.setItem(
            "ixvyn_signal_trigger",
            "true"
        );

        console.log(
            "IXVYN LENS → SIGNAL:",
            lensEvidence
        );

        systemState.textContent =
            "SCENE OBSERVED";
    }

    /* =====================================================
       SHOW RESULTS
    ===================================================== */

    function showResults() {

        analysisState.hidden = true;

        inspectionResults.hidden = false;

        inspectionResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    /* =====================================================
       ERROR
    ===================================================== */

    function showAnalysisError(error) {

        if (resultDescription) {

            resultDescription.textContent =
                "LENS could not complete the observation.\n\n" +
                (
                    error?.message ||
                    "Unknown analysis error."
                );
        }

        if (resultAction) {

            resultAction.textContent =
                "Retry the observation with another road-scene frame.";
        }

        analysisState.hidden = false;
        inspectionResults.hidden = false;
    }

    /* =====================================================
       SAVE TO MEMORY
    ===================================================== */

    if (saveMemoryButton) {

        saveMemoryButton.addEventListener(
            "click",
            saveToMemory
        );
    }

    function saveToMemory() {

        if (!currentAnalysisResult) {

            console.warn(
                "IXVYN MEMORY: nothing to save."
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

            if (!Array.isArray(memory)) {
                memory = [];
            }

        } catch {

            memory = [];
        }

        const result =
            currentAnalysisResult;

        const record = {

            id:
                `IX-${Date.now()}`,

            schema:
                "IXVYN_SCENE_OBSERVATION_V2",

            timestamp:
                new Date().toISOString(),

            sceneType:
                result.sceneType ||
                result.road?.sceneType ||
                "ROAD SCENE",

            confidence:
                result.confidence ?? null,

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
                "",

            latitude:
                currentLatitude,

            longitude:
                currentLongitude,

            /*
             * These belong to later IXVYN systems.
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

        /*
         * Keep browser memory bounded.
         */
        if (memory.length > 100) {

            memory =
                memory.slice(0, 100);
        }

        localStorage.setItem(
            memoryKey,
            JSON.stringify(memory)
        );

        memorySaved = true;

        saveMemoryButton.textContent =
            "SAVED TO MEMORY";

        saveMemoryButton.classList.add(
            "is-saved"
        );

        console.log(
            "IXVYN MEMORY: observation saved.",
            record
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

        stopTimer();

        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );

            selectedImageURL = null;
        }

        selectedFile = null;

        currentAnalysisResult = null;

        currentLatitude = null;
        currentLongitude = null;

        memorySaved = false;

        analysisRunning = false;

        if (imageInput) {
            imageInput.value = "";
        }

        if (previewImage) {
            previewImage.removeAttribute("src");
        }

        if (resultImage) {
            resultImage.removeAttribute("src");
        }

        if (fileName) {
            fileName.textContent = "—";
        }

        analyzeButton.disabled = true;

        if (saveMemoryButton) {

            saveMemoryButton.textContent =
                "SAVE OBSERVATION";

            saveMemoryButton.classList.remove(
                "is-saved"
            );
        }

        if (resultOverlay) {

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );
        }

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

        if (analysisTimer) {
            analysisTimer.textContent =
                "0.00s";
        }

        if (resultProcessingTime) {
            resultProcessingTime.textContent =
                "—";
        }

        if (resultLat) {
            resultLat.textContent =
                "—";
        }

        if (resultLon) {
            resultLon.textContent =
                "—";
        }

        systemState.textContent =
            "READY";

        if (analysisStatus) {
            analysisStatus.textContent =
                "WAITING FOR FRAME";
        }

        inspectionInput.hidden = false;
        inspectionPreview.hidden = true;
        analysisState.hidden = true;
        inspectionResults.hidden = true;

        uploadZone.classList.remove(
            "has-file",
            "is-dragging"
        );

        inspectionInput.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    /* =====================================================
       PROGRESS
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
                `${Math.round(safeValue)}%`;
        }

        if (barElement) {

            barElement.style.width =
                `${safeValue}%`;
        }
    }

    function animateProgress(
        progressElement,
        barElement,
        target,
        duration,
        statusText
    ) {

        return new Promise(resolve => {

            const start =
                performance.now();

            const initial =
                parseFloat(
                    (
                        progressElement?.textContent ||
                        "0"
                    ).replace("%", "")
                ) || 0;

            if (statusText && analysisStatus) {

                analysisStatus.textContent =
                    statusText;
            }

            function frame(now) {

                const elapsed =
                    now - start;

                const raw =
                    Math.min(
                        elapsed / duration,
                        1
                    );

                const eased =
                    1 -
                    Math.pow(
                        1 - raw,
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

                if (raw < 1) {

                    requestAnimationFrame(frame);

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
        });
    }

    /* =====================================================
       TIMER
    ===================================================== */

    function stopTimer() {

        if (analysisTimerInterval) {

            clearInterval(
                analysisTimerInterval
            );

            analysisTimerInterval =
                null;
        }
    }

    /* =====================================================
       SLEEP
    ===================================================== */

    function sleep(milliseconds) {

        return new Promise(resolve => {

            setTimeout(
                resolve,
                milliseconds
            );
        });
    }

    /* =====================================================
       CLEANUP
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            stopTimer();

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

    analyzeButton.disabled = true;

    analysisState.hidden = true;

    inspectionResults.hidden = true;

    inspectionPreview.hidden = true;

    console.log(
        "IXVYN LENS: interface initialized."
    );
});
