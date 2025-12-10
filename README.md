# 🤖 Jarvis-PersonalizedSaasBot  
*Self-Hosted RAG Assistant Powered by Llama + Pinecone + Next.js*

Jarvis-PersonalizedSaasBot is a **private AI documentation assistant** that instantly answers questions about a SaaS product’s features, pricing, security, and how-to guidance — grounded in real internal documentation with source citations.

This is a **fully self-hosted enterprise AI copilot**, ensuring **data stays private** with no external cloud usage.

---

## ✨ Key Features

- 🔐 Self-Hosted LLM using LM Studio (Llama-3.2-3B-Instruct)
- 🧠 RAG Retrieval using Pinecone for accurate context matching
- 📚 Answers with citations → audit-ready & trusted
- 🎨 Cinematic UI built in Next.js + v0.design + Framer Motion
- 💬 Real-time chat with typing animation + online status indicator
- 🔄 Start new session any time
- 📄 Download chat as `.txt` transcript
- 🚦 Backend & model health monitoring
- 🧩 Modular architecture → easy to extend

---

## 🏗 Architecture

```mermaid
flowchart TD
    A[Next.js Frontend] --> B[Node.js Backend API]
    B --> C[Pinecone Vector DB - RAG]
    B --> D[LM Studio - Local Llama Model]

   ## Project Structure

   Jarvis-PersonalizedSaasBot/
├── frontend/         # UI Next.js
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── public/
└── backend/          # Chat + RAG Engine (Node.js)
    ├── server.js
    ├── .env


   ## Setup Instructions 
   cd backend
   npm install

   .env:
 LMSTUDIO_BASE_URL=http://localhost:1234/v1
 PINECONE_API_KEY=your_key_here
 PINECONE_INDEX=jarvis-knowledge
 PINECONE_REGION=us-east-1
 PORT=8000
 node server.js (backend)
 cd ../frontend
 npm install
 npm run dev
## 💡 How It Works

1️⃣ User asks a question
2️⃣ Backend retrieves relevant context from Pinecone
3️⃣ Sends query + context to Llama running in LM Studio
4️⃣ Gets grounded response with proper citations
5️⃣ UI displays answer + sources + token stats
6️⃣ Transcript downloadable for compliance & review
## 🧪 Try These Demo Prompts
	•	What does this SaaS product do?
	•	How do users track tasks?
	•	Compare Business vs Enterprise plan
	•	Tell me more about SOC2 compliance
	•	Download transcript
##🛡 Security Highlights
	•	🚫 No cloud inference → zero data leakage
	•	🔒 Fully self-hosted deployments
	•	📍 Works even in offline environments (except Pinecone)
	•	🏢 Enterprise-compliant setup
📸 Demo Video & Screenshots

## 🎥 Video Demonstration
See Jarvis in action:
👉 Video Demo
🔗 (Add your Google Drive/video URL here)
## 📸 UI Preview

### 🔹 Landing Page (Jarvis Reactor Animation)
![Landing Page](https://drive.google.com/uc?export=view&id=YOUR_FILE_ID_1)

### 🔹 Chat Screen (Citations + RAG Retrieval)
![Chat UI](https://drive.google.com/uc?export=view&id=YOUR_FILE_ID_2)
