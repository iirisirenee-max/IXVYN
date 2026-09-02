export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "GEMINI_API_KEY is not configured."
            });
        }

        const {
            observation,
            assessment
        } = req.body || {};

        if (!assessment) {
            return res.status(400).json({
                error: "SIGNAL assessment is required."
            });
        }

        const prompt = `
You are TRAJECTORY, the DECIDE layer of IXVYN.

IXVYN is a Vision Zero road-safety intelligence system.

Your job is NOT to automatically decide what a city must do.

Your job is to generate a small set of plausible intervention scenarios
based ONLY on the observed evidence from LENS and the safety assessment
from SIGNAL.

A human decision-maker must remain in control.

Generate 2 to 4 distinct intervention scenarios.

Each scenario should explain:
- what could be changed
- why that change addresses the observed contributing conditions
- expected safety effect
- approximate implementation cost category
- approximate time horizon

Do NOT invent measurements that are not supported by the evidence.

Do NOT claim an intervention will definitely eliminate risk.

Do NOT fabricate exact costs.

Use UNKNOWN when evidence is insufficient.

Possible cost categories:
LOW, MODERATE, HIGH, UNKNOWN

Possible time horizons:
IMMEDIATE, SHORT_TERM, MEDIUM_TERM, LONG_TERM, UNKNOWN

The scenarios should be meaningfully different where possible.

Examples of intervention classes include:
- crossing visibility improvements
- pedestrian crossing redesign
- traffic calming
- lane/road geometry changes
- obstruction removal
- sidewalk/accessibility improvements
- road-marking improvements
- lighting improvements
- protected space for vulnerable road users
- enforcement or observation measures
- further evidence collection

Do not recommend something merely because it is common.
Tie each scenario to the evidence.

LENS OBSERVATION:
${JSON.stringify(observation || {}, null, 2)}

SIGNAL ASSESSMENT:
${JSON.stringify(assessment || {}, null, 2)}

Return ONLY valid JSON.

Required schema:

{
  "schema": "IXVYN_TRAJECTORY_V1",
  "scenarios": [
    {
      "title": "",
      "description": "",
      "rationale": "",
      "expectedImpact": "",
      "budget": "LOW | MODERATE | HIGH | UNKNOWN",
      "timeHorizon": "IMMEDIATE | SHORT_TERM | MEDIUM_TERM | LONG_TERM | UNKNOWN",
      "evidenceBasis": [],
      "uncertainties": []
    }
  ]
}
`;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=" +
            encodeURIComponent(apiKey),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.35,
                        responseMimeType: "application/json"
                    }
                })
            }
        );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Gemini trajectory error:",
                errorText
            );

            return res.status(502).json({
                error: "Trajectory engine failed."
            });
        }

        const data =
            await response.json();

        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.status(502).json({
                error: "Empty trajectory response."
            });
        }

        let parsed;

        try {
            parsed = JSON.parse(text);
        } catch {

            const cleaned = text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            parsed = JSON.parse(cleaned);
        }

        const scenarios =
            Array.isArray(parsed.scenarios)
                ? parsed.scenarios.slice(0, 4)
                : [];

        const normalized = scenarios.map(
            (scenario, index) => ({
                id:
                    scenario.id ||
                    `TRAJ-${String(index + 1).padStart(2, "0")}`,

                title:
                    scenario.title ||
                    `INTERVENTION SCENARIO ${index + 1}`,

                description:
                    scenario.description ||
                    scenario.rationale ||
                    "No description supplied.",

                rationale:
                    scenario.rationale ||
                    "",

                expectedImpact:
                    scenario.expectedImpact ||
                    "UNKNOWN IMPACT",

                budget:
                    [
                        "LOW",
                        "MODERATE",
                        "HIGH",
                        "UNKNOWN"
                    ].includes(
                        String(
                            scenario.budget || "UNKNOWN"
                        ).toUpperCase()
                    )
                        ? String(
                            scenario.budget || "UNKNOWN"
                        ).toUpperCase()
                        : "UNKNOWN",

                timeHorizon:
                    [
                        "IMMEDIATE",
                        "SHORT_TERM",
                        "MEDIUM_TERM",
                        "LONG_TERM",
                        "UNKNOWN"
                    ].includes(
                        String(
                            scenario.timeHorizon ||
                            "UNKNOWN"
                        ).toUpperCase()
                    )
                        ? String(
                            scenario.timeHorizon ||
                            "UNKNOWN"
                        ).toUpperCase()
                        : "UNKNOWN",

                evidenceBasis:
                    Array.isArray(
                        scenario.evidenceBasis
                    )
                        ? scenario.evidenceBasis
                        : [],

                uncertainties:
                    Array.isArray(
                        scenario.uncertainties
                    )
                        ? scenario.uncertainties
                        : []
            })
        );

        return res.status(200).json({
            schema: "IXVYN_TRAJECTORY_V1",
            scenarios
        });

    } catch (error) {

        console.error(
            "Trajectory handler error:",
            error
        );

        return res.status(500).json({
            error:
                error.message ||
                "Internal trajectory error."
        });
    }
}
