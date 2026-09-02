export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const body = req.body || {};

        const {
            decision,
            assessment,
            observation,
            action
        } = body;

        if (!decision) {
            return res.status(400).json({
                error: "Human decision is required."
            });
        }

        if (
            String(decision.decision).toUpperCase() !==
            "APPROVED"
        ) {
            return res.status(400).json({
                error:
                    "Only approved trajectories can become civic actions."
            });
        }

        if (!action?.summary) {
            return res.status(400).json({
                error:
                    "A civic action summary is required."
            });
        }

        const id =
            `IXVYN-${Date.now().toString(36).toUpperCase()}`;

        const record = {
            id,

            schema:
                "IXVYN_CIVIC_ACTION_V1",

            createdAt:
                new Date().toISOString(),

            status:
                "SUBMITTED",

            action: {
                type:
                    action.type ||
                    "SAFETY REVIEW",

                location:
                    action.location ||
                    "NOT SPECIFIED",

                summary:
                    action.summary,

                evidence:
                    action.evidence ||
                    ""
            },

            source: {
                observationId:
                    observation?.id ||
                    null,

                riskLevel:
                    assessment?.riskLevel ||
                    "UNKNOWN",

                riskScore:
                    Number.isFinite(
                        Number(
                            assessment?.riskScore
                        )
                    )
                        ? Number(
                            assessment.riskScore
                        )
                        : null,

                decision:
                    decision.decision,

                scenario:
                    decision.scenario?.title ||
                    "UNKNOWN"
            }
        };

        /*
         * CIVIC deliberately does not ask Gemini to
         * invent or rewrite the intervention.
         *
         * The approved human decision and evidence
         * are the source of the municipal action.
         */

        return res.status(200).json(record);

    } catch (error) {

        console.error(
            "Civic handler error:",
            error
        );

        return res.status(500).json({
            error:
                error.message ||
                "Internal civic error."
        });
    }
}
