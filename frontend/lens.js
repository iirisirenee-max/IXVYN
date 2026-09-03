/* =========================================================
   IXVYN — LENS
   ROAD-SCENE OBSERVATION INTELLIGENCE
   BUILD 003

   LENS = OBSERVE

   LENS does NOT:
   - calculate risk
   - assign severity
   - assign priority
   - prescribe interventions
   - fabricate speed
   - fabricate trajectories
   - fabricate GPS
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        console.log(
            "IXVYN LENS: observation intelligence online."
        );


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const imageInput =
            document.getElementById(
                "image-input"
            );

        const uploadZone =
            document.getElementById(
                "upload-zone"
            );

        const analyzeButton =
            document.getElementById(
                "analyze-button"
            );

        const inspectionInput =
            document.getElementById(
                "inspection-input"
            );

        const inspectionPreview =
            document.getElementById(
                "inspection-preview"
            );

        const previewImage =
            document.getElementById(
                "preview-image"
            );

        const fileName =
            document.getElementById(
                "file-name"
            );

        const systemState =
            document.getElementById(
                "system-state"
            );

        const analysisState =
            document.getElementById(
                "analysis-state"
            );

        const analysisStatus =
            document.getElementById(
                "analysis-status"
            );

        const analysisTimer =
            document.getElementById(
                "analysis-timer"
            );

        const inspectionResults =
            document.getElementById(
                "inspection-results"
            );

        const resultImage =
            document.getElementById(
                "result-image"
            );

        const resultOverlay =
            document.getElementById(
                "result-overlay"
            );

        const resultSceneType =
            document.getElementById(
                "result-scene-type"
            );

        const resultConfidence =
            document.getElementById(
                "result-confidence"
            );

        const resultEvidence =
            document.getElementById(
                "result-evidence"
            );

        const resultProcessingTime =
            document.getElementById(
                "result-processing-time"
            );

        const resultDescription =
            document.getElementById(
                "result-description"
            );

        const resultAction =
            document.getElementById(
                "result-action"
            );

        const resultLat =
            document.getElementById(
                "result-lat"
            );

        const resultLon =
            document.getElementById(
                "result-lon"
            );

        const newInspection =
            document.getElementById(
                "new-inspection"
            );

        const saveMemoryButton =
            document.getElementById(
                "save-memory"
            );


        /* =====================================================
           PROGRESS
        ===================================================== */

        const progressVision =
            document.getElementById(
                "progress-vision"
            );

        const progressClassification =
            document.getElementById(
                "progress-classification"
            );

        const progressObservation =
            document.getElementById(
                "progress-observation"
            );

        const barVision =
            document.getElementById(
                "bar-vision"
            );

        const barClassification =
            document.getElementById(
                "bar-classification"
            );

        const barObservation =
            document.getElementById(
                "bar-observation"
            );


        /* =====================================================
           STATE
        ===================================================== */

        let selectedFile =
            null;

        let selectedImageURL =
            null;

        let currentAnalysisResult =
            null;

        let currentLatitude =
            null;

        let currentLongitude =
            null;

        let analysisRunning =
            false;

        let analysisStartTime =
            null;

        let analysisTimerInterval =
            null;

        let memorySaved =
            false;


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
                "IXVYN LENS: Required interface element missing."
            );

            return;

        }


        /* =====================================================
           MOBILE-SAFE FILE INPUT

           IMPORTANT:
           The upload zone is already:

           <label for="image-input">

           Therefore we NEVER call:
           imageInput.click()

           This lets the browser handle the native
           Android / iOS file picker.
        ===================================================== */

        imageInput.addEventListener(
            "change",
            (event) => {

                const file =
                    event.target.files?.[0];

                if (!file) {
                    return;
                }

                processFile(file);

            }
        );


        /* =====================================================
           FILE PROCESSING
        ===================================================== */

        function processFile(file) {

            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select an image file."
                );

                return;

            }


            selectedFile =
                file;


            /*
             * Release the previous object URL.
             */

            releaseImageURL();


            /*
             * Create one temporary local URL.
             */

            selectedImageURL =
                URL.createObjectURL(
                    file
                );


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


            inspectionPreview.hidden =
                false;


            analyzeButton.disabled =
                false;


            uploadZone.classList.add(
                "has-file"
            );


            systemState.textContent =
                "FRAME READY";


            /*
             * Keep the browser from doing unnecessary
             * layout work before the user actually analyzes.
             */

            console.log(
                "IXVYN LENS: frame ready.",
                file.name
            );

        }


        /* =====================================================
           DRAG / DROP

           Desktop only in practice.
           Mobile browsers generally use the native picker.
        ===================================================== */

        uploadZone.addEventListener(
            "dragover",
            (event) => {

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
            (event) => {

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


            analysisRunning =
                true;


            analyzeButton.disabled =
                true;


            systemState.textContent =
                "ANALYZING";


            inspectionInput.hidden =
                true;


            inspectionPreview.hidden =
                true;


            inspectionResults.hidden =
                true;


            analysisState.hidden =
                false;


            /*
             * Avoid a huge smooth scroll animation on
             * low-power devices.
             */

            analysisState.scrollIntoView({
                behavior:
                    prefersReducedMotion()
                        ? "auto"
                        : "smooth",
                block:
                    "start"
            });


            resetProgress();


            if (analysisStatus) {

                analysisStatus.textContent =
                    "INITIALIZING";

            }


            startTimer();


            try {


                /*
                 * Start the actual AI request immediately.
                 */

                const aiRequest =
                    analyzeImageWithGemini();


                /*
                 * Lightweight interface telemetry.
                 */

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
                    progressObservation,
                    barObservation,
                    100,
                    650,
                    "INFRASTRUCTURE / INTERACTIONS"
                );


                /*
                 * Wait for the real AI result.
                 */

                const result =
                    await aiRequest;


                stopTimer();


                const elapsed =
                    getElapsedSeconds();


                if (analysisTimer) {

                    analysisTimer.textContent =
                        `${elapsed.toFixed(2)}s`;

                }


                if (resultProcessingTime) {

                    resultProcessingTime.textContent =
                        `${elapsed.toFixed(2)}s`;

                }


                if (analysisStatus) {

                    analysisStatus.textContent =
                        "OBSERVATION COMPLETE";

                }


                renderResult(
                    unwrapResult(result)
                );


                await sleep(
                    prefersReducedMotion()
                        ? 0
                        : 250
                );


                showResults();


            } catch (error) {

                console.error(
                    "IXVYN LENS: Analysis failed:",
                    error
                );


                stopTimer();


                if (analysisStatus) {

                    analysisStatus.textContent =
                        "ANALYSIS FAILED";

                }


                showAnalysisError(
                    error
                );


                analysisRunning =
                    false;


                analyzeButton.disabled =
                    false;


                systemState.textContent =
                    "ANALYSIS ERROR";


                return;

            }


            analysisRunning =
                false;

        }


        /* =====================================================
           REAL AI REQUEST
        ===================================================== */

        async function analyzeImageWithGemini() {


            console.log(
                "IXVYN LENS: preparing image..."
            );


            const preparedImage =
                await prepareImageForAI(
                    selectedFile
                );


            console.log(
                "IXVYN LENS: sending frame to /api/analyze..."
            );


            const response =
                await fetch(
                    "/api/analyze",
                    {
                        method:
                            "POST",

                        headers:
                            {
                                "Content-Type":
                                    "application/json"
                            },

                        body:
                            JSON.stringify(
                                {
                                    image:
                                        preparedImage.data,

                                    mimeType:
                                        preparedImage.mimeType
                                }
                            )
                    }
                );


            const responseText =
                await response.text();


            let data =
                null;


            try {

                data =
                    responseText
                        ? JSON.parse(
                            responseText
                        )
                        : null;

            } catch {

                throw new Error(
                    `Analysis server returned HTTP ${response.status}.`
                );

            }


            if (!response.ok) {

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
                "IXVYN LENS: observation received."
            );


            return data;

        }


        /* =====================================================
           UNWRAP BACKEND RESPONSE
        ===================================================== */

        function unwrapResult(data) {

            /*
             * Supports several safe response shapes so
             * frontend changes don't break if the API wraps
             * the observation.
             */

            return (
                data?.result ||
                data?.observation ||
                data?.data ||
                data
            );

        }


        /* =====================================================
           PREPARE IMAGE

           Adaptive resolution:

           Desktop:
           up to 1400px

           Mobile / low-memory:
           up to 960px

           This reduces canvas RAM and image decoding
           pressure on phones.
        ===================================================== */

        function prepareImageForAI(file) {

            return new Promise(
                (resolve, reject) => {


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


                    reader.onload =
                        () => {


                            const image =
                                new Image();


                            image.onload =
                                () => {


                                    const mobile =
                                        window.matchMedia(
                                            "(max-width: 800px)"
                                        ).matches;


                                    const lowMemory =
                                        Number(
                                            navigator.deviceMemory
                                        ) <= 4;


                                    const MAX_SIZE =
                                        mobile || lowMemory
                                            ? 960
                                            : 1400;


                                    let width =
                                        image.naturalWidth;


                                    let height =
                                        image.naturalHeight;


                                    if (
                                        width >
                                            MAX_SIZE ||
                                        height >
                                            MAX_SIZE
                                    ) {

                                        const scale =
                                            Math.min(
                                                MAX_SIZE /
                                                    width,

                                                MAX_SIZE /
                                                    height
                                            );


                                        width =
                                            Math.max(
                                                1,
                                                Math.round(
                                                    width *
                                                    scale
                                                )
                                            );


                                        height =
                                            Math.max(
                                                1,
                                                Math.round(
                                                    height *
                                                    scale
                                                )
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
                                            "2d",
                                            {
                                                alpha:
                                                    false
                                            }
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
                                            mobile ||
                                            lowMemory
                                                ? 0.76
                                                : 0.82
                                        );


                                    /*
                                     * Release the temporary
                                     * decoded image as soon as
                                     * the canvas is generated.
                                     */

                                    image.src =
                                        "";


                                    canvas.width =
                                        1;

                                    canvas.height =
                                        1;


                                    resolve(
                                        {
                                            data:
                                                dataURL,

                                            mimeType:
                                                "image/jpeg"
                                        }
                                    );

                                };


                            image.onerror =
                                () => {

                                    reject(
                                        new Error(
                                            "Could not read the selected image."
                                        )
                                    );

                                };


                            image.src =
                                reader.result;

                        };


                    reader.onerror =
                        () => {

                            reject(
                                new Error(
                                    "Could not load image file."
                                )
                            );

                        };


                    reader.readAsDataURL(
                        file
                    );

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


            memorySaved =
                false;


            resetMemoryButton();


            const text =
                (
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


                    return String(
                        value
                    );

                };


            const list =
                (
                    value,
                    fallback = "NONE OBSERVED"
                ) => {


                    if (
                        !Array.isArray(value) ||
                        !value.length
                    ) {

                        return fallback;

                    }


                    return value
                        .map(
                            item => {

                                if (
                                    typeof item ===
                                    "string"
                                ) {

                                    return item;

                                }


                                return (
                                    item?.label ||
                                    item?.type ||
                                    item?.description ||
                                    ""
                                );

                            }
                        )
                        .filter(
                            Boolean
                        )
                        .join(
                            " · "
                        );

                };


            /* =================================================
               CORE
            ================================================= */

            const sceneType =
                result.sceneType ||
                result.road?.sceneType ||
                "ROAD SCENE";


            if (resultSceneType) {

                resultSceneType.textContent =
                    text(
                        sceneType,
                        "ROAD SCENE"
                    ).toUpperCase();

            }


            const confidence =
                Number(
                    result.confidence
                );


            if (resultConfidence) {

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


            /* =================================================
               EVIDENCE
            ================================================= */

            const clear =
                Array.isArray(
                    result.evidence?.clear
                )
                    ? result.evidence.clear.length
                    : 0;


            const uncertain =
                Array.isArray(
                    result.evidence?.uncertain
                )
                    ? result.evidence.uncertain.length
                    : 0;


            const notObservable =
                Array.isArray(
                    result.evidence?.notObservable
                )
                    ? result.evidence.notObservable.length
                    : 0;


            if (resultEvidence) {

                resultEvidence.textContent =
                    `${clear} / ${uncertain} / ${notObservable}`;

            }


            /* =================================================
               SUMMARY
            ================================================= */

            if (resultDescription) {

                resultDescription.textContent =
                    result.sceneSummary ||
                    result.analysis ||
                    "Road-scene observation completed.";

            }


            /* =================================================
               ROAD
            ================================================= */

            const road =
                result.road ||
                {};


            setText(
                "obs-road-geometry",
                road.geometry,
                "NOT OBSERVABLE"
            );


            setText(
                "obs-road-markings",
                road.laneMarkings,
                "NOT OBSERVABLE"
            );


            setText(
                "obs-road-intersection",
                road.intersection,
                "UNKNOWN"
            );


            setText(
                "obs-road-crossing",
                road.crossing,
                "UNKNOWN"
            );


            /* =================================================
               PEOPLE
            ================================================= */

            const people =
                result.people ||
                {};


            setText(
                "obs-people-presence",
                people.presence,
                "UNKNOWN"
            );


            setText(
                "obs-people-vulnerable",
                list(
                    people.vulnerableRoadUsers
                ),
                "NONE OBSERVED"
            );


            /* =================================================
               VEHICLES
            ================================================= */

            const vehicles =
                result.vehicles ||
                {};


            setText(
                "obs-vehicles-presence",
                vehicles.presence,
                "UNKNOWN"
            );


            setText(
                "obs-vehicles-types",
                list(
                    vehicles.types
                ),
                "NONE OBSERVED"
            );


            /* =================================================
               INFRASTRUCTURE
            ================================================= */

            const infrastructure =
                result.infrastructure ||
                {};


            setText(
                "obs-road-surface",
                infrastructure.roadSurface,
                "NOT OBSERVABLE"
            );


            setText(
                "obs-road-edge",
                infrastructure.roadEdge,
                "NOT OBSERVABLE"
            );


            setText(
                "obs-lighting",
                infrastructure.lighting,
                "NOT OBSERVABLE"
            );


            /* =================================================
               VISIBILITY
            ================================================= */

            const visibility =
                result.visibility ||
                {};


            setText(
                "obs-visibility-state",
                visibility.state,
                "UNKNOWN"
            );


            setText(
                "obs-visibility-factors",
                list(
                    visibility.factors
                ),
                "NONE OBSERVED"
            );


            /* =================================================
               INTERACTIONS
            ================================================= */

            setText(
                "obs-interactions",
                list(
                    result.interactions
                ),
                "NONE OBSERVED"
            );


            /* =================================================
               RESULT IMAGE
            ================================================= */

            if (
                resultImage &&
                selectedImageURL
            ) {

                resultImage.src =
                    selectedImageURL;

            }


            /* =================================================
               OPTIONAL AI BOX

               Only render if the backend actually provides
               a valid normalized bounding box.

               Otherwise there is NO fabricated overlay.
            ================================================= */

            renderBoundingBox(
                result.boundingBox
            );


            /* =================================================
               HANDOFF
            ================================================= */

            createSignalHandoff(
                result
            );


            systemState.textContent =
                "SCENE OBSERVED";


            /*
             * Location is obtained from browser geolocation.
             */

            requestLocation();

        }


        /* =====================================================
           SIMPLE TEXT SETTER
        ===================================================== */

        function setText(
            id,
            value,
            fallback
        ) {

            const element =
                document.getElementById(
                    id
                );


            if (!element) {
                return;
            }


            element.textContent =
                value === null ||
                value === undefined ||
                value === ""
                    ? fallback
                    : String(value);

        }


        /* =====================================================
           LENS → SIGNAL HANDOFF

           LENS observes.
           SIGNAL assesses.
        ===================================================== */

        function createSignalHandoff(
            result
        ) {


            const lensEvidence =
                {

                    source:
                        "LENS",

                    schema:
                        "IXVYN_SCENE_OBSERVATION_V2",

                    timestamp:
                        new Date().toISOString(),

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

                    location:
                        {

                            lat:
                                currentLatitude ??
                                null,

                            lon:
                                currentLongitude ??
                                null

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


                console.log(
                    "IXVYN LENS → SIGNAL:",
                    lensEvidence
                );

            } catch (error) {

                console.warn(
                    "IXVYN LENS: Could not create SIGNAL handoff.",
                    error
                );

            }


            if (resultAction) {

                resultAction.textContent =
                    "Observed evidence is ready for SIGNAL. LENS does not determine risk or prescribe an intervention.";

            }

        }


        /* =====================================================
           OPTIONAL BOUNDING BOX
        ===================================================== */

        function renderBoundingBox(
            boundingBox
        ) {


            if (!resultOverlay) {
                return;
            }


            resultOverlay.hidden =
                true;


            resultOverlay.style.display =
                "none";


            if (
                !boundingBox ||
                typeof boundingBox !==
                    "object"
            ) {

                return;

            }


            const x =
                Number(
                    boundingBox.x
                );

            const y =
                Number(
                    boundingBox.y
                );

            const w =
                Number(
                    boundingBox.width ??
                    boundingBox.w
                );

            const h =
                Number(
                    boundingBox.height ??
                    boundingBox.h
                );


            if (
                ![
                    x,
                    y,
                    w,
                    h
                ].every(
                    Number.isFinite
                )
            ) {

                return;

            }


            /*
             * Accept normalized 0–1 boxes only,
             * or explicit percentage 0–100 boxes.
             *
             * Anything else is ignored rather than guessed.
             */

            const normalized =
                [
                    x,
                    y,
                    w,
                    h
                ].every(
                    value =>
                        value >= 0 &&
                        value <= 1
                );


            const percentage =
                [
                    x,
                    y,
                    w,
                    h
                ].every(
                    value =>
                        value >= 0 &&
                        value <= 100
                );


            if (
                !normalized &&
                !percentage
            ) {

                return;

            }


            const scale =
                normalized
                    ? 100
                    : 1;


            if (
                x + w > scale ||
                y + h > scale
            ) {

                return;

            }


            resultOverlay.style.left =
                `${x * scale}%`;


            resultOverlay.style.top =
                `${y * scale}%`;


            resultOverlay.style.width =
                `${w * scale}%`;


            resultOverlay.style.height =
                `${h * scale}%`;


            resultOverlay.hidden =
                false;


            resultOverlay.style.display =
                "block";

        }


        /* =====================================================
           SHOW RESULTS
        ===================================================== */

        function showResults() {

            analysisState.hidden =
                true;


            inspectionResults.hidden =
                false;


            inspectionResults.scrollIntoView(
                {
                    behavior:
                        prefersReducedMotion()
                            ? "auto"
                            : "smooth",

                    block:
                        "start"
                }
            );

        }


        /* =====================================================
           ERROR
        ===================================================== */

        function showAnalysisError(
            error
        ) {


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


            analysisState.hidden =
                false;


            inspectionResults.hidden =
                false;

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


            if (memorySaved) {

                return;

            }


            const memoryKey =
                "ixvyn_infrastructure_memory";


            let memory =
                [];


            try {

                const stored =
                    localStorage.getItem(
                        memoryKey
                    );


                if (stored) {

                    const parsed =
                        JSON.parse(
                            stored
                        );


                    if (
                        Array.isArray(
                            parsed
                        )
                    ) {

                        memory =
                            parsed;

                    }

                }

            } catch {

                memory =
                    [];

            }


            const result =
                currentAnalysisResult;


            const record =
                {

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
                     * These belong to SIGNAL /
                     * TRAJECTORY / CIVIC / MEMORY.
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


            /*
             * Keep browser storage bounded.
             */

            if (
                memory.length >
                100
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

                memorySaved =
                    true;


                saveMemoryButton.textContent =
                    "SAVED TO MEMORY";


                saveMemoryButton.classList.add(
                    "is-saved"
                );


                console.log(
                    "IXVYN MEMORY: observation saved."
                );

            } catch (error) {

                console.error(
                    "IXVYN MEMORY: save failed.",
                    error
                );

            }

        }


        /* =====================================================
           RESET
        ===================================================== */

        if (newInspection) {

            newInspection.addEventListener(
                "click",
                resetInspection
            );

        }


        function resetInspection() {


            stopTimer();


            releaseImageURL();


            selectedFile =
                null;


            currentAnalysisResult =
                null;


            currentLatitude =
                null;


            currentLongitude =
                null;


            memorySaved =
                false;


            analysisRunning =
                false;


            if (imageInput) {

                imageInput.value =
                    "";

            }


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


            if (saveMemoryButton) {

                saveMemoryButton.textContent =
                    "SAVE OBSERVATION";

                saveMemoryButton.classList.remove(
                    "is-saved"
                );

            }


            if (resultOverlay) {

                resultOverlay.hidden =
                    true;

                resultOverlay.style.display =
                    "none";

            }


            resetProgress();


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


            analyzeButton.disabled =
                true;


            inspectionInput.scrollIntoView(
                {
                    behavior:
                        prefersReducedMotion()
                            ? "auto"
                            : "smooth",

                    block:
                        "start"
                }
            );

        }


        /* =====================================================
           RESET MEMORY BUTTON STATE
        ===================================================== */

        function resetMemoryButton() {

            if (!saveMemoryButton) {
                return;
            }


            saveMemoryButton.textContent =
                "SAVE OBSERVATION";


            saveMemoryButton.classList.remove(
                "is-saved"
            );

        }


        /* =====================================================
           PROGRESS
        ===================================================== */

        function resetProgress() {

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
                progressObservation,
                barObservation,
                0
            );

        }


        function setProgress(
            progressElement,
            barElement,
            value
        ) {


            if (progressElement) {

                progressElement.textContent =
                    String(
                        Math.round(
                            value
                        )
                    );

            }


            if (barElement) {

                barElement.style.width =
                    `${value}%`;

            }

        }


        async function animateProgress(
            progressElement,
            barElement,
            target,
            duration,
            status
        ) {


            if (analysisStatus) {

                analysisStatus.textContent =
                    status;

            }


            /*
             * On reduced-motion devices,
             * don't spend CPU animating.
             */

            if (
                prefersReducedMotion()
            ) {

                setProgress(
                    progressElement,
                    barElement,
                    target
                );

                return;

            }


            const start =
                performance.now();


            return new Promise(
                resolve => {


                    function tick(
                        now
                    ) {

                        const elapsed =
                            now -
                            start;


                        const ratio =
                            Math.min(
                                1,
                                elapsed /
                                duration
                            );


                        const eased =
                            1 -
                            Math.pow(
                                1 - ratio,
                                3
                            );


                        const value =
                            target *
                            eased;


                        setProgress(
                            progressElement,
                            barElement,
                            value
                        );


                        if (
                            ratio >= 1
                        ) {

                            resolve();

                            return;

                        }


                        requestAnimationFrame(
                            tick
                        );

                    }


                    requestAnimationFrame(
                        tick
                    );

                }
            );

        }


        /* =====================================================
           TIMER
        ===================================================== */

        function startTimer() {


            stopTimer();


            analysisStartTime =
                performance.now();


            if (analysisTimer) {

                analysisTimer.textContent =
                    "0.00s";

            }


            /*
             * Timer is active ONLY during analysis.
             * There is no permanent timer.
             */

            analysisTimerInterval =
                setInterval(
                    () => {

                        const elapsed =
                            getElapsedSeconds();


                        if (analysisTimer) {

                            analysisTimer.textContent =
                                `${elapsed.toFixed(2)}s`;

                        }

                    },
                    100
                );

        }


        function stopTimer() {

            if (
                analysisTimerInterval
            ) {

                clearInterval(
                    analysisTimerInterval
                );

                analysisTimerInterval =
                    null;

            }

        }


        function getElapsedSeconds() {

            if (
                !Number.isFinite(
                    analysisStartTime
                )
            ) {

                return 0;

            }


            return (
                performance.now() -
                analysisStartTime
            ) / 1000;

        }


        /* =====================================================
           LOCATION
        ===================================================== */

        function requestLocation() {


            if (
                !navigator.geolocation
            ) {

                return;

            }


            /*
             * Do not request high accuracy.
             *
             * LENS only needs the inspection location.
             * High-accuracy GPS is slower and more expensive.
             */

            navigator.geolocation.getCurrentPosition(
                position => {

                    currentLatitude =
                        position.coords.latitude;

                    currentLongitude =
                        position.coords.longitude;


                    if (resultLat) {

                        resultLat.textContent =
                            currentLatitude.toFixed(
                                6
                            );

                    }


                    if (resultLon) {

                        resultLon.textContent =
                            currentLongitude.toFixed(
                                6
                            );

                    }


                    /*
                     * Refresh the SIGNAL handoff
                     * with the actual location.
                     */

                    if (
                        currentAnalysisResult
                    ) {

                        createSignalHandoff(
                            currentAnalysisResult
                        );

                    }

                },

                () => {

                    /*
                     * Location is optional.
                     * Never fabricate it.
                     */

                    currentLatitude =
                        null;

                    currentLongitude =
                        null;

                },

                {
                    enableHighAccuracy:
                        false,

                    timeout:
                        5000,

                    maximumAge:
                        300000

                }
            );

        }


        /* =====================================================
           IMAGE URL CLEANUP
        ===================================================== */

        function releaseImageURL() {

            if (
                selectedImageURL
            ) {

                URL.revokeObjectURL(
                    selectedImageURL
                );

                selectedImageURL =
                    null;

            }

        }


        /* =====================================================
           UTILITIES
        ===================================================== */

        function prefersReducedMotion() {

            return window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        }


        function sleep(
            milliseconds
        ) {

            return new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        milliseconds
                    )
            );

        }


        /* =====================================================
           PAGE CLEANUP
        ===================================================== */

        window.addEventListener(
            "pagehide",
            () => {

                stopTimer();

                releaseImageURL();

            },
            {
                passive:
                    true
            }
        );


        window.addEventListener(
            "beforeunload",
            () => {

                stopTimer();

                releaseImageURL();

            }
        );


    }
);
