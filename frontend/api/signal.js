/* =========================================================
   IXVYN /api/signal
   SIGNAL — SAFETY ASSESSMENT

   LENS = observation
   SIGNAL = assessment
   TRAJECTORY = decision
========================================================= */

export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed."
        });
    }


    try {

        const apiKey =
            process.env.GEMINI_API_KEY;


        if (!apiKey) {

            return res.status(500).json({
                error:
                    "GEMINI_API_KEY is not configured."
            });
        }


        const observation =
            req.body?.observation;


        if (
            !observation ||
            typeof observation !== "object"
        ) {

            return res.status(400).json({
                error:
                    "A LENS observation is required."
            });
        }


        /* =================================================
           SIGNAL PROMPT
        ================================================= */

        const prompt = `
You are SIGNAL, the ASSESS layer of IXVYN's Vision Zero road-safety intelligence system.

Your role is to assess safety risk from an already-observed road scene.

LENS has already observed the scene.

You must NOT:
- invent observations
- invent exact vehicle speeds
- invent exact trajectories
- invent exact pedestrian counts
- invent GPS coordinates
- choose an intervention
- recommend a specific engineering treatment
- decide what a municipality must do
- pretend uncertainty is certainty

You MUST:
- use only the supplied LENS observation
- distinguish evidence from inference
- assess relative safety risk
- identify contributing factors
- identify potential conflict indicators
- assess exposure
- consider vulnerable road users
- identify evidence strength
- explicitly identify unknowns and evidence gaps
- explain why the assessment was produced

Risk score:
0–20 = LOW
21–40 = GUARDED
41–60 = ELEVATED
61–80 = HIGH
81–100 = CRITICAL

The score is an assessment signal, NOT a prediction of accidents.

If evidence is weak, lower confidence and explicitly state what is unknown.

Do not fabricate precision.

Return ONLY valid JSON.

Required JSON schema:

{
  "schema": "IXVYN_SAFETY_SIGNAL_V1",

  "riskScore": 0,

  "riskLevel": "LOW | GUARDED | ELEVATED | HIGH | CRITICAL | UNKNOWN",

  "headline": "",

  "reasoning": "",

  "contributingFactors": [],

  "conflictIndicators": [],

  "exposure": [],

  "vulnerableRoadUsers": [],

  "evidenceStrength": "STRONG | MODERATE | LIMITED | INSUFFICIENT",

  "evidence": {
    "supported": [],
    "unknowns": []
  }
}

Important:

A contributing factor must be grounded in the observation.

A conflict indicator should describe a visible or reasonably supported interaction pattern, not claim that a collision will occur.

Exposure can describe things such as:
- presence of pedestrians
- presence of cyclists
- traffic presence
- crossing activity
- road-user density
- repeated interaction points visible in the frame

Vulnerable road user considerations may include:
- pedestrians
- cyclists
- motorcyclists
- wheelchair users
- mobility-impaired users
- children
only when supported or reasonably visible from the supplied evidence.

If something cannot be established from the image, put it in evidence.unknowns.

Never produce an intervention recommendation.

LENS OBSERVATION:

${JSON.stringify(observation, null, 2)}
`;


        /* =================================================
           GEMINI REQUEST
        ================================================= */

        const response =
            await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=" +
                encodeURIComponent(apiKey),
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        contents: [
                            {
                                role: "user",

                                parts: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ],

                        generationConfig: {
                            temperature: 0.15,

                            responseMimeType:
                                "application/json"
                        }
                    })
                }
            );


        const raw =
            await response.text();


        if (!response.ok) {

            console.error(
                "SIGNAL Gemini error:",
                raw
            );

            return res.status(502).json({
                error:
                    "SIGNAL model request failed."
            });
        }


        let gemini;

        try {

            gemini =
                JSON.parse(raw);

        } catch {

            return res.status(502).json({
                error:
                    "SIGNAL received invalid model response."
            });
        }


        const generatedText =
            gemini
                ?.candidates?.[0]
                ?.content?.parts?.[0]
                ?.text;


        if (!generatedText) {

            return res.status(502).json({
                error:
                    "SIGNAL received no assessment."
            });
        }


        /* =================================================
           PARSE MODEL JSON
        ================================================= */

        let assessment;

        try {

            assessment =
                JSON.parse(
                    cleanJSON(
                        generatedText
                    )
                );

        } catch (error) {

            console.error(
                "SIGNAL JSON parse error:",
                generatedText
            );

            return res.status(502).json({
                error:
                    "SIGNAL returned malformed assessment."
            });
        }


        /* =================================================
           NORMALIZE
        ================================================= */

        assessment = normalizeAssessment(
            assessment
        );


        return res.status(200).json({
            ok: true,

            assessment
        });


    } catch (error) {

        console.error(
            "IXVYN SIGNAL ERROR:",
            error
        );

        return res.status(500).json({
            error:
                "Unable to complete SIGNAL assessment."
        });
    }
}


/* =========================================================
   CLEAN JSON
========================================================= */

function cleanJSON(value) {

    let text =
        String(value)
            .trim();


    if (
        text.startsWith("```")
    ) {

        text =
            text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();
    }


    const first =
        text.indexOf("{");

    const last =
        text.lastIndexOf("}");


    if (
        first >= 0 &&
        last > first
    ) {

        text =
            text.slice(
                first,
                last + 1
            );
    }


    return text;
}


/* =========================================================
   NORMALIZE ASSESSMENT
========================================================= */

function normalizeAssessment(
    assessment
) {

    const allowedLevels = [
        "LOW",
        "GUARDED",
        "ELEVATED",
        "HIGH",
        "CRITICAL",
        "UNKNOWN"
    ];


    const allowedEvidence = [
        "STRONG",
        "MODERATE",
        "LIMITED",
        "INSUFFICIENT"
    ];


    let score =
        Number(
            assessment?.riskScore
        );


    if (
        !Number.isFinite(score)
    ) {

        score = null;

    } else {

        score =
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(score)
                )
            );
    }


    let level =
        String(
            assessment?.riskLevel ||
            "UNKNOWN"
        ).toUpperCase();


    if (
        !allowedLevels.includes(level)
    ) {

        level = "UNKNOWN";
    }


    let evidenceStrength =
        String(
            assessment?.evidenceStrength ||
            "INSUFFICIENT"
        ).toUpperCase();


    if (
        !allowedEvidence.includes(
            evidenceStrength
        )
    ) {

        evidenceStrength =
            "INSUFFICIENT";
    }


    return {

        schema:
            "IXVYN_SAFETY_SIGNAL_V1",

        riskScore:
            score,

        riskLevel:
            level,

        headline:
            safeString(
                assessment?.headline,
                "Safety signal assessed."
            ),

        reasoning:
            safeString(
                assessment?.reasoning,
                "Assessment reasoning unavailable."
            ),

        contributingFactors:
            safeArray(
                assessment?.contributingFactors
            ),

        conflictIndicators:
            safeArray(
                assessment?.conflictIndicators
            ),

        exposure:
            safeArray(
                assessment?.exposure
            ),

        vulnerableRoadUsers:
            safeArray(
                assessment?.vulnerableRoadUsers
            ),

        evidenceStrength,

        evidence: {

            supported:
                safeArray(
                    assessment?.evidence?.supported
                ),

            unknowns:
                safeArray(
                    assessment?.evidence?.unknowns
                )
        }
    };
}


/* =========================================================
   HELPERS
========================================================= */

function safeString(
    value,
    fallback
) {

    if (
        typeof value !== "string" ||
        !value.trim()
    ) {

        return fallback;
    }

    return value.trim();
}


function safeArray(value) {

    if (
        !Array.isArray(value)
    ) {

        return [];
    }


    return value
        .slice(0, 20)
        .map(item => {

            if (
                typeof item === "string"
            ) {

                return item;
            }


            if (
                item &&
                typeof item === "object"
            ) {

                return (
                    item.label ||
                    item.type ||
                    item.description ||
                    item.factor ||
                    item.reason ||
                    JSON.stringify(item)
                );
            }


            return String(item);

        })
        .filter(Boolean);
}
