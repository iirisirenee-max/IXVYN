export default async function handler(req, res) {
    /*
     * IXVYN — LENS
     * Real multimodal infrastructure analysis
     */

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { image, mimeType } = req.body || {};

        if (!image) {
            return res.status(400).json({
                error: "No image received."
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "GEMINI_API_KEY is not configured."
            });
        }

        /*
         * Remove data:image/jpeg;base64,... if the browser
         * sends a complete data URL.
         */

        const base64Image =
            image.includes(",")
                ? image.split(",")[1]
                : image;

        const detectedMimeType =
            mimeType ||
            (
                image.startsWith("data:image/png")
                    ? "image/png"
                    : "image/jpeg"
            );

        /*
         * IXVYN inspection instructions.
         */

        const prompt = `
You are IXVYN LENS, a visual infrastructure inspection
system.

Analyze the submitted image ONLY for visible,
actionable infrastructure or civic anomalies.

Possible categories include:

- pothole
- road-surface deformation
- road crack
- structural crack
- exposed reinforcement
- damaged pavement
- drainage problem
- standing water affecting infrastructure
- damaged public infrastructure
- illegal dumping / obstruction
- other visible infrastructure anomaly

IMPORTANT:

1. Do NOT invent an anomaly.
2. Do NOT assume that every image contains a defect.
3. If the evidence is insufficient, return no_actionable_anomaly.
4. Do not claim structural danger from appearance alone.
5. Confidence must reflect visual evidence.
6. Severity is an inspection priority, NOT a statement that
   a structure is unsafe.
7. Do not invent GPS coordinates.
8. Bounding boxes must use normalized coordinates from
   0 to 1000 in this order:
   [ymin, xmin, ymax, xmax]

Return exactly the requested JSON structure.
`;

        /*
         * Gemini REST request.
         */

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },

                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                },
                                {
                                    inline_data: {
                                        mime_type:
                                            detectedMimeType,
                                        data:
                                            base64Image
                                    }
                                }
                            ]
                        }
                    ],

                    generationConfig: {
                        temperature: 0.1,

                        responseMimeType:
                            "application/json",

                        responseSchema: {
                            type: "object",

                            properties: {

                                status: {
                                    type: "string",
                                    enum: [
                                        "anomaly_detected",
                                        "no_actionable_anomaly"
                                    ]
                                },

                                defect: {
                                    type: "string"
                                },

                                confidence: {
                                    type: "number"
                                },

                                severity: {
                                    type: "string",
                                    enum: [
                                        "LOW",
                                        "MEDIUM",
                                        "HIGH"
                                    ]
                                },

                                priority: {
                                    type: "string",
                                    enum: [
                                        "P1",
                                        "P2",
                                        "P3"
                                    ]
                                },

                                description: {
                                    type: "string"
                                },

                                recommendedAction: {
                                    type: "string"
                                },

                                box_2d: {
                                    type: "array",
                                    items: {
                                        type: "integer"
                                    }
                                }
                            },

                            required: [
                                "status",
                                "defect",
                                "confidence",
                                "severity",
                                "priority",
                                "description",
                                "recommendedAction",
                                "box_2d"
                            ]
                        }
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Gemini API error:",
                data
            );

            return res.status(500).json({
                error:
                    data?.error?.message ||
                    "Gemini analysis failed."
            });
        }

        /*
         * Extract Gemini text.
         */

        const text =
            data?.candidates?.[0]?.content?.parts
                ?.map(part => part.text || "")
                .join("")
                .trim();

        if (!text) {
            return res.status(500).json({
                error:
                    "Gemini returned no analysis."
            });
        }

        let result;

        try {

            result = JSON.parse(text);

        } catch (parseError) {

            console.error(
                "Invalid Gemini JSON:",
                text
            );

            return res.status(500).json({
                error:
                    "Gemini returned invalid structured data."
            });
        }

        /*
         * Normalize confidence.
         */

        result.confidence =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(result.confidence) || 0
                )
            );

        /*
         * Never allow a fake bounding box.
         */

        if (
            !Array.isArray(result.box_2d) ||
            result.box_2d.length !== 4
        ) {
            result.box_2d = [
                0,
                0,
                0,
                0
            ];
        }

        return res.status(200).json(result);

    } catch (error) {

        console.error(
            "IXVYN analysis error:",
            error
        );

        return res.status(500).json({
            error:
                error.message ||
                "Unexpected analysis error."
        });
    }
}
