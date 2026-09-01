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

    const resultLat =
        document.getElementById("result-lat");

    const resultLon =
        document.getElementById("result-lon");

    const newInspection =
        document.getElementById("new-inspection");


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

            /*
             * Start the REAL AI request immediately.
             *
             * While Gemini is processing,
             * IXVYN runs the visual telemetry animation.
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


            /*
             * Wait for the REAL Gemini result.
             */

            const result =
                await aiRequest;


            analysisStatus.textContent =
                "ANALYSIS COMPLETE";


            console.log(
                "IXVYN LENS: REAL AI RESULT:",
                result
            );


            renderResult(
                result
            );


            await sleep(500);

            showResults();


        } catch (error) {

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
                                    1600;


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
                Number(
                    result.confidence
                );


            resultConfidence.textContent =
                Number.isFinite(confidence)
                    ? `${confidence.toFixed(1)}%`
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
           LOCATION
        --------------------------------------------- */

        /*
         * Gemini cannot know the phone's actual GPS
         * coordinates from an ordinary photograph.
         *
         * IXVYN therefore gets the inspection location
         * from the browser.
         */

        requestLocation();
    }


    /* =====================================================
       REAL BOUNDING BOX
       ===================================================== */

    function renderBoundingBox(boundingBox) {

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
         * =================================================
         * FORMAT 1
         *
         * Gemini may return:
         *
         * {
         *     xmin,
         *     ymin,
         *     xmax,
         *     ymax
         * }
         * =================================================
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


            /*
             * Gemini's normalized coordinate space
             * is generally 0–1000.
             *
             * If the numbers are larger than 1,
             * convert to percentages.
             */

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
         * =================================================
         * FORMAT 2
         *
         * Existing IXVYN format:
         *
         * {
         *     x,
         *     y,
         *     width,
         *     height
         * }
         * =================================================
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


            /*
             * Automatically detect coordinate scale.
             *
             * 0–1     = normalized
             * 0–100   = percentage
             * 0–1000  = Gemini normalized
             */

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

                /*
                 * Already percentage coordinates.
                 */

            } else {

                /*
                 * Gemini 0–1000 coordinate space.
                 */

                x /= 10;
                y /= 10;
                width /= 10;
                height /= 10;
            }
        }


        /*
         * Unsupported format.
         */

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


        /*
         * =================================================
         * SANITY CHECK
         * =================================================
         */

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


        /*
         * Repair reversed coordinates.
         */

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


        /*
         * =================================================
         * CLAMP
         * =================================================
         */

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


        /*
         * Ignore unusably tiny boxes.
         */

        if (
            width < 1 ||
            height < 1
        ) {

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );

            return;
        }


        /*
         * =================================================
         * APPLY DETECTION
         * ================================================= */

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


        console.log(
            "IXVYN LENS: AI bounding box rendered.",
            {
                x,
                y,
                width,
                height,
                original: boundingBox
            }
        );
    }


    /* =====================================================
       VALIDATE BOUNDING BOX
    ===================================================== */

    function isValidBoundingBox(box) {

        if (!box) {
            return false;
        }


        const x =
            Number(box.x);

        const y =
            Number(box.y);

        const width =
            Number(box.width);

        const height =
            Number(box.height);


        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y) ||
            !Number.isFinite(width) ||
            !Number.isFinite(height)
        ) {

            return false;
        }


        if (
            width <= 0 ||
            height <= 0
        ) {

            return false;
        }


        return true;
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

            resultLat.textContent =
                "UNAVAILABLE";

            resultLon.textContent =
                "UNAVAILABLE";

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


                resultLat.textContent =
                    latitude.toFixed(5);

                resultLon.textContent =
                    longitude.toFixed(5);


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


                resultLat.textContent =
                    "UNAVAILABLE";

                resultLon.textContent =
                    "UNAVAILABLE";
            },


            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0
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


        console.log(
            "IXVYN LENS: Result displayed."
        );
    }


    /* =====================================================
       ERROR SCREEN
    ===================================================== */

    function showAnalysisError(error) {

        if (resultDefect) {

            resultDefect.textContent =
                "ANALYSIS UNAVAILABLE";
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


        if (resultDescription) {

            resultDescription.textContent =
                error?.message ||
                "The visual analysis could not be completed.";
        }


        if (resultAction) {

            resultAction.textContent =
                "Please retry the inspection.";
        }


        if (resultImage) {

            resultImage.src =
                selectedImageURL || "";
        }


        /*
         * Never leave a stale detection box
         * visible after an error.
         */

        if (resultOverlay) {

            resultOverlay.style.display =
                "none";

            resultOverlay.removeAttribute(
                "data-ai-detection"
            );
        }


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


        selectedFile =
            null;

        analysisRunning =
            false;


        /* ---------------------------------------------
           CLEAN OBJECT URL
        --------------------------------------------- */

        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );

            selectedImageURL =
                null;
        }


        /* ---------------------------------------------
           RESET INPUT
        --------------------------------------------- */

        imageInput.value =
            "";


        /* ---------------------------------------------
           RESET IMAGES
        --------------------------------------------- */

        previewImage.src =
            "";


        if (resultImage) {

            resultImage.src =
                "";
        }


        /* ---------------------------------------------
           RESET DETECTION BOX
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
           RESET SCREENS
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
           RESET BUTTON
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
           RESET SYSTEM
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


                    /*
                     * Smooth ease-out.
                     */

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
       UTILITY
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
       INITIAL STATE
    ===================================================== */

    inspectionPreview.hidden =
        true;

    analysisState.hidden =
        true;

    inspectionResults.hidden =
        true;

    analyzeButton.disabled =
        true;


    /*
     * Hide detection box until Gemini
     * supplies a valid bounding box.
     */

    if (resultOverlay) {

        resultOverlay.style.display =
            "none";

    }


    console.log(
        "IXVYN LENS: Real visual inspection interface ready."
    );

});
