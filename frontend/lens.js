/* =========================================================
   IXVYN — LENS / VISUAL INFRASTRUCTURE INTELLIGENCE
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
       MOBILE-SAFE
    ===================================================== */

    imageInput.addEventListener(
        "change",
        (event) => {

            console.log(
                "IXVYN LENS: File input changed."
            );

            handleFileSelection(event);

        }
    );


    /*
       Explicitly open the native file picker
       when the upload area is tapped.
    */

    uploadZone.addEventListener(
        "click",
        () => {

            if (!selectedFile) {

                imageInput.click();

            }

        }
    );


    /* =====================================================
       FILE SELECTION
    ===================================================== */

    function handleFileSelection(event) {

        console.log(
            "IXVYN LENS: Processing selected file..."
        );


        const files =
            event.target.files;


        if (
            !files ||
            files.length === 0
        ) {

            console.warn(
                "IXVYN LENS: No file selected."
            );

            return;
        }


        const file =
            files[0];


        console.log(
            "IXVYN LENS: Selected:",
            file.name,
            file.type,
            file.size
        );


        /*
           Make sure the selected file
           is actually an image.
        */

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


        /* =================================================
           CLEAN PREVIOUS IMAGE URL
           ================================================= */

        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );

        }


        /* =================================================
           CREATE LOCAL IMAGE PREVIEW
           ================================================= */

        selectedImageURL =
            URL.createObjectURL(file);


        previewImage.src =
            selectedImageURL;


        resultImage.src =
            selectedImageURL;


        /* =================================================
           FILE INFORMATION
           ================================================= */

        fileName.textContent =
            file.name;


        /* =================================================
           SHOW PREVIEW
           ================================================= */

        inspectionPreview.hidden =
            false;


        /* =================================================
           ENABLE ANALYSIS
           ================================================= */

        analyzeButton.disabled =
            false;


        /* =================================================
           UPDATE SYSTEM STATE
           ================================================= */

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


            if (
                !file.type ||
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please drop an image file."
                );

                return;

            }


            /*
               Reuse the same file-processing
               logic as the normal picker.
            */

            processFile(file);

        }
    );


    /* =====================================================
       SHARED FILE PROCESSOR
       ===================================================== */

    function processFile(file) {

        console.log(
            "IXVYN LENS: Processing:",
            file.name
        );


        selectedFile =
            file;


        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );

        }


        selectedImageURL =
            URL.createObjectURL(file);


        previewImage.src =
            selectedImageURL;


        resultImage.src =
            selectedImageURL;


        fileName.textContent =
            file.name;


        inspectionPreview.hidden =
            false;


        analyzeButton.disabled =
            false;


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


        analysisRunning =
            true;


        analyzeButton.disabled =
            true;


        systemState.textContent =
            "ANALYZING";


        /* =================================================
           SHOW ANALYSIS
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


        /* =================================================
           VISUAL ANALYSIS
           ================================================= */

        await animateProgress(
            progressVision,
            barVision,
            100,
            1400,
            "VISUAL ANALYSIS"
        );


        /* =================================================
           CLASSIFICATION
           ================================================= */

        await animateProgress(
            progressClassification,
            barClassification,
            100,
            1100,
            "DEFECT CLASSIFICATION"
        );


        /* =================================================
           SEVERITY
           ================================================= */

        await animateProgress(
            progressSeverity,
            barSeverity,
            100,
            900,
            "SEVERITY ASSESSMENT"
        );


        /* =================================================
           COMPLETE
           ================================================= */

        analysisStatus.textContent =
            "ANALYSIS COMPLETE";


        /*
        =====================================================
        TEMPORARY DEMO RESULT

        THIS WILL BE REPLACED WITH REAL AI.

        DO NOT PRESENT THIS AS REAL AI DETECTION.
        =====================================================
        */

        const result =
            createTemporaryResult();


        renderResult(
            result
        );


        await sleep(500);


        showResults();


        analysisRunning =
            false;

    }


    /* =====================================================
       TEMPORARY RESULT
       ===================================================== */

    function createTemporaryResult() {

        return {

            defect:
                "POTHOLE",

            confidence:
                96.8,

            severity:
                "HIGH",

            priority:
                "P1",

            description:
                "Visible road-surface deformation detected within the submitted frame.",

            action:
                "Prioritize field verification and repair assessment."

        };

    }


    /* =====================================================
       RENDER RESULT
       ===================================================== */

    function renderResult(result) {

        resultDefect.textContent =
            result.defect;


        resultConfidence.textContent =
            result.confidence;


        resultSeverity.textContent =
            result.severity;


        resultPriority.textContent =
            result.priority;


        resultDescription.textContent =
            result.description;


        resultAction.textContent =
            result.action;


        resultImage.src =
            selectedImageURL;


        requestLocation();

    }


    /* =====================================================
       GEOLOCATION
       ===================================================== */

    function requestLocation() {

        if (
            !navigator.geolocation
        ) {

            resultLat.textContent =
                "UNAVAILABLE";


            resultLon.textContent =
                "UNAVAILABLE";


            return;

        }


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


        systemState.textContent =
            "ANOMALY DETECTED";


        inspectionResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        console.log(
            "IXVYN LENS: Result displayed."
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


        selectedFile =
            null;


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


        resultImage.src =
            "";


        /* ---------------------------------------------
           RESET TEXT
        --------------------------------------------- */

        fileName.textContent =
            "—";


        resultDefect.textContent =
            "—";


        resultConfidence.textContent =
            "—";


        resultSeverity.textContent =
            "—";


        resultPriority.textContent =
            "—";


        resultDescription.textContent =
            "—";


        resultAction.textContent =
            "—";


        resultLat.textContent =
            "—";


        resultLon.textContent =
            "—";


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


        analysisRunning =
            false;


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
                       Smooth ease-out.
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


    console.log(
        "IXVYN LENS: Visual inspection interface ready."
    );

});
