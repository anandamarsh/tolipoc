const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");

const app = express();
const port = 1979;

const openai = new OpenAI();

const assistant_id = "asst_TqNmfz3ZBZJNdzcF1qSwVxrm";
const thread_id = "thread_cs0XcZmqMLOdMcCwiajiD0YP";

app.use(cors());
app.use(express.json());

const INPUT_COST_PER_MILLION = 0.15; // in dollars
const OUTPUT_COST_PER_MILLION = 0.6; // in dollars

function calculateCost(usage) {
    const { prompt_tokens, completion_tokens } = usage;
    const inputCost = (prompt_tokens / 1_000_000) * INPUT_COST_PER_MILLION;
    const outputCost = (completion_tokens / 1_000_000) * OUTPUT_COST_PER_MILLION;
    const totalCost = (inputCost + outputCost) * 100; // Convert dollars to cents
    return totalCost.toFixed(2); // Return cost in cents up to 4 decimal points
}

async function getResponse(content) {
    return new Promise(async (resolve, reject) => {
        try {
            await openai.beta.threads.messages.create(thread_id, {
                role: "user",
                content: content,
            });
            let run = await openai.beta.threads.runs.createAndPoll(thread_id, {
                assistant_id,
            });
            if (run.status === "completed") {
                const messages = await openai.beta.threads.messages.list(run.thread_id);
                const responseContent = messages.data[0].content[0].text.value;
                const time = new Date(run.completed_at) - new Date(run.started_at);
                const cost = calculateCost(run.usage);
                resolve({
                    content: responseContent,
                    time: time,
                    status: run.status,
                    cost: cost,
                });
            } else {
                resolve({
                    content: null,
                    time: null,
                    status: run.status,
                    cost: null,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
}

function extractCode(cleanedResponse) {
    if (!cleanedResponse) return "";

    const lines = cleanedResponse.split("\n");

    // Remove leading lines until the first "import" line is encountered
    while (lines.length > 0 && !lines[0].startsWith("import")) {
        lines.shift();
    }

    // Remove trailing lines that come after the last line of code
    while (lines.length > 0 && lines[lines.length - 1].trim().endsWith("```")) {
        lines.pop();
    }

    // Join the remaining lines back into a single string
    return lines.join("\n").trim();
}

app.post("/api/get-response", async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }
    try {
        const { content: responseContent, time, status, cost } = await getResponse(content);
        // Clean the response by removing the first line if it starts with ```
        const cleanedResponse = extractCode(responseContent);
        // Write the response to the file "../spa/src/App.js"
        if (cleanedResponse) {
            fs.writeFileSync("../spa/src/App.js", cleanedResponse, (err) => {
                if (err) {
                    console.error("Error writing to file:", err);
                    res.status(500).json({ error: "Error writing to file" });
                    return;
                }
                console.log("Response written to file successfully");
            });
        }
        console.log(`{"time": ${time}, "cost": ${cost}}`);
        res.json({ time, cost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
