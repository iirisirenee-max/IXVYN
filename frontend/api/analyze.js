/*
=========================================================
IXVYN — LENS / ROAD-SCENE OBSERVATION API
=========================================================

LENS = OBSERVE

This endpoint:
1. receives a road-scene image
2. sends it to Gemini
3. extracts visible evidence
4. returns structured scene observations

LENS DOES NOT:
- calculate risk
- assign severity
- assign priority
- recommend interventions
- decide what a municipality should do

Those responsibilities belong to SIGNAL / TRAJECTORY / CIVIC.
=========================================================
*/

export default async function handler(req, res) {

    /* =====================================================
       METHOD
    ===================================================== */

    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            error:
                "METHOD_NOT_ALLOWED"
        });
    }

    /* =====================================================
       API KEY
    ===================================================== */

    const apiKey =
        process.env.GEMINI_API_KEY;

    if (!apiKey) {

        console.error(
            "IXVYN: GEMINI_API_KEY is missing."
        );

        return res.status(500).json({

            success: false,

            error:
                "GEMINI_API_KEY_MISSING"
        });
    }

    try {

        /* =================================================
           READ REQUEST
        ================================================= */

        const body =
            req.body || {};

        let image =
            body.image ||
            body.imageData ||
            body.dataUrl ||
            body.base64;

        let mimeType =
            body.mimeType ||
            body.mime_type ||
            "image/jpeg";

        if (!image) {

            return res.status(400).json({

                success: false,

                error:
                    "NO_IMAGE_PROVIDED"
            });
        }

        /* =================================================
           DATA URL CLEANUP
        ================================================= */

        if (
            typeof image === "string" &&
            image.startsWith("data:")
        ) {

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

        image =
            image.replace(
                /\s/g,
                ""
            );

        /* =================================================
           LENS PROMPT
        ================================================= */

        const prompt = `

You are IXVYN LENS.

LENS is the OBSERVE layer of a road-safety intelligence system.

Your job is to observe and describe visible evidence in the submitted road scene.

You are NOT the risk assessment system.

You are NOT the decision system.

You are NOT the intervention system.

Therefore:

DO NOT calculate risk.

DO NOT assign severity.

DO NOT assign priority.

DO NOT recommend an intervention.

DO NOT decide who is responsible.

DO NOT prescribe what a municipality should do.

DO NOT fabricate information that cannot be supported by the image.

Your output will be passed to another system called SIGNAL.

SIGNAL will use your observations to perform safety assessment.

---------------------------------------------------------
OBSERVE THE WHOLE SCENE
---------------------------------------------------------

Look for visible evidence involving:

ROAD:
- road type
- lane structure
- lane count when reasonably observable
- intersection presence
- crossing presence
- geometry
- lane markings

PEOPLE:
- pedestrian presence
- approximate pedestrian density category
- vulnerable road users such as pedestrians, cyclists, children, wheelchair users, etc. when visibly supported
- accessibility-related observations

VEHICLES:
- vehicle presence
- broad traffic density category
- visible vehicle types
- motorcycles
- buses
- trucks
- cars
- bicycles

INFRASTRUCTURE:
- road surface
- sidewalk
- crossing infrastructure
- lane markings
- road edge
- lighting
- barriers
- signs
- traffic-control infrastructure
- other visible infrastructure

OBSTRUCTIONS:
- parked vehicles
- construction
- objects
- vegetation
- damaged infrastructure
- anything visibly obstructing movement or sight lines

VISIBILITY:
- clear
- partially obstructed
- obstructed
- unknown
- visible factors causing obstruction

INTERACTIONS:
Describe visible relationships between road users and infrastructure.

Examples:

"pedestrians are present near a marked crossing"

"vehicles are present near the crossing"

"parked vehicles partially obstruct the sidewalk"

"motorcycles are visible alongside general traffic"

Do NOT invent trajectories, speed, collision probability, or intent.

---------------------------------------------------------
EVIDENCE DISCIPLINE
---------------------------------------------------------

If something is visible, report it.

If something is uncertain, put it under "uncertain".

If something cannot be determined from the frame, put it under "notObservable".

Use:

"UNKNOWN"

or

"NOT OBSERVABLE FROM FRAME"

rather than inventing precision.

Do not fabricate:

- exact pedestrian counts
- exact vehicle counts
- vehicle speed
- time-to-collision
- trajectory prediction
- GPS coordinates
- hidden infrastructure
- causality that cannot be visually established

---------------------------------------------------------
OUTPUT
---------------------------------------------------------

Return ONLY valid JSON.

Use exactly this structure:

{
  "schema": "IXVYN_SCENE_OBSERVATION_V2",

  "sceneType": "",

  "confidence": 0,

  "road": {
    "sceneType": "",
    "laneCount": null,
    "intersection": "YES | NO | UNKNOWN",
    "crossing": "YES | NO | UNKNOWN",
    "geometry": "",
    "laneMarkings": ""
  },

  "people": {
    "presence": "NONE | LOW | MODERATE | HIGH | UNKNOWN",
    "vulnerableRoadUsers": [],
    "accessibilityObservations": []
  },

  "vehicles": {
    "presence": "NONE | LOW | MODERATE | HIGH | UNKNOWN",
    "types": []
  },

  "infrastructure": {
    "roadSurface": "",
    "sidewalk": "",
    "crossing": "",
    "markings": "",
    "roadEdge": "",
    "lighting": "",
    "other": []
  },

  "obstructions": [],

  "visibility": {
    "state": "CLEAR | PARTIAL | OBSTRUCTED | UNKNOWN",
    "factors": []
  },

  "interactions": [],

  "observations": [],

  "evidence": {
    "clear": [],
    "uncertain": [],
    "notObservable": []
  },

  "sceneSummary": ""
}

---------------------------------------------------------
FIELD RULES
---------------------------------------------------------

confidence:

A number from 0 to 100 representing confidence in the visual scene interpretation.

Do NOT interpret confidence as safety risk.

laneCount:

Use a number only when the visible road geometry supports it.

Otherwise:

null

intersection:

YES, NO, or UNKNOWN.

crossing:

YES, NO, or UNKNOWN.

people.presence:

Use only:

NONE
LOW
MODERATE
HIGH
UNKNOWN

vehicles.presence:

Use only:

NONE
LOW
MODERATE
HIGH
UNKNOWN

sceneSummary:

Provide a concise factual description of the visible road scene.

Do not include risk scores.

Do not include severity.

Do not include priorities.

Do not recommend interventions.

---------------------------------------------------------
SAFETY OF THE OBSERVATION LAYER
---------------------------------------------------------

The purpose of LENS is to preserve evidence.

It should be better to say:

"NOT OBSERVABLE FROM FRAME"

than to invent an apparently precise answer.

Return ONLY JSON.
`;

        /* =================================================
           GEMINI REQUEST
        ================================================= */

        const endpoint =
            "https://generativelanguage.googleapis.com/v1beta/models/" +
            "gemini-3.7-flash:generateContent";

        const response =
            await fetch(
                endpoint,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "x-goog-api-key":
                            apiKey
                    },

                    body:
                        JSON.stringify({

                            contents: [

                                {

                                    role:
                                        "user",

                                    parts: [

                                        {

                                            text:
                                                prompt
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
                                    "application/json"
                            }
                        })
                }
            );

        /* =================================================
           GEMINI ERROR
        ================================================= */

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

        /* =================================================
           GEMINI RESPONSE
        ================================================= */

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

        /* =================================================
           PARSE JSON
        ================================================= */

        let analysis;

        try {

            analysis =
                JSON.parse(text);

        } catch {

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

            } catch (error) {

                console.error(
                    "IXVYN: invalid Gemini JSON.",
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

        /* =================================================
           NORMALIZE OBSERVATION
        ================================================= */

        const confidence =
            Number(
                analysis.confidence
            );

        const result = {

            success:
                true,

            schema:
                "IXVYN_SCENE_OBSERVATION_V2",

            sceneType:
                analysis.sceneType ||
                analysis.road?.sceneType ||
                "ROAD SCENE",

            confidence:
                Number.isFinite(confidence)
                    ? Math.max(
                        0,
                        Math.min(
                            100,
                            confidence
                        )
                    )
                    : 0,

            road:
                analysis.road || {},

            people:
                analysis.people || {},

            vehicles:
                analysis.vehicles || {},

            infrastructure:
                analysis.infrastructure || {},

            obstructions:
                Array.isArray(
                    analysis.obstructions
                )
                    ? analysis.obstructions
                    : [],

            visibility:
                analysis.visibility || {},

            interactions:
                Array.isArray(
                    analysis.interactions
                )
                    ? analysis.interactions
                    : [],

            observations:
                Array.isArray(
                    analysis.observations
                )
                    ? analysis.observations
                    : [],

            evidence:
                analysis.evidence || {

                    clear: [],

                    uncertain: [],

                    notObservable: []
                },

            sceneSummary:
                analysis.sceneSummary ||
                "Scene observed."
        };

        /* =================================================
           IMPORTANT:
           NO RISK / SEVERITY / PRIORITY HERE.
        ================================================= */

        console.log(
            "IXVYN LENS observation:",
            result
        );

        return res.status(200).json(
            result
        );

    } catch (error) {

        console.error(
            "IXVYN ANALYSIS ERROR:",
            error
        );

        return res.status(500).json({

            success:
                false,

            error:
                "INTERNAL_ANALYSIS_ERROR",

            message:
                error.message
        });
    }
}
