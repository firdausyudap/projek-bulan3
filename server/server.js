const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

const projectRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(projectRoot, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL_ID = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY tidak ditemukan.");
    console.error(`Pastikan file ada di: ${path.join(projectRoot, ".env")}`);
    process.exit(1);
}

console.log("✅ GEMINI_API_KEY berhasil dibaca dari .env");

const ai = new GoogleGenAI({
    apiKey: apiKey
});

app.use(express.json());

app.use((req, res, next) => {
    const origin = req.headers.origin || "";
    const isLocalOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    if (isLocalOrigin) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Vary", "Origin");
    }

    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.static(projectRoot));

app.get("/", (req, res) => {
    res.sendFile(path.join(projectRoot, "index.html"));
});

app.post("/api/service-order", (req, res) => {
    const { service, name, email, project_type: projectType, description } = req.body;

    if (!service || !name?.trim() || !email?.trim() || !projectType?.trim() || !description?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Lengkapi semua field terlebih dahulu."
        });
    }

    console.log(`Permintaan ${service} dari ${name.trim()} <${email.trim()}>: ${projectType.trim()} - ${description.trim()}`);

    res.json({
        success: true,
        message: `Terima kasih ${name.trim()}, permintaan proyek ${service.toLowerCase()} kamu sudah diterima.`
    });
});

app.post("/api/gemini", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                error: "Prompt tidak boleh kosong"
            });
        }

        const response = await ai.models.generateContent({
            model: MODEL_ID,
            contents: prompt,
            config: {
                systemInstruction: "Kamu adalah asisten ramah untuk portfolio YUDA. Jawab singkat dalam bahasa Indonesia dan hanya gunakan informasi yang relevan tentang YUDA, desain web, dan project portfolio ini."
            }
        });

        const answer = response?.text ||
            response?.candidates?.[0]?.content?.parts
                ?.map((part) => part?.text || "")
                .join("") ||
            "Gemini belum mengirim jawaban.";

        res.json({
            success: true,
            response: answer
        });

    } catch (error) {
        console.error("Gemini Error:", error.message || error);

        const status = Number(error.status || error.statusCode) || 500;
        const errorMessage = status === 400 || status === 401 || status === 403
            ? "API key Gemini ditolak. Gunakan API key dari Google AI Studio, bukan nomor project."
            : "Gemini tidak dapat dihubungi. Periksa server dan koneksi internet.";

        res.status(status).json({
            success: false,
            error: errorMessage
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 YUDA Portfolio berjalan di http://localhost:${PORT}`);
});