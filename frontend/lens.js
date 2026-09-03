/* =========================================================
   IXVYN — LENS / ROAD-SCENE OBSERVATION INTELLIGENCE

   LENS = OBSERVE

   LENS observes:
   - road geometry
   - lane markings
   - intersections / crossings
   - people / vulnerable road users
   - vehicles
   - infrastructure
   - road surface / edges
   - visibility
   - obstructions
   - interactions

   LENS DOES NOT:
   - calculate risk
   - assign severity
   - assign priority
   - prescribe interventions

   Output is evidence for SIGNAL.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("IXVYN LENS: visual intelligence online.");

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const imageInput =
        document.getElementById("image-input");

    const uploadZone =
        document.getElementById("upload-zone");

    const analyzeButton =
        document.getElementById("analyze-button");

    const inspectionInput =
        document.getElementById("inspection-input");

    const inspectionPreview =
        document.getElementById("inspection-preview");

    const previewImage =
        document.getElementById("preview-image");

    const fileName =
        document.getElementById("file-name");

    const systemState =
        document.getElementById("system-state");

    const analysisState =
        document.getElementById("analysis-state");

    const analysisStatus =
        document.getElementById("analysis-status");

    const analysisTimer =
        document.getElementById("analysis-timer");

    const inspectionResults =
        document.getElementById("inspection-results");

    const resultImage =
        document.getElementById("result-image");

    const resultOverlay =
        document.getElementById("result-overlay");

    const resultSceneType =
        document.getElementById("result-scene-type");

    const resultConfidence =
        document.getElementById("result-confidence");

    const resultEvidence =
        document.getElementById("result-evidence");

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
       PROGRESS ELEMENTS
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
       REQUIRED ELEMENT CHECK
    ===================================================== */

    const requiredElements = [
        imageInput,
        uploadZone,
        analyzeButton,
        inspectionInput,
        inspectionPreview,
        previewImage,
        analysisState,
        inspectionResults
    ];

    if (requiredElements.some(element => !element)) {

        console.error(
            "IXVYN LENS: required interface element missing."
        );

        return;
    }


    /* =====================================================
       MOBILE-SAFE FILE INPUT

       IMPORTANT:
       uploadZone is a <label for="image-input">.

       Therefore we DO NOT call imageInput.click()
       from the upload-zone handler.

       The browser handles the native picker.
    ===================================================== */

    imageInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }

            processFile(file);
        }
    );


    /* =====================================================
       PROCESS FILE
    ===================================================== */

    function processFile(file) {

        if (
            !file.type ||
            !file.type.startsWith("image/")
        ) {

            alert(
                "Please select an image file."
            );

            return;
        }


        selectedFile = file;


        /* -------------------------------------------------
           Release previous object URL
        ------------------------------------------------- */

        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );
        }


        /* -------------------------------------------------
           Create local preview
        ------------------------------------------------- */

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


        /* -------------------------------------------------
           Update interface
        ------------------------------------------------- */

        inspectionPreview.hidden = false;

        analyzeButton.disabled = false;

        uploadZone.classList.add(
            "has-file"
        );

        uploadZone.classList.remove(
            "is-dragging"
        );

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

    uploadZone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            uploadZone.classList.add(
                "is-dragging"
            );
        }
    );


    uploadZone.addEventListener(
        "dragleave",
        () => {

            uploadZone.classList.remove(
                "is-dragging"
            );
        }
    );


    uploadZone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            uploadZone.classList.remove(
                "is-dragging"
            );

            const file =
                event.dataTransfer?.files?.[0];

            if (!file) {
                return;
            }

            processFile(file);
        }
    );


    /* =====================================================
       ANALYZE BUTTON
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


        /* -------------------------------------------------
           UI STATE
        ------------------------------------------------- */

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


        /* -------------------------------------------------
           Reset progress
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


        if (analysisStatus) {

            analysisStatus.textContent =
                "INITIALIZING";
        }


        /* -------------------------------------------------
           Timer
        ------------------------------------------------- */

        analysisStartTime =
            performance.now();

        analysisElapsedTime = null;

        stopTimer();


        if (analysisTimer) {

            analysisTimer.textContent =
                "0.00s";
        }


        analysisTimerInterval =
            setInterval(
                updateTimer,
                50
            );


        try {

            /* ------------------------------------------------
               Start the real AI request immediately.

               This runs in parallel with the visual
               progress sequence.
            ------------------------------------------------ */

            const aiRequest =
                analyzeImageWithGemini();


            /* ------------------------------------------------
               Visual progress
            ------------------------------------------------ */

            await animateProgress(
                progressVision,
                barVision,
                100,
                650,
                "SCENE PERCEPTION"
            );


            await animateProgress(
                progressClassification,
                barClassification,
                100,
                650,
                "ROAD / PEOPLE / VEHICLES"
            );


            await animateProgress(
                progressSeverity,
                barSeverity,
                100,
                650,
                "INFRASTRUCTURE / INTERACTIONS"
            );


            /* ------------------------------------------------
               Wait for actual AI result
            ------------------------------------------------ */

            const result =
                await aiRequest;


            /* ------------------------------------------------
               Finish timer
            ------------------------------------------------ */

            analysisElapsedTime =
                (
                    performance.now() -
                    analysisStartTime
                ) / 1000;


            stopTimer();


            if (analysisTimer) {

                analysisTimer.textContent =
                    `${analysisElapsedTime.toFixed(2)}s`;
            }


            if (resultProcessingTime) {

                resultProcessingTime.textContent =
                    `${analysisElapsedTime.toFixed(2)}s`;
            }


            if (analysisStatus) {

                analysisStatus.textContent =
                    "OBSERVATION COMPLETE";
            }


            /* ------------------------------------------------
               Render
            ------------------------------------------------ */

            renderResult(result);


            await sleep(350);


            showResults();


            analysisRunning = false;

            systemState.textContent =
                "SCENE OBSERVED";


        } catch (error) {

            console.error(
                "IXVYN LENS: analysis failed:",
                error
            );


            stopTimer();


            if (analysisStatus) {

                analysisStatus.textContent =
                    "ANALYSIS FAILED";
            }


            showAnalysisError(error);


            analysisRunning = false;

            analyzeButton.disabled = false;

            systemState.textContent =
                "ANALYSIS ERROR";
        }
    }


    /* =====================================================
       GEMINI / BACKEND REQUEST
    ===================================================== */

    async function analyzeImageWithGemini() {

        if (!selectedFile) {

            throw new Error(
                "No image selected."
            );
        }


        /* -------------------------------------------------
           Compress / resize locally before upload.

           This keeps payloads smaller and reduces memory
           pressure on phones and laptops.
        ------------------------------------------------- */

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
                "IXVYN LENS: invalid JSON from API:",
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
         * Support both:
         *
         * {
         *   success: true,
         *   sceneType: ...
         * }
         *
         * and:
         *
         * {
         *   success: true,
         *   result: {
         *      sceneType: ...
         *   }
         * }
         */

        return (
            data.result ||
            data.observation ||
            data.data ||
            data
        );
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

                        const MAX_SIZE =
                            1600;


                        let width =
                            image.naturalWidth;

                        let height =
                            image.naturalHeight;


                        /* -----------------------------------------
                           Keep the image reasonably sized.
                        ----------------------------------------- */

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
                            canvas.getContext(
                                "2d"
                            );


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

                            data:
                                dataURL,

                            mimeType:
                                "image/jpeg"
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

        if (!result) {
            return;
        }


        currentAnalysisResult =
            result;


        /* -------------------------------------------------
           Helpers
        ------------------------------------------------- */

        const text = (
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

            return String(value);
        };


        const list = (
            value,
            fallback = "NONE OBSERVED"
        ) => {

            if (
                !Array.isArray(value) ||
                value.length === 0
            ) {

                return fallback;
            }


            return value
                .map(item => {

                    if (
                        typeof item === "string"
                    ) {

                        return item;
                    }


                    return (
                        item?.label ||
                        item?.type ||
                        item?.description ||
                        item?.name ||
                        ""
                    );
                })
                .filter(Boolean)
                .join(" · ");
        };


        const objectSummary = (
            value,
            fallback = "NOT OBSERVABLE"
        ) => {

            if (
                value === null ||
                value === undefined
            ) {

                return fallback;
            }


            if (
                typeof value === "string"
            ) {

                return value;
            }


            if (
                Array.isArray(value)
            ) {

                return list(
                    value,
                    fallback
                );
            }


            if (
                typeof value === "object"
            ) {

                const parts =
                    Object.entries(value)
                        .map(
                            ([key, val]) => {

                                if (
                                    val === null ||
                                    val === undefined ||
                                    val === ""
                                ) {

                                    return null;
                                }


                                if (
                                    Array.isArray(val)
                                ) {

                                    return (
                                        `${formatKey(key)}: ` +
                                        list(val)
                                    );
                                }


                                if (
                                    typeof val === "object"
                                ) {

                                    return (
                                        `${formatKey(key)}: ` +
                                        objectSummary(
                                            val
                                        )
                                    );
                                }


                                return (
                                    `${formatKey(key)}: ${val}`
                                );
                            }
                        )
                        .filter(Boolean);


                return parts.length
                    ? parts.join(" · ")
                    : fallback;
            }


            return String(value);
        };


        const formatKey = key => {

            return String(key)
                .replace(
                    /([A-Z])/g,
                    " $1"
                )
                .replace(
                    /[_-]+/g,
                    " "
                )
                .trim()
                .toUpperCase();
        };


        const set = (
            id,
            value,
            fallback
        ) => {

            const element =
                document.getElementById(id);


            if (!element) {
                return;
            }


            element.textContent =
                text(
                    value,
                    fallback
                );
        };


        /* =================================================
           NORMALIZED DATA
        ================================================= */

        const road =
            result.road || {};

        const people =
            result.people || {};

        const vehicles =
            result.vehicles || {};

        const infrastructure =
            result.infrastructure || {};

        const visibility =
            result.visibility || {};

        const evidence =
            result.evidence || {};


        /* =================================================
           SCENE IDENTITY
        ================================================= */

        const sceneType =
            result.sceneType ||
            road.sceneType ||
            result.scene ||
            "ROAD SCENE";


        if (resultSceneType) {

            resultSceneType.textContent =
                sceneType;
        }


        /* =================================================
           CONFIDENCE

           This is observation confidence,
           NOT safety risk.
        ================================================= */

        if (resultConfidence) {

            const rawConfidence =
                Number(
                    result.confidence
                );


            if (
                Number.isFinite(
                    rawConfidence
                )
            ) {

                const percentage =
                    rawConfidence <= 1
                        ? rawConfidence * 100
                        : rawConfidence;


                resultConfidence.textContent =
                    `${Math.round(
                        Math.max(
                            0,
                            Math.min(
                                100,
                                percentage
                            )
                        )
                    )}%`;

            } else {

                resultConfidence.textContent =
                    "UNKNOWN";
            }
        }


        /* =================================================
           EVIDENCE SUMMARY
        ================================================= */

        const clearCount =
            Array.isArray(
                evidence.clear
            )
                ? evidence.clear.length
                : 0;


        const uncertainCount =
            Array.isArray(
                evidence.uncertain
            )
                ? evidence.uncertain.length
                : 0;


        const unknownCount =
            Array.isArray(
                evidence.notObservable
            )
                ? evidence.notObservable.length
                : 0;


        if (resultEvidence) {

            resultEvidence.textContent =
                `${clearCount} CLEAR / ` +
                `${uncertainCount} UNCERTAIN / ` +
                `${unknownCount} NOT OBSERVABLE`;
        }


        /* =================================================
           SCENE SUMMARY
        ================================================= */

        if (resultDescription) {

            const summary =
                result.sceneSummary ||
                result.analysis ||
                "Road-scene observation completed.";


            resultDescription.textContent =
                summary;
        }


        /* =================================================
           ROAD OBSERVATIONS
        ================================================= */

        set(
            "obs-road-geometry",
            road.geometry,
            "NOT OBSERVABLE"
        );


        set(
            "obs-road-markings",
            road.laneMarkings,
            "NOT OBSERVABLE"
        );


        set(
            "obs-road-intersection",
            road.intersection,
            "UNKNOWN"
        );


        set(
            "obs-road-crossing",
            road.crossing,
            "UNKNOWN"
        );


        /* =================================================
           PEOPLE
        ================================================= */

        set(
            "obs-people-presence",
            people.presence,
            "UNKNOWN"
        );


        set(
            "obs-people-vulnerable",
            list(
                people.vulnerableRoadUsers
            ),
            "NONE OBSERVED"
        );


        /* =================================================
           VEHICLES
        ================================================= */

        set(
            "obs-vehicles-presence",
            vehicles.presence,
            "UNKNOWN"
        );


        set(
            "obs-vehicles-types",
            list(
                vehicles.types
            ),
            "NONE OBSERVED"
        );


        /* =================================================
           INFRASTRUCTURE
        ================================================= */

        set(
            "obs-road-surface",
            infrastructure.roadSurface,
            "NOT OBSERVABLE"
        );


        set(
            "obs-road-edge",
            infrastructure.roadEdge,
            "NOT OBSERVABLE"
        );


        set(
            "obs-lighting",
            infrastructure.lighting,
            "NOT OBSERVABLE"
        );


        /* =================================================
           VISIBILITY
        ================================================= */

        set(
            "obs-visibility-state",
            visibility.state,
            "UNKNOWN"
        );


        set(
            "obs-visibility-factors",
            list(
                visibility.factors
            ),
            "NONE OBSERVED"
        );


        /* =================================================
           INTERACTIONS

           We display what the model observed.

           We do NOT convert this into risk.
        ================================================= */

        set(
            "obs-interactions",
            list(
                result.interactions
            ),
            "NONE OBSERVED"
        );


        /* =================================================
           EVIDENCE MATRIX
        ================================================= */

        set(
            "evidence-clear",
            clearCount,
            "0"
        );


        set(
            "evidence-uncertain",
            uncertainCount,
            "0"
        );


        set(
            "evidence-unknown",
            unknownCount,
            "0"
        );


        /* =================================================
           HANDOFF → SIGNAL
        ================================================= */

        if (resultAction) {

            resultAction.textContent =
                "Observed evidence is ready for SIGNAL. " +
                "LENS does not determine risk or prescribe an intervention.";
        }


        /* =================================================
           IMAGE
        ================================================= */

        if (
            resultImage &&
            selectedImageURL
        ) {

            resultImage.src =
                selectedImageURL;
        }


        /* =================================================
           LOCATION

           LENS records location only when available.
           It does not invent coordinates.
        ================================================= */

        if (resultLat) {

            resultLat.textContent =
                currentLatitude ??
                "NOT RECORDED";
        }


        if (resultLon) {

            resultLon.textContent =
                currentLongitude ??
                "NOT RECORDED";
        }


        /* =================================================
           OPTIONAL VISUAL OVERLAY

           Only show a box if the backend actually supplied
           one. Never invent one.
        ================================================= */

        renderObservationOverlay(
            result
        );


        /* =================================================
           LENS → SIGNAL HANDOFF DATA

           Evidence only.
        ================================================= */

        const lensEvidence = {

            source:
                "LENS",

            schema:
                "IXVYN_SCENE_OBSERVATION_V2",

            timestamp:
                new Date().toISOString(),

            sceneType:
                sceneType,

            road:
                road,

            people:
                people,

            vehicles:
                vehicles,

            infrastructure:
                infrastructure,

            obstructions:
                result.obstructions || [],

            visibility:
                visibility,

            interactions:
                result.interactions || [],

            observations:
                result.observations || [],

            evidence:
                evidence,

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


        try {

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

        } catch (error) {

            console.warn(
                "IXVYN LENS: could not write SIGNAL handoff.",
                error
            );
        }


        console.log(
            "IXVYN LENS → SIGNAL:",
            lensEvidence
        );


        systemState.textContent =
            "SCENE OBSERVED";
    }


    /* =====================================================
       OPTIONAL OBSERVATION OVERLAY
    ===================================================== */

    function renderObservationOverlay(result) {

        if (!resultOverlay) {
            return;
        }


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
            !box ||
            typeof box !== "object"
        ) {

            return;
        }


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


        const width =
            Number(
                box.width ??
                box.w ??
                (
                    Number(box.x_max) -
                    Number(box.x_min)
                )
            );


        const height =
            Number(
                box.height ??
                box.h ??
                (
                    Number(box.y_max) -
                    Number(box.y_min)
                )
            );


        if (
            ![
                x,
                y,
                width,
                height
            ].every(
                Number.isFinite
            )
        ) {

            return;
        }


        /*
         * Support:
         *
         * 0–1 normalized coordinates
         * 0–100 percentage coordinates
         *
         * Anything else is left alone rather than
         * pretending we know the coordinate system.
         */

        let scale = null;


        if (
            [
                x,
                y,
                width,
                height
            ].every(
                value =>
                    value >= 0 &&
                    value <= 1
            )
        ) {

            scale = 100;

        } else if (
            [
                x,
                y,
                width,
                height
            ].every(
                value =>
                    value >= 0 &&
                    value <= 100
            )
        ) {

            scale = 1;
        }


        if (scale === null) {

            return;
        }


        resultOverlay.style.display =
            "block";


        resultOverlay.style.left =
            `${x * scale}%`;


        resultOverlay.style.top =
            `${y * scale}%`;


        resultOverlay.style.width =
            `${width * scale}%`;


        resultOverlay.style.height =
            `${height * scale}%`;


        resultOverlay.setAttribute(
            "data-ai-detection",
            "true"
        );
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
       ERROR STATE
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
                result.confidence ??
                null,

            road:
                result.road ||
                {},

            people:
                result.people ||
                {},

            vehicles:
                result.vehicles ||
                {},

            infrastructure:
                result.infrastructure ||
                {},

            obstructions:
                result.obstructions ||
                [],

            visibility:
                result.visibility ||
                {},

            interactions:
                result.interactions ||
                [],

            observations:
                result.observations ||
                [],

            evidence:
                result.evidence ||
                {},

            sceneSummary:
                result.sceneSummary ||
                result.analysis ||
                "",

            latitude:
                currentLatitude,

            longitude:
                currentLongitude,


            /*
             * These are deliberately empty.
             *
             * SIGNAL / TRAJECTORY / CIVIC own these later.
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


        memory.unshift(
            record
        );


        /* -------------------------------------------------
           Keep browser memory bounded.
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


        try {

            localStorage.setItem(
                memoryKey,
                JSON.stringify(
                    memory
                )
            );

        } catch (error) {

            console.error(
                "IXVYN MEMORY: could not save observation.",
                error
            );

            return;
        }


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


        /* -------------------------------------------------
           Release object URL
        ------------------------------------------------- */

        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );

            selectedImageURL =
                null;
        }


        /* -------------------------------------------------
           Reset state
        ------------------------------------------------- */

        selectedFile =
            null;

        currentAnalysisResult =
            null;

        currentLatitude =
            null;

        currentLongitude =
            null;

        analysisRunning =
            false;

        memorySaved =
            false;


        /* -------------------------------------------------
           Reset file input
        ------------------------------------------------- */

        if (imageInput) {

            imageInput.value =
                "";
        }


        /* -------------------------------------------------
           Reset images
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


        if (fileName) {

            fileName.textContent =
                "—";
        }


        /* -------------------------------------------------
           Reset controls
        ------------------------------------------------- */

        analyzeButton.disabled =
            true;


        if (saveMemoryButton) {

            saveMemoryButton.textContent =
                "SAVE OBSERVATION";

            saveMemoryButton.classList.remove(
                "is-saved"
            );
        }


        /* -------------------------------------------------
           Reset overlay
        ------------------------------------------------- */

        if (resultOverlay) {

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );
        }


        /* -------------------------------------------------
           Reset progress
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
           Reset timer
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
           Reset location
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
           Reset state labels
        ------------------------------------------------- */

        systemState.textContent =
            "READY";


        if (analysisStatus) {

            analysisStatus.textContent =
                "WAITING FOR FRAME";
        }


        /* -------------------------------------------------
           Restore interface
        ------------------------------------------------- */

        inspectionInput.hidden =
            false;

        inspectionPreview.hidden =
            true;

        analysisState.hidden =
            true;

        inspectionResults.hidden =
            true;


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
            resolve => {

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


                if (
                    statusText &&
                    analysisStatus
                ) {

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


                requestAnimationFrame(
                    frame
                );
            }
        );
    }


    /* =====================================================
       TIMER
    ===================================================== */

    function updateTimer() {

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
    }


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

        return new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    milliseconds
                );
            }
        );
    }


    /* =====================================================
       OPTIONAL LOCATION

       We only record coordinates if the browser gives them.
       No fake location is ever generated.
    ===================================================== */

    function requestLocation() {

        if (
            !navigator.geolocation
        ) {

            return;
        }


        navigator.geolocation.getCurrentPosition(

            position => {

                currentLatitude =
                    Number(
                        position.coords.latitude
                    ).toFixed(6);


                currentLongitude =
                    Number(
                        position.coords.longitude
                    ).toFixed(6);
            },

            () => {

                /*
                 * Location is optional.
                 * Failure is intentionally silent.
                 */
            },

            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 300000
            }
        );
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

                selectedImageURL =
                    null;
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


    analyzeButton.disabled =
        true;


    analysisState.hidden =
        true;


    inspectionResults.hidden =
        true;


    inspectionPreview.hidden =
        true;


    /* -----------------------------------------------------
       Ask for location once, without making it mandatory.
    ----------------------------------------------------- */

    requestLocation();


    console.log(
        "IXVYN LENS: interface initialized."
    );
});
