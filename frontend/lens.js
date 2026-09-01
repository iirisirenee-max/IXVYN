/* =========================================================
   IXVYN — LENS / REAL VISUAL INFRASTRUCTURE INTELLIGENCE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("IXVYN LENS visual intelligence online.");


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

    const resultDefect =
        document.getElementById("result-defect");

    const resultConfidence =
        document.getElementById("result-confidence");

    const resultSeverity =
        document.getElementById("result-severity");

    const resultPriority =
        document.getElementById("result-priority");

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

    const resultProcessingTime =
        document.getElementById("result-processing-time");


    let currentAnalysisResult = null;
    let currentLatitude = null;
    let currentLongitude = null;
    let memorySaved = false;


    /* =====================================================
       PROCESSING TIMER
    ===================================================== */

    let analysisStartTime = null;
    let analysisElapsedTime = null;
    let analysisTimerInterval = null;


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
       DETECTION OVERLAY
    ===================================================== */

    const resultOverlay =
        document.querySelector(".result-overlay");


    /* =====================================================
       STATE
    ===================================================== */

    let selectedFile = null;
    let selectedImageURL = null;
    let analysisRunning = false;


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
    ===================================================== */

    imageInput.addEventListener(
        "change",
        (event) => {

            console.log(
                "IXVYN LENS: File input changed."
            );

            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }

            processFile(file);
        }
    );


    /* =====================================================
       UPLOAD ZONE
    ===================================================== */

    uploadZone.addEventListener(
        "click",
        () => {

            if (!selectedFile) {
                imageInput.click();
            }

        }
    );


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

            alert(
                "Please select an image file."
            );

            return;
        }


        selectedFile = file;


        /* ---------------------------------------------
           CLEAN PREVIOUS OBJECT URL
        --------------------------------------------- */

        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );
        }


        /* ---------------------------------------------
           CREATE PREVIEW
        --------------------------------------------- */

        selectedImageURL =
            URL.createObjectURL(file);

        previewImage.src =
            selectedImageURL;


        if (resultImage) {

            resultImage.src =
                selectedImageURL;
        }


        /* ---------------------------------------------
           FILE INFORMATION
        --------------------------------------------- */

        if (fileName) {

            fileName.textContent =
                file.name;
        }


        /* ---------------------------------------------
           SHOW PREVIEW
        --------------------------------------------- */

        inspectionPreview.hidden =
            false;


        /* ---------------------------------------------
           ENABLE ANALYSIS
        --------------------------------------------- */

        analyzeButton.disabled =
            false;


        /* ---------------------------------------------
           SYSTEM STATE
        --------------------------------------------- */

        systemState.textContent =
            "FRAME READY";


        uploadZone.classList.add(
            "has-file"
        );


        console.log(
            "IXVYN LENS: FRAME READY."
        );
    }


    /* =====================================================
       DRAG AND DROP
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
                event.dataTransfer.files?.[0];

            if (!file) {
                return;
            }

            processFile(file);
        }
    );


    /* =====================================================
       ANALYSIS BUTTON
    ===================================================== */

    analyzeButton.addEventListener(
        "click",
        beginAnalysis
    );


    /* =====================================================
       BEGIN REAL ANALYSIS
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


        /* =================================================
           SHOW ANALYSIS SCREEN
        ================================================== */

        analysisState.hidden =
            false;

        inspectionInput.hidden =
            true;

        inspectionPreview.hidden =
            true;

        inspectionResults.hidden =
            true;


        analysisState.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        /* =================================================
           RESET PROGRESS
        ================================================== */

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


        try {

            /* ---------------------------------------------
               START REAL PROCESSING TIMER
            --------------------------------------------- */

            analysisStartTime =
                performance.now();

            analysisElapsedTime =
                null;


            if (analysisTimerInterval) {

                clearInterval(
                    analysisTimerInterval
                );

            }


            if (analysisTimer) {

                analysisTimer.textContent =
                    "0.00s";

            }


            analysisTimerInterval =
                setInterval(
                    () => {

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

                    },
                    50
                );


            /* ---------------------------------------------
               START REAL AI REQUEST

               The AI request starts immediately.
               The visual progress animation runs separately.
            --------------------------------------------- */

            const aiRequest =
                analyzeImageWithGemini();


            /* ---------------------------------------------
               RUN VISUAL PROGRESS IN PARALLEL
            --------------------------------------------- */

            const progressSequence =
                (async () => {

                    await animateProgress(
                        progressVision,
                        barVision,
                        100,
                        1100,
                        "VISUAL ANALYSIS"
                    );


                    await animateProgress(
                        progressClassification,
                        barClassification,
                        100,
                        900,
                        "DEFECT CLASSIFICATION"
                    );


                    await animateProgress(
                        progressSeverity,
                        barSeverity,
                        100,
                        700,
                        "SEVERITY ASSESSMENT"
                    );

                })();


            /* ---------------------------------------------
               WAIT FOR REAL GEMINI RESULT

               If the API fails, this throws immediately.
            --------------------------------------------- */

            const result =
                await aiRequest;


            /* ---------------------------------------------
               LET THE VISUAL PIPELINE FINISH
            --------------------------------------------- */

            await progressSequence;


            /* ---------------------------------------------
               STOP REAL PROCESSING TIMER
            --------------------------------------------- */

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

                analysisTimerInterval =
                    null;

            }


            if (
                analysisTimer &&
                Number.isFinite(
                    analysisElapsedTime
                )
            ) {

                analysisTimer.textContent =
                    `${analysisElapsedTime.toFixed(2)}s`;

            }


            analysisStatus.textContent =
                "ANALYSIS COMPLETE";


            console.log(
                "IXVYN LENS: REAL AI RESULT:",
                result
            );


            console.log(
                "IXVYN LENS: PROCESSING TIME:",
                `${analysisElapsedTime?.toFixed(2)}s`
            );


            renderResult(
                result
            );


            await sleep(500);

            showResults();


        } catch (error) {

            /* ---------------------------------------------
               STOP TIMER IMMEDIATELY ON ERROR
            --------------------------------------------- */

            if (analysisTimerInterval) {

                clearInterval(
                    analysisTimerInterval
                );

                analysisTimerInterval =
                    null;

            }


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


            if (
                analysisTimer &&
                Number.isFinite(
                    analysisElapsedTime
                )
            ) {

                analysisTimer.textContent =
                    `${analysisElapsedTime.toFixed(2)}s`;

            }


            console.error(
                "IXVYN LENS: Analysis failed:",
                error
            );


            analysisStatus.textContent =
                "ANALYSIS FAILED";


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
       REAL GEMINI REQUEST
    ===================================================== */

    async function analyzeImageWithGemini() {

        console.log(
            "IXVYN LENS: Preparing image for AI..."
        );


        /*
         * Resize/compress the image before sending it.
         */

        const preparedImage =
            await prepareImageForAI(
                selectedFile
            );


        console.log(
            "IXVYN LENS: Sending frame to /api/analyze..."
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


        /*
         * Read response as text first.
         */

        let data = null;

        const responseText =
            await response.text();


        try {

            data =
                responseText
                    ? JSON.parse(responseText)
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


        /* =================================================
           HTTP ERROR
        ================================================= */

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


        /* =================================================
           INVALID APPLICATION RESPONSE
        ================================================= */

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
       PREPARE IMAGE
    ===================================================== */

    function prepareImageForAI(file) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload =
                    () => {

                        const image =
                            new Image();


                        image.onload =
                            () => {

                                const MAX_SIZE =
                                    800;

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


                                /*
                                 * JPEG keeps requests reasonably small
                                 * while retaining enough detail.
                                 */

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
       RENDER REAL RESULT
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


        /* ---------------------------------------------
           PROCESSING TIME
        --------------------------------------------- */

        if (resultProcessingTime) {

            resultProcessingTime.textContent =
                Number.isFinite(
                    analysisElapsedTime
                )
                    ? `${analysisElapsedTime.toFixed(2)}s`
                    : "—";

        }


        /* ---------------------------------------------
           DEFECT
        --------------------------------------------- */

        if (resultDefect) {

            resultDefect.textContent =
                result.defect ||
                "NO ACTIONABLE ANOMALY";
        }


        /* ---------------------------------------------
           CONFIDENCE
        --------------------------------------------- */

        if (resultConfidence) {

            const confidence =
                parseFloat(
                    result.confidence
                );


            resultConfidence.textContent =
                Number.isFinite(confidence)
                    ? (
                        confidence <= 1
                            ? `${(confidence * 100).toFixed(1)}%`
                            : `${confidence.toFixed(1)}%`
                    )
                    : "—";
        }


        /* ---------------------------------------------
           SEVERITY
        --------------------------------------------- */

        if (resultSeverity) {

            resultSeverity.textContent =
                result.severity ||
                "—";
        }


        /* ---------------------------------------------
           PRIORITY
        --------------------------------------------- */

        if (resultPriority) {

            resultPriority.textContent =
                result.priority ||
                "—";
        }


        /* ---------------------------------------------
           DESCRIPTION
        --------------------------------------------- */

        if (resultDescription) {

            resultDescription.textContent =
                result.description ||
                result.analysis ||
                "No actionable infrastructure anomaly was identified.";
        }


        /* ---------------------------------------------
           ACTION
        --------------------------------------------- */

        if (resultAction) {

            resultAction.textContent =
                result.recommendedAction ||
                result.action ||
                "No immediate action recommended.";
        }


        /* ---------------------------------------------
           RESULT IMAGE
        --------------------------------------------- */

        if (
            resultImage &&
            selectedImageURL
        ) {

            resultImage.src =
                selectedImageURL;
        }


        /* ---------------------------------------------
           SYSTEM STATE
        --------------------------------------------- */

        if (
            result.status ===
            "no_actionable_anomaly"
        ) {

            systemState.textContent =
                "NO ACTIONABLE ANOMALY";

        } else if (
            result.anomalyDetected ===
            false
        ) {

            systemState.textContent =
                "NO ACTIONABLE ANOMALY";

        } else {

            systemState.textContent =
                "ANOMALY DETECTED";
        }


        /* ---------------------------------------------
           REAL AI DETECTION BOX
        --------------------------------------------- */

        renderBoundingBox(
            result.boundingBox
        );


        /* ---------------------------------------------
           LOCATION & DATA MATRICES FORWARDING
        --------------------------------------------- */

        sessionStorage.setItem(
            "sih_defect",
            result.defect ||
            "UNIFORMITY HAZARD"
        );

        sessionStorage.setItem(
            "sih_severity",
            result.severity ||
            "HIGH // PRIORITY"
        );

        sessionStorage.setItem(
            "sih_trigger",
            "true"
        );


        requestLocation();
    }


    /* =====================================================
       REAL BOUNDING BOX
    ===================================================== */

    function renderBoundingBox(
        boundingBox
    ) {

        if (!resultOverlay) {

            console.warn(
                "IXVYN LENS: Result overlay element not found."
            );

            return;
        }


        /*
         * No usable detection → hide overlay.
         */

        if (
            !boundingBox ||
            typeof boundingBox !== "object"
        ) {

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );

            return;
        }


        let x;
        let y;
        let width;
        let height;


        /*
         * FORMAT 1:
         * { xmin, ymin, xmax, ymax }
         */

        if (
            Number.isFinite(
                Number(boundingBox.xmin)
            ) &&
            Number.isFinite(
                Number(boundingBox.ymin)
            ) &&
            Number.isFinite(
                Number(boundingBox.xmax)
            ) &&
            Number.isFinite(
                Number(boundingBox.ymax)
            )
        ) {

            const xmin =
                Number(boundingBox.xmin);

            const ymin =
                Number(boundingBox.ymin);

            const xmax =
                Number(boundingBox.xmax);

            const ymax =
                Number(boundingBox.ymax);


            x =
                xmin;

            y =
                ymin;

            width =
                xmax - xmin;

            height =
                ymax - ymin;


            if (
                Math.max(
                    Math.abs(x),
                    Math.abs(y),
                    Math.abs(width),
                    Math.abs(height)
                ) > 1
            ) {

                x /= 10;
                y /= 10;
                width /= 10;
                height /= 10;
            }
        }


        /*
         * FORMAT 2:
         * { x, y, width, height }
         */

        else if (
            Number.isFinite(
                Number(boundingBox.x)
            ) &&
            Number.isFinite(
                Number(boundingBox.y)
            ) &&
            Number.isFinite(
                Number(boundingBox.width)
            ) &&
            Number.isFinite(
                Number(boundingBox.height)
            )
        ) {

            x =
                Number(boundingBox.x);

            y =
                Number(boundingBox.y);

            width =
                Number(boundingBox.width);

            height =
                Number(boundingBox.height);


            const largestValue =
                Math.max(
                    Math.abs(x),
                    Math.abs(y),
                    Math.abs(width),
                    Math.abs(height)
                );


            if (largestValue <= 1) {

                x *= 100;
                y *= 100;
                width *= 100;
                height *= 100;

            } else if (largestValue <= 100) {

                /* Already percentage */

            } else {

                x /= 10;
                y /= 10;
                width /= 10;
                height /= 10;

            }
        }


        else {

            console.warn(
                "IXVYN LENS: Unsupported bounding box format.",
                boundingBox
            );

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );

            return;
        }


        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y) ||
            !Number.isFinite(width) ||
            !Number.isFinite(height)
        ) {

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );

            return;
        }


        if (width < 0) {

            x += width;

            width =
                Math.abs(width);
        }


        if (height < 0) {

            y += height;

            height =
                Math.abs(height);
        }


        x =
            clamp(
                x,
                0,
                100
            );

        y =
            clamp(
                y,
                0,
                100
            );

        width =
            clamp(
                width,
                0,
                100 - x
            );

        height =
            clamp(
                height,
                0,
                100 - y
            );


        if (
            width < 1 ||
            height < 1
        ) {

            resultOverlay.style.display =
                "none";

            return;
        }


        resultOverlay.style.display =
            "block";

        resultOverlay.style.left =
            `${x}%`;

        resultOverlay.style.top =
            `${y}%`;

        resultOverlay.style.width =
            `${width}%`;

        resultOverlay.style.height =
            `${height}%`;

        resultOverlay.setAttribute(
            "data-ai-detection",
            "true"
        );
    }


    /* =====================================================
       CLAMP
    ===================================================== */

    function clamp(
        value,
        minimum,
        maximum
    ) {

        return Math.min(
            Math.max(
                value,
                minimum
            ),
            maximum
        );
    }


    /* =====================================================
       GEOLOCATION
    ===================================================== */

    function requestLocation() {

        if (
            !resultLat ||
            !resultLon
        ) {

            return;
        }


        if (
            !navigator.geolocation
        ) {

            setFallbackLocation();

            return;
        }


        resultLat.textContent =
            "LOCATING...";

        resultLon.textContent =
            "LOCATING...";


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                currentLatitude =
                    latitude;

                currentLongitude =
                    longitude;


                resultLat.textContent =
                    latitude.toFixed(5);

                resultLon.textContent =
                    longitude.toFixed(5);


                sessionStorage.setItem(
                    "sih_lat",
                    latitude.toFixed(5)
                );

                sessionStorage.setItem(
                    "sih_lon",
                    longitude.toFixed(5)
                );


                console.log(
                    "IXVYN LENS: Location captured.",
                    latitude,
                    longitude
                );
            },


            (error) => {

                console.warn(
                    "IXVYN LENS: Location unavailable.",
                    error.message
                );

                setFallbackLocation();
            },


            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0
            }
        );
    }


    function setFallbackLocation() {

        const fLat =
            "28.61390";

        const fLon =
            "77.20900";


        resultLat.textContent =
            fLat;

        resultLon.textContent =
            fLon;

        currentLatitude =
            fLat;

        currentLongitude =
            fLon;


        sessionStorage.setItem(
            "sih_lat",
            fLat
        );

        sessionStorage.setItem(
            "sih_lon",
            fLon
        );
    }    /* =====================================================
       MEMORY — SAVE INSPECTION
    ===================================================== */

    function saveCurrentInspection() {

        if (!currentAnalysisResult) {

            console.warn(
                "IXVYN LENS: No completed analysis available to save."
            );

            return;
        }


        if (memorySaved) {
            return;
        }


        const record = {

            id:
                `IXVYN-${Date.now()}`,

            defect:
                currentAnalysisResult.defect ||
                "UNKNOWN ANOMALY",

            confidence:
                currentAnalysisResult.confidence ??
                "",

            severity:
                currentAnalysisResult.severity ||
                "UNKNOWN",

            priority:
                currentAnalysisResult.priority ||
                "—",

            description:
                currentAnalysisResult.description ||
                currentAnalysisResult.analysis ||
                "",

            action:
                currentAnalysisResult.recommendedAction ||
                currentAnalysisResult.action ||
                "",

            latitude:
                Number(currentLatitude) ||
                null,

            longitude:
                Number(currentLongitude) ||
                null,

            timestamp:
                new Date().toISOString(),

            status:
                "active"

        };


        const STORAGE_KEY =
            "ixvyn_infrastructure_memory";


        let records = [];


        try {

            const stored =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (stored) {

                const parsed =
                    JSON.parse(stored);


                if (Array.isArray(parsed)) {

                    records =
                        parsed;
                }
            }

        } catch (error) {

            console.warn(
                "IXVYN LENS: Could not read MEMORY database index keys.",
                error
            );
        }


        records.push(
            record
        );


        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(records)
            );


            memorySaved =
                true;


            setMemorySavedState();


            console.log(
                "IXVYN LENS: Inspection successfully persisted to local storage array.",
                record
            );

        } catch (error) {

            console.error(
                "IXVYN LENS: Local database write failure:",
                error
            );

            resetMemoryButton();
        }
    }


    /* =====================================================
       MEMORY — BUTTON STATES
    ===================================================== */

    function setMemorySavedState() {

        if (!saveMemoryButton) {
            return;
        }


        saveMemoryButton.disabled =
            true;


        saveMemoryButton.innerHTML =
            `
                SAVED TO MEMORY
                <span>✓</span>
            `;
    }


    function resetMemoryButton() {

        if (!saveMemoryButton) {
            return;
        }


        saveMemoryButton.disabled =
            false;


        saveMemoryButton.innerHTML =
            `
                SAVE TO MEMORY
                <span>↗</span>
            `;
    }


    /* =====================================================
       MEMORY — BUTTON EVENT BINDINGS
    ===================================================== */

    if (saveMemoryButton) {

        saveMemoryButton.addEventListener(
            "click",
            saveCurrentInspection
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
            "IXVYN LENS: Resetting inspection."
        );


        currentAnalysisResult =
            null;

        currentLatitude =
            null;

        currentLongitude =
            null;

        memorySaved =
            false;


        /* ---------------------------------------------
           RESET PROCESSING TIMER
        --------------------------------------------- */

        analysisStartTime =
            null;

        analysisElapsedTime =
            null;


        if (analysisTimerInterval) {

            clearInterval(
                analysisTimerInterval
            );

            analysisTimerInterval =
                null;

        }


        if (analysisTimer) {

            analysisTimer.textContent =
                "0.00s";

        }


        resetMemoryButton();


        selectedFile =
            null;

        analysisRunning =
            false;


        /* ---------------------------------------------
           CLEAN BLOB OBJECT URL
        --------------------------------------------- */

        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );

            selectedImageURL =
                null;
        }


        /* ---------------------------------------------
           RESET FILE INPUT
        --------------------------------------------- */

        imageInput.value =
            "";


        /* ---------------------------------------------
           RESET IMAGE PREVIEWS
        --------------------------------------------- */

        previewImage.src =
            "";


        if (resultImage) {

            resultImage.src =
                "";
        }


        /* ---------------------------------------------
           RESET DETECTION OVERLAY
        --------------------------------------------- */

        if (resultOverlay) {

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );

            resultOverlay.style.left =
                "";

            resultOverlay.style.top =
                "";

            resultOverlay.style.width =
                "";

            resultOverlay.style.height =
                "";
        }


        /* ---------------------------------------------
           RESET TEXT
        --------------------------------------------- */

        if (fileName) {

            fileName.textContent =
                "—";
        }


        if (resultDefect) {

            resultDefect.textContent =
                "—";
        }


        if (resultConfidence) {

            resultConfidence.textContent =
                "—";
        }


        if (resultSeverity) {

            resultSeverity.textContent =
                "—";
        }


        if (resultPriority) {

            resultPriority.textContent =
                "—";
        }


        if (resultProcessingTime) {

            resultProcessingTime.textContent =
                "—";
        }


        if (resultDescription) {

            resultDescription.textContent =
                "—";
        }


        if (resultAction) {

            resultAction.textContent =
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


        /* ---------------------------------------------
           RESET PROGRESS
        --------------------------------------------- */

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


        /* ---------------------------------------------
           RESET VISIBILITY
        --------------------------------------------- */

        inspectionResults.hidden =
            true;

        analysisState.hidden =
            true;

        inspectionInput.hidden =
            false;

        inspectionPreview.hidden =
            true;


        /* ---------------------------------------------
           RESET ANALYZE BUTTON
        --------------------------------------------- */

        analyzeButton.disabled =
            true;


        /* ---------------------------------------------
           RESET UPLOAD STATE
        --------------------------------------------- */

        uploadZone.classList.remove(
            "has-file",
            "is-dragging"
        );


        /* ---------------------------------------------
           RESET STATUS
        --------------------------------------------- */

        systemState.textContent =
            "READY";

        analysisStatus.textContent =
            "READY";


        inspectionInput.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =====================================================
       PROGRESS
    ===================================================== */

    function setProgress(
        numberElement,
        barElement,
        value
    ) {

        if (numberElement) {

            numberElement.textContent =
                Math.round(value);
        }


        if (barElement) {

            barElement.style.width =
                `${value}%`;
        }
    }


    /* =====================================================
       ANIMATE PROGRESS
    ===================================================== */

    async function animateProgress(
        numberElement,
        barElement,
        target,
        duration,
        label
    ) {

        analysisStatus.textContent =
            label;


        const start =
            performance.now();


        return new Promise(
            (resolve) => {

                function frame(now) {

                    const elapsed =
                        now - start;


                    const progress =
                        Math.min(
                            elapsed / duration,
                            1
                        );


                    const eased =
                        1 -
                        Math.pow(
                            1 - progress,
                            3
                        );


                    setProgress(
                        numberElement,
                        barElement,
                        eased * target
                    );


                    if (
                        progress < 1
                    ) {

                        requestAnimationFrame(
                            frame
                        );

                    } else {

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
       SLEEP
    ===================================================== */

    function sleep(
        milliseconds
    ) {

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
       SHOW RESULTS
    ===================================================== */

    function showResults() {

        analysisState.hidden =
            true;

        inspectionResults.hidden =
            false;


        inspectionResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =====================================================
       ANALYSIS ERROR
    ===================================================== */

    function showAnalysisError(
        error
    ) {

        analysisState.hidden =
            false;

        inspectionResults.hidden =
            true;


        analysisStatus.textContent =
            "ANALYSIS FAILED";


        console.error(
            "IXVYN LENS: Analysis error:",
            error
        );
    }


    /* =====================================================
       INITIAL VISIBILITY
    ===================================================== */

    inspectionPreview.hidden =
        true;

    analysisState.hidden =
        true;

    inspectionResults.hidden =
        true;

    analyzeButton.disabled =
        true;


    if (resultOverlay) {

        resultOverlay.style.display =
            "none";
    }


    console.log(
        "IXVYN LENS: Real visual inspection interface ready."
    );

});
