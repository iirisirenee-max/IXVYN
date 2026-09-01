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

    const analysisTimer =
        document.getElementById("analysis-timer");

    const resultProcessingTime =
        document.getElementById("result-processing-time");

    const resultLat =
        document.getElementById("result-lat");

    const resultLon =
        document.getElementById("result-lon");

    const newInspection =
        document.getElementById("new-inspection");

    const saveMemoryButton =
        document.getElementById("save-memory");


    let currentAnalysisResult = null;
    let currentLatitude = null;
    let currentLongitude = null;
    let memorySaved = false;


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

    /*
     * IMPORTANT:
     * lens.html already uses:
     *
     * <label for="image-input">
     *
     * Therefore we intentionally DO NOT call
     * imageInput.click() from another click handler.
     *
     * This avoids the duplicate native file-picker
     * trigger that can break file selection on mobile.
     */


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


        selectedFile =
            file;


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
        ================================================= */

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
        ================================================= */

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
               START REAL AI TIMER
            --------------------------------------------- */

            analysisStartTime =
                performance.now();

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


            /*
             * Start the REAL AI request immediately.
             */

            const aiRequest =
                analyzeImageWithGemini();


            /* ---------------------------------------------
               VISUAL ANALYSIS
            --------------------------------------------- */

            await animateProgress(
                progressVision,
                barVision,
                100,
                1100,
                "VISUAL ANALYSIS"
            );


            /* ---------------------------------------------
               CLASSIFICATION
            --------------------------------------------- */

            await animateProgress(
                progressClassification,
                barClassification,
                100,
                900,
                "DEFECT CLASSIFICATION"
            );


            /* ---------------------------------------------
               SEVERITY
            --------------------------------------------- */

            await animateProgress(
                progressSeverity,
                barSeverity,
                100,
                700,
                "SEVERITY ASSESSMENT"
            );


            /* ---------------------------------------------
               WAIT FOR REAL AI RESULT
            --------------------------------------------- */

            const result =
                await aiRequest;


            /*
             * Stop REAL timer when Gemini actually responds.
             */

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
                "ANALYSIS COMPLETE";


            console.log(
                "IXVYN LENS: REAL AI RESULT:",
                result
            );


            renderResult(
                result
            );


            await sleep(
                500
            );


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

                analysisTimerInterval =
                    null;
            }


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
                                    1600;


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
                                        Math.round(
                                            width *
                                            scale
                                        );

                                    height =
                                        Math.round(
                                            height *
                                            scale
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
                result.confidence;

            if (
                typeof confidence ===
                "number"
            ) {

                resultConfidence.textContent =
                    `${Math.round(
                        confidence <= 1
                            ? confidence * 100
                            : confidence
                    )}%`;

            } else {

                resultConfidence.textContent =
                    confidence ||
                    "—";
            }
        }


        /* ---------------------------------------------
           SEVERITY
        --------------------------------------------- */

        if (resultSeverity) {

            resultSeverity.textContent =
                result.severity ||
                "UNASSESSED";
        }


        /* ---------------------------------------------
           PRIORITY
        --------------------------------------------- */

        if (resultPriority) {

            resultPriority.textContent =
                result.priority ||
                "REVIEW REQUIRED";
        }


        /* ---------------------------------------------
           DESCRIPTION
        --------------------------------------------- */

        if (resultDescription) {

            resultDescription.textContent =
                result.description ||
                "No additional visual description was returned.";
        }


        /* ---------------------------------------------
           RECOMMENDED ACTION
        --------------------------------------------- */

        if (resultAction) {

            resultAction.textContent =
                result.recommended_action ||
                result.action ||
                "Inspect the identified condition.";
        }


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
           RESULT IMAGE
        --------------------------------------------- */

        if (resultImage) {

            resultImage.src =
                selectedImageURL || "";
        }


        /* ---------------------------------------------
           RESULT OBJECT
        --------------------------------------------- */

        currentAnalysisResult =
            result;


        /* ---------------------------------------------
           AI BOUNDING BOX
        --------------------------------------------- */

        if (resultOverlay) {

            const box =
                result.bounding_box ||
                result.boundingBox ||
                result.detection;


            if (
                box &&
                typeof box ===
                    "object"
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
                    Number.isFinite(x) &&
                    Number.isFinite(y) &&
                    Number.isFinite(width) &&
                    Number.isFinite(height)
                ) {

                    resultOverlay.style.display =
                        "block";

                    resultOverlay.style.left =
                        `${x <= 1 ? x * 100 : x}%`;

                    resultOverlay.style.top =
                        `${y <= 1 ? y * 100 : y}%`;

                    resultOverlay.style.width =
                        `${width <= 1 ? width * 100 : width}%`;

                    resultOverlay.style.height =
                        `${height <= 1 ? height * 100 : height}%`;

                    resultOverlay.setAttribute(
                        "data-ai-detection",
                        "true"
                    );
                }
            }
        }


        /* ---------------------------------------------
           SYSTEM STATE
        --------------------------------------------- */

        systemState.textContent =
            "FRAME ASSESSED";


        /* ---------------------------------------------
           LENS → PATHFINDER HANDOFF
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


        console.log(
            "IXVYN LENS: Evidence forwarded to PATHFINDER."
        );


        /* ---------------------------------------------
           REQUEST LOCATION
        --------------------------------------------- */

        requestLocation();
    }
