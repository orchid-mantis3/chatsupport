import { NextResponse } from "next/server"
const { GoogleGenerativeAI } = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.API_KEY)

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are a chatbot for the startup software tech company Headstarter. Use a friendly tone. Ensure explanations are concise and easy to understand.",
})

async function startChat(history) {
    return model.startChat({
        history: history,
        generationConfig: { 
            maxOutputTokens: 8000,
        },
    })
}

export async function POST(req) {
    const history = await req.json()
    const userMsg = history[history.length - 1]

    try {
        const chat = await startChat(history)
        const result = await chat.sendMessage(userMsg.parts[0].text)
        const response = await result.response
        const output = response.text()
    
        return NextResponse.json(output)
    } catch (e) {
        console.error(e)
        return NextResponse.json({text: "error, check console"})
    }
}