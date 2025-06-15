export const maxDuration = 300;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: 'https://abdellah-ennajari--llama3-openai-compatible-serve.modal.run/v1',
    apiKey: process.env.MODAL_API_KEY || "super-secret-key"
});

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: "Authentication required" 
            }, { status: 401 });
        }

        const { chatId, prompt } = await req.json();
        if (!chatId || !prompt) {
            return NextResponse.json({ 
                success: false, 
                message: "Missing required fields" 
            }, { status: 400 });
        }

        await connectDB();
        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return NextResponse.json({ 
                success: false, 
                message: "Chat not found" 
            }, { status: 404 });
        }

        // Add user message
        const userMessage = {
            role: "user",
            content: prompt,
            timestamp: Date.now()
        };
        chat.messages.push(userMessage);
        await chat.save();

        // Prepare messages for AI
        const messages = [
            {
                role: "system",
                content: `Vous êtes l'assistant de l'ENIAD (École Nationale de l'Intelligence Artificielle et Digitale) de Berkane.
                Répondez toujours en texte brut directement, sans format JSON.
                Pour les salutations, utilisez ce format exact :
                
                "Bonjour ! Bienvenue à l'École Nationale de l'Intelligence Artificielle et Digitale de Berkane. Je suis ravi de vous aider aujourd'hui.

                Je suis l'assistant virtuel de l'ENIAD et je peux vous renseigner sur divers sujets concernant notre école :

                - Les formations et programmes académiques
                - Les procédures d'inscription et d'admission
                - Les services aux étudiants
                - La vie sur le campus
                - Les événements et activités

                Voici quelques questions que vous pourriez me poser :
                • [Question 1]
                • [Question 2]
                • [Question 3]

                Adaptez votre réponse à la langue de la question (français, arabe ou anglais)."
                `
            },
            ...chat.messages.slice(-5).map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        // Get AI response
        const completion = await openai.chat.completions.create({
            model: "ahmed-ouka/llama3-8b-eniad-merged-32bit",
            messages,
            temperature: 0.2,
            max_tokens: 1024
        });

        const aiMessage = {
            role: "assistant",
            content: completion.choices[0].message.content,
            timestamp: Date.now()
        };

        // Save response
        chat.messages.push(aiMessage);
        await chat.save();

        return NextResponse.json({ 
            success: true, 
            data: aiMessage 
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}