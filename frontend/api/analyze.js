/*
=========================================================
IXVYN — LENS / AI ANALYSIS API
=========================================================

Vercel Serverless Function

LENS = OBSERVE.

This endpoint receives a road-scene image from IXVYN LENS
and asks Gemini to describe only what is visibly observable.

LENS does NOT:
- calculate risk
- assign severity
- assign priority
- prescribe interventions
- make municipal decisions

Those belong to downstream IXVYN systems.

GEMINI_API_KEY must remain server-side in Vercel
Environment Variables.
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

        const body =
            req.body || {};


        /*
        Accept several possible image field names.
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
        =================================================
        DATA URL CLEANUP
        =================================================

        If the frontend sends:

        data:image/jpeg;base64,AAAA...

        remove the prefix.
        */

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


        /*
        Remove accidental whitespace.
        */

        image =
            String(image)
                .replace(/\s/g, "");


        /*
        =====================================================
        GEMINI PROMPT
        =====================================================
        */

        const prompt = `

You are IXVYN LENS.

IXVYN LENS is the OBSERVE layer of a Vision Zero
road-safety intelligence system.

Your job is to observe a submitted road-scene image
and produce structured visual evidence.

You are NOT the risk assessment system.

You are NOT the intervention system.

You are NOT the municipal decision-maker.

Therefore:

DO NOT calculate risk.

DO NOT assign severity.

DO NOT assign priority.

DO NOT recommend an intervention.

DO NOT decide what a city should do.

DO NOT infer facts that cannot be supported by the image.

Only describe information that is visually observable
in the submitted frame.

=========================================================
WHAT TO OBSERVE
=========================================================

Observe the complete visible road scene.

Consider:

1. ROAD

- scene type
- approximate visible lane count when reasonably observable
- intersection presence
- crossing presence
- road geometry
- lane markings
- road edges
- road surface condition

2. PEOPLE

Observe:

- whether people are present
- approximate visible presence level
- pedestrians
- cyclists
- wheelchair users or other visibly identifiable
  vulnerable/accessibility-related road users
- visible accessibility observations

Do NOT invent exact people counts when the frame
does not support reliable counting.

3. VEHICLES

Observe:

- whether vehicles are present
- approximate traffic presence
- visible vehicle types
- motorcycles
- cars
- buses
- trucks
- other clearly visible vehicle categories

Do NOT claim vehicle speed unless speed is genuinely
observable from the provided frame.

A single still image normally cannot establish speed.

4. INFRASTRUCTURE

Observe visible infrastructure such as:

- road surface
- sidewalks
- crossings
- lane markings
- curbs
- road edges
- lighting
- signs
- barriers
- traffic-control elements
- other relevant visible infrastructure

5. OBSTRUCTIONS

Describe visible objects or conditions that obstruct:

- pedestrian movement
- cycling movement
- vehicle movement
- visibility

Only report an obstruction when visually supported.

6. VISIBILITY

Describe whether the visible scene appears:

- CLEAR
- PARTIAL
- OBSTRUCTED
- UNKNOWN

Also identify visible factors affecting visibility.

Do not infer weather, lighting conditions, or visibility
outside what the image actually shows.

7. INTERACTIONS

Describe visible relationships between road users
and infrastructure.

Examples:

- pedestrian near vehicle movement
- cyclist near vehicle movement
- pedestrian using crossing
- vehicle approaching crossing
- obstruction near pedestrian path
- unclear separation between road users

Use careful language.

A still image does NOT prove future trajectory,
collision probability, or actual conflict.

If an interaction is ambiguous, say so.

8. GENERAL OBSERVATIONS

Include other useful visual observations that may matter
to a later safety assessment.

These are observations, NOT risk judgments.

=========================================================
EVIDENCE DISCIPLINE
=========================================================

Separate evidence into:

clear:
Things clearly visible in the image.

uncertain:
Things that may be present but cannot be established
with confidence.

notObservable:
Things that cannot be determined from this frame.

When something cannot be determined, explicitly use:

UNKNOWN

or

NOT OBSERVABLE FROM FRAME

Do NOT fabricate:

- exact GPS coordinates
- exact traffic counts
- exact pedestrian counts
- vehicle speeds
- future trajectories
- collision probability
- hidden infrastructure
- historical information
- weather outside the visible frame
- risk scores
- severity
- priority
- intervention recommendations

=========================================================
LOCATION
=========================================================

Do NOT fabricate GPS coordinates.

This endpoint should not derive coordinates from the
visual scene.

Return null for latitude and longitude unless reliable
location metadata has explicitly been supplied to the
request.

=========================================================
BOUNDING BOX
=========================================================

A bounding box is OPTIONAL.

Only provide one when there is a clearly identifiable
visual observation that benefits from localization.

Coordinates must be normalized from 0 to 1000.

x = left
y = top
width = width
height = height

If no useful bounding box can be established, return:

null

=========================================================
IMPORTANT ARCHITECTURAL RULE
=========================================================

LENS observes.

SIGNAL assesses.

TRAJECTORY decides.

CIVIC acts.

MEMORY measures and learns.

Never collapse these responsibilities.

=========================================================
OUTPUT
=========================================================

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

  "boundingBox": null,

  "sceneSummary": ""
}

=========================================================
FIELD RULES
=========================================================

confidence:

A number from 0 to 100 representing confidence in the
overall visual observation.

sceneType:

A concise description such as:

"URBAN INTERSECTION"

"RESIDENTIAL STREET"

"MARKED PEDESTRIAN CROSSING"

"ROADWAY"

"UNKNOWN"

laneCount:

Use a number only when reasonably observable.

Otherwise:

null

intersection:

Only:

YES
NO
UNKNOWN

crossing:

Only:

YES
NO
UNKNOWN

people.presence:

Only:

NONE
LOW
MODERATE
HIGH
UNKNOWN

vehicles.presence:

Only:

NONE
LOW
MODERATE
HIGH
UNKNOWN

visibility.state:

Only:

CLEAR
PARTIAL
OBSTRUCTED
UNKNOWN

Arrays:

Use concise factual observations.

Do not turn observations into recommendations.

sceneSummary:

Provide a short factual summary of what is visibly
present in the frame.

=========================================================
FINAL SAFETY RULE
=========================================================

If the image does not provide enough evidence for a field,
use UNKNOWN, null, an empty array, or
"NOT OBSERVABLE FROM FRAME".

It is better to report uncertainty than to invent precision.

Return ONLY JSON.
`;


        /*
        =====================================================
        GOOGLE GEMINI REQUEST
        =====================================================
        */

        const endpoint =
            "https://generativelanguage.googleapis.com/v1beta/models/" +
            "gemini-3.1-flash-lite:generateContent";


        const response =
            await fetch(
                endpoint,
                {
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
                                "application/json"

                        }

                    })

                }
            );


        /*
        =====================================================
        GEMINI ERROR
        =====================================================
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
        =====================================================
        READ GEMINI RESPONSE
        =====================================================
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
        =====================================================
        PARSE JSON
        =====================================================
        */

        let analysis;


        try {

            analysis =
                JSON.parse(text);

        } catch (parseError) {

            /*
            Gemini can occasionally return markdown
            fences despite the JSON response configuration.
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
        =====================================================
        NORMALIZE RESPONSE
        =====================================================
        */

        const safeArray = (value) => {

            return Array.isArray(value)
                ? value
                : [];

        };


        const safeObject = (value) => {

            return (
                value &&
                typeof value === "object" &&
                !Array.isArray(value)
            )
                ? value
                : {};

        };


        const rawConfidence =
            Number(
                analysis.confidence
            );


        const confidence =
            Number.isFinite(
                rawConfidence
            )
                ? Math.max(
                    0,
                    Math.min(
                        100,
                        rawConfidence
                    )
                )
                : 0;


        const result = {

            success:
                true,

            schema:
                "IXVYN_SCENE_OBSERVATION_V2",

            sceneType:
                analysis.sceneType ||
                analysis.road?.sceneType ||
                "UNKNOWN",

            confidence:


                confidence,


            road:
                safeObject(
                    analysis.road
                ),


            people:
                safeObject(
                    analysis.people
                ),


            vehicles:
                safeObject(
                    analysis.vehicles
                ),


            infrastructure:
                safeObject(
                    analysis.infrastructure
                ),


            obstructions:
                safeArray(
                    analysis.obstructions
                ),


            visibility:
                safeObject(
                    analysis.visibility
                ),


            interactions:
                safeArray(
                    analysis.interactions
                ),


            observations:
                safeArray(
                    analysis.observations
                ),


            evidence:
                safeObject(
                    analysis.evidence
                ),


            boundingBox:
                analysis.boundingBox &&
                typeof analysis.boundingBox === "object"
                    ? analysis.boundingBox
                    : null,


            sceneSummary:
                analysis.sceneSummary ||
                "Scene observed."
        };


        /*
        =====================================================
        LOCATION
        =====================================================

        LENS does not visually invent coordinates.

        The frontend already maintains the inspection
        location separately.
        */

        result.location = {

            lat: null,

            lon: null

        };


        /*
        =====================================================
        LOG
        =====================================================
        */

        console.log(
            "IXVYN LENS scene observation:",
            {
                sceneType:
                    result.sceneType,

                confidence:
                    result.confidence,

                people:
                    result.people?.presence,

                vehicles:
                    result.vehicles?.presence,

                interactions:
                    result.interactions?.length || 0
            }
        );


        /*
        =====================================================
        RETURN RESULT
        =====================================================
        */

        return res.status(200).json(
            result
        );


    } catch (error) {

        /*
        =====================================================
        UNEXPECTED ERROR
        =====================================================
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
