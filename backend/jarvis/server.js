// server.js - single-file backend for Jarvis
// Requires: Node 18+ (for built-in fetch)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { pipeline, env } from "@xenova/transformers";

dotenv.config();

// ========== CONFIG ==========
const PORT = process.env.PORT || 8000;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
const LMSTUDIO_BASE_URL = process.env.LMSTUDIO_BASE_URL || "http://localhost:1234/v1";
const LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL || "llama-3.2-3b-instruct";

if (!PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
  console.error("❌ Missing Pinecone env vars");
  process.exit(1);
}

// ========== PINECONE CLIENT ==========
const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const jarvisIndex = pinecone.Index(PINECONE_INDEX_NAME);

// ========== EMBEDDINGS (Xenova) ==========
env.allowLocalModels = true;
env.allowRemoteModels = true;

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    console.log("⏬ Loading embedding model (Xenova/all-MiniLM-L6-v2)...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model loaded");
  }
  return embedder;
}

async function embedText(text) {
  const model = await getEmbedder();
  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

// ========== LM STUDIO CLIENT ==========
async function callLMStudioChat(messages) {
  const res = await fetch(`${LMSTUDIO_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LMSTUDIO_MODEL,
      messages,
      temperature: 0.3,
      stream: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LM Studio error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function checkLMStudioHealth() {
  try {
    const res = await fetch(`${LMSTUDIO_BASE_URL}/models`);
    if (!res.ok) return false;
    const data = await res.json();
    const models = data?.data?.map((m) => m.id) || [];
    return models.includes(LMSTUDIO_MODEL);
  } catch (e) {
    return false;
  }
}

// ========== IN-MEMORY TRANSCRIPT ==========
let lastTranscript = null;

// ========== EXPRESS APP ==========
const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT =
  "You are Jarvis, an AI assistant for our SaaS product. " +
  "Answer in a friendly, concise, and helpful way. " +
  "Use ONLY the given context; if you are unsure, say you do not know.";

// ---------- HEALTH ----------
app.get("/api/health", async (req, res) => {
  const [llmOK, vectorDbOK] = await Promise.all([
    checkLMStudioHealth(),
    (async () => {
      try {
        await jarvisIndex.describeIndexStats();
        return true;
      } catch {
        return false;
      }
    })(),
  ]);

  res.json({
    llm: llmOK ? "online" : "offline",
    vectorDb: vectorDbOK ? "online" : "offline",
  });
});

// ---------- CHAT ----------
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;
    const history = req.body.history || [];

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    // 1) Embed query
    const qVector = await embedText(message);

    // 2) Query Pinecone
    const queryRes = await jarvisIndex.query({
      vector: qVector,
      topK: 3,
      includeMetadata: true,
    });

    const sources =
      queryRes.matches?.map((m, idx) => ({
        id: m.id || `source-${idx + 1}`,
        snippet: m.metadata?.text || "",
      })) || [];

    const contextText = sources
      .map((s, i) => `Source ${i + 1}: ${s.snippet}`)
      .join("\n\n");

    // 3) Build messages for LM Studio
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((h) => ({
        role: h.role,
        content: h.content,
      })),
      {
        role: "user",
        content:
          `Use the following context to answer the question. ` +
          `If the answer is not in the context, say you are not sure.\n\n` +
          `Context:\n${contextText || "(no context found)"}\n\n` +
          `Question: ${message}`,
      },
    ];

    // 4) Call LM Studio
    const answer = await callLMStudioChat(messages);

    const newHistory = [
      ...history,
      { role: "user", content: message },
      { role: "assistant", content: answer },
    ];

    lastTranscript = newHistory;

    res.json({
      answer,
      sources,
      stats: {
        totalTokens: undefined,
        totalTurns: newHistory.length,
        sessionStartedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: String(err.message || err) });
  }
});

// ---------- TRANSCRIPT ----------
app.get("/api/transcript", (req, res) => {
  if (!lastTranscript) {
    return res.status(404).json({ error: "No transcript available yet." });
  }

  const lines = lastTranscript.map((m) => {
    const who = m.role === "user" ? "User" : "Jarvis";
    return `${who}: ${m.content}`;
  });

  const content = lines.join("\n\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="jarvis-transcript.txt"'
  );
  res.send(content);
});

// ---------- SIMPLE HOME ----------
app.get("/", (req, res) => {
  res.send("Jarvis backend is running ✅");
});

// ========== INGEST MODE (CLI) ==========
async function ingestDocs() {
  console.log("📥 Ingesting sample docs into Pinecone...");

  // TODO: replace this array with your real docs
 const docs = [
  {
    id: "doc1",
    text: "Our SaaS product helps teams manage board meetings by organizing agendas, attaching documents, and assigning action items to members.",
  },
  {
    id: "doc2",
    text: "Users can track action items in a central dashboard where they can update status, add comments, and mark items as complete.",
  },
  {
    id: "doc3",
    text: "The system sends automatic reminders for upcoming deadlines and notifies users when task statuses change to ensure nothing is missed.",
  },
  {
    id: "doc4",
    text: "The platform includes timeline visualizations to help managers monitor overall progress toward meeting goals.",
  },
  {
    id: "doc5",
    text: "Admins can filter tasks by owner, priority, and due date to quickly identify bottlenecks and ensure accountability.",
  },
]

  for (const d of docs) {
    const embedding = await embedText(d.text);
    await jarvisIndex.upsert([
      {
        id: d.id,
        values: embedding,
        metadata: { text: d.text },
      },
    ]);
    console.log(`  • Upserted ${d.id}`);
  }

  console.log("✅ Ingestion complete");
}

// ========== ENTRYPOINT ==========
const mode = process.argv[2];

if (mode === "ingest") {
  // Run: node server.js ingest
  ingestDocs()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else {
  // Run: node server.js
  app.listen(PORT, () => {
    console.log(`🚀 Jarvis backend listening on http://localhost:${PORT}`);
  });
}