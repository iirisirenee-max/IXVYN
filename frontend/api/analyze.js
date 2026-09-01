/*
=========================================================
IXVYN — LENS / AI ANALYSIS API
=========================================================

Vercel Serverless Function

Receives an image from IXVYN LENS and sends it to
Google Gemini for visual infrastructure analysis.

IMPORTANT:
The Gemini API key stays on the server.
It must be stored in Vercel Environment Variables as:

GEMINI_API_KEY

=========================================================
*/

export default async function handler(req, res) {

    /*
    =====================================================
    METHOD CHECK
    =====================================================
    */

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            error: "METHOD_NOT_ALLOWED"
        });

    }


    /*
    =====================================================
    API KEY
    =====================================================
    */

    const apiKey =
        process.env.GEMINI_API_KEY;

    if (!apiKey) {

        console.error(
            "IXVYN: GEMINI_API_KEY is missing."
        );

        return res.status(500).json({
            success: false,
            error: "GEMINI_API_KEY_MISSING"
        });

    }


    /*
    =====================================================
    READ REQUEST
    =====================================================
    */

    try {

        const body = req.body || {};

        /*
        Accept several possible names so the frontend
        doesn't have to be rewritten just because the
        image field has a different name.
        */

        let image =
            body.image ||
            body.imageData ||
            body.dataUrl ||
            body.base64;

        let mimeType =
            body.mimeType ||
            body.mime_type ||
            "image/jpeg";


        /*
        =================================================
        IMAGE VALIDATION
        =================================================
        */

        if (!image) {

            return res.status(400).json({
                success: false,
                error: "NO_IMAGE_PROVIDED"
            });

        }


        /*
        If the frontend sends:

        data:image/jpeg;base64,AAAA...

        remove the prefix because Gemini expects only
        the base64 payload.
        */

        if (image.startsWith("data:")) {

            const match =
                image.match(
                    /^data:([^;]+);base64,(.+)$/
                );

            if (match) {

                mimeType =
                    match[1];

                image =
                    match[2];

            }

        }


        /*
        Remove accidental whitespace.
        */

        image =
            image.replace(/\s/g, "");


        /*
        =================================================
        GEMINI PROMPT
        =================================================
        */

        const prompt = `

You are IXVYN LENS, a visual infrastructure
inspection intelligence system.

Analyze the submitted image for visible
infrastructure or public-space anomalies.

Your job is NOT to invent information.

Only report an anomaly when there is visible
evidence in the image.

Possible categories include:

- pothole
- road-surface deformation
- pavement crack
- drainage problem
- standing water
- damaged sidewalk
- exposed infrastructure
- garbage accumulation
- structural crack
- damaged road edge
- obstruction
- other visible civic infrastructure anomaly
- no significant anomaly

Return ONLY valid JSON.

Use exactly this structure:

{
  "anomalyDetected": true,
  "defect": "POTHOLE",
  "confidence": 96.8,
  "severity": "HIGH",
  "priority": "P1",
  "analysis": "Short explanation of what is visibly present.",
  "recommendedAction": "Short practical inspection or maintenance recommendation.",
  "location": {
    "lat": null,
    "lon": null
  },
  "boundingBox": {
    "x": 0,
    "y": 0,
    "width": 0,
    "height": 0
  }
}

IMPORTANT RULES:

1. confidence must be a number from 0 to 100.

2. severity must be one of:
   LOW
   MEDIUM
   HIGH
   CRITICAL

3. priority must be one of:
   P1
   P2
   P3
   P4

4. Do NOT fabricate GPS coordinates.
   If the image contains no geographic metadata,
   return null for lat and lon.

5. boundingBox must describe the approximate
   location of the main visible anomaly.

6. Bounding box coordinates must be normalized
   from 0 to 1000.

   x = left position
   y = top position
   width = box width
   height = box height

7. If there is no clear anomaly:

{
  "anomalyDetected": false,
  "defect": "NO_SIGNIFICANT_ANOMALY",
  "confidence": 0,
  "severity": "LOW",
  "priority": "P4",
  "analysis": "No clear infrastructure anomaly is visible.",
  "recommendedAction": "No immediate action recommended.",
  "location": {
    "lat": null,
    "lon": null
  },
  "boundingBox": {
    "x": 0,
    "y": 0,
    "width": 0,
    "height": 0
  }
}

Be conservative.
Do not claim structural danger from an image alone.
`;



        /*
        =================================================
        GOOGLE GEMINI REQUEST
        =================================================

        Current production Flash model:
        gemini-3.7-flash
        */

        const endpoint =
            "https://generativelanguage.googleapis.com/v1beta/models/" +
            "gemini-3.6-flash:generateContent";


        const response =
            await fetch(endpoint, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "x-goog-api-key":
                        apiKey

                },

                body: JSON.stringify({

                    contents: [

                        {

                            role: "user",

                            parts: [

                                {
                                    text: prompt
                                },

                                {

                                    inline_data: {

                                        mime_type:
                                            mimeType,

                                        data:
                                            image

                                    }

                                }

                            ]

                        }

                    ],

                   generationConfig: {

    responseMimeType:
        "application/json",

}

                    }

                })

            });



        /*
        =================================================
        GEMINI ERROR
        =================================================
        */

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "IXVYN Gemini error:",
                errorText
            );

            return res.status(
                response.status
            ).json({

                success: false,

                error:
                    "GEMINI_REQUEST_FAILED",

                details:
                    errorText,
                status: 
                    response.status
            
            });

        }



        /*
        =================================================
        READ GEMINI RESPONSE
        =================================================
        */

        const data =
            await response.json();


        const text =
            data
                ?.candidates?.[0]
                ?.content?.parts?.[0]
                ?.text;


        if (!text) {

            console.error(
                "IXVYN: Gemini returned no text.",
                data
            );

            return res.status(502).json({

                success: false,

                error:
                    "EMPTY_GEMINI_RESPONSE"

            });

        }



        /*
        =================================================
        PARSE JSON
        =================================================
        */

        let analysis;

        try {

            analysis =
                JSON.parse(text);

        } catch (parseError) {

            /*
            Gemini occasionally wraps JSON in
            markdown fences.

            Try to recover it.
            */

            const cleaned =
                text
                    .replace(
                        /```json/gi,
                        ""
                    )
                    .replace(
                        /```/g,
                        ""
                    )
                    .trim();

            try {

                analysis =
                    JSON.parse(cleaned);

            } catch (secondError) {

                console.error(
                    "IXVYN: Could not parse Gemini JSON.",
                    text
                );

                return res.status(502).json({

                    success: false,

                    error:
                        "INVALID_GEMINI_JSON",

                    raw:
                        text

                });

            }

        }



        /*
        =================================================
        NORMALIZE RESPONSE
        =================================================
        */

        const result = {

            success: true,

            anomalyDetected:
                Boolean(
                    analysis.anomalyDetected
                ),

            defect:
                analysis.defect ||
                "UNKNOWN",

            confidence:
                Number(
                    analysis.confidence || 0
                ),

            severity:
                analysis.severity ||
                "LOW",

            priority:
                analysis.priority ||
                "P4",

            analysis:
                analysis.analysis ||
                "No analysis available.",

            recommendedAction:
                analysis.recommendedAction ||
                "Please retry the inspection.",

            location: {

                lat:
                    analysis.location?.lat ??
                    null,

                lon:
                    analysis.location?.lon ??
                    null

            },

            boundingBox: {

                x:
                    Number(
                        analysis.boundingBox?.x || 0
                    ),

                y:
                    Number(
                        analysis.boundingBox?.y || 0
                    ),

                width:
                    Number(
                        analysis.boundingBox?.width || 0
                    ),

                height:
                    Number(
                        analysis.boundingBox?.height || 0
                    )

            }

        };



        /*
        =================================================
        SAFETY CLAMP
        =================================================
        */

        result.confidence =
            Math.max(
                0,
                Math.min(
                    100,
                    result.confidence
                )
            );


        /*
        =================================================
        LOG
        =================================================
        */

        console.log(
            "IXVYN LENS analysis:",
            result.defect,
            result.confidence + "%",
            result.severity,
            result.priority
        );


        /*
        =================================================
        RETURN RESULT
        =================================================
        */

        return res.status(200).json(
            result
        );


    } catch (error) {

        /*
        =================================================
        UNEXPECTED ERROR
        =================================================
        */

        console.error(
            "IXVYN ANALYSIS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            error:
                "INTERNAL_ANALYSIS_ERROR",

            message:
                error.message

        });

    }

}
