export const maxDuration = 60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";


// Initialize OpenAI client with Llama3 model configuration
const openai = new OpenAI({
    baseURL: 'https://abdellah-ennajari-23--llama3-openai-compatible-serve.modal.run/v1',
    apiKey: "super-secret-key"
});

const chatBotResponseSchema = {
    "title": "ChatBotResponse",
    "type": "object",
    "properties": {
        "contentment": {
            "title": "Contentment",
            "description": "Exprimez poliment que vous avez bien compris la question. Utilisez une phrase courte, rassurante, naturelle et adaptée au contexte de la question. Par exemple : 'Merci pour votre question', 'Je comprends votre demande', 'سؤال جيد، شكرًا لك'. Répondez dans la même langue que celle de la question.",
            "type": "string"
        },
        "main_answer": {
            "title": "Main Answer",
            "description": "Fournissez une réponse directe, claire et concise à la question posée. Évitez les longueurs inutiles. Répondez dans la même langue que celle utilisée dans la question.",
            "type": "string"
        },
        "details": {
            "title": "Details",
            "description": "Ajoutez des explications ou informations supplémentaires pour enrichir la réponse si nécessaire. Incluez des exemples, contextes ou précisions utiles. Répondez dans la même langue que celle de la question.",
            "type": "string"
        },
        "intent": {
            "title": "Intent",
            "description": "Identifiez l'intention principale de la question.",
            "enum": [
                "acadimique information", "Admissions et inscriptions", "Services aux étudiants",
                "Droits et responsabilités des étudiants", "Activités étudiantes", "Services administratifs",
                "Vie sur le campus", "Autre"
            ],
            "type": "string"
        },
        "related_questions": {
            "title": "Related Questions",
            "description": "Une liste de questions similaires ou couramment posées en lien avec la question actuelle. Répondez dans la même langue que celle de la question d'origine.",
            "type": "array",
            "items": {
                "title": "RelatedQuestion",
                "type": "object",
                "properties": {
                    "question1": { "type": "string" },
                    "question2": { "type": "string" },
                    "question3": { "type": "string" }
                }
            }
        }
    },
    "required": ["contentment", "main_answer", "intent"]
};

export async function POST(req){
    try {
        const {userId} = getAuth(req)

        // Extract chatId and prompt from the request body
        const { chatId, prompt } = await req.json();

        if(!userId){
            return NextResponse.json({
                success: false,
                message: "User not authenticated",
              });
        }

        // Find the chat document in the database based on userId and chatId
        await connectDB()
        const data = await Chat.findOne({userId, _id: chatId})

        // Create a user message object
        const userPrompt = {
            role: "user",
            content: prompt,
            timestamp: Date.now()
        };

        data.messages.push(userPrompt);

        // Create the messages array with conversation history
        const prompte_Task_messages = [
            {
                "role": "system",
                "content": [
                    "Vous êtes un assistant dans une école qui s'appelle l'École Nationale de l'Intelligence Artificielle et Digitale de Berkane, capable de répondre aux questions des étudiants.",
                    "Soyez poli dans votre réponse. Si l'on vous salue, accueillez l'utilisateur avec une des expressions suivantes:",
                    "En arabe: السلام عليكم - صباح الخير - مساء الخير - مرحباً بك - أهلاً وسهلاً - كيف يمكنني مساعدتك اليوم؟",
                    "En français: Bonjour - Bonsoir - Salut - Bienvenue - Comment puis-je vous aider aujourd'hui?",
                    "Dans le cas où l'utilisateur pose une question uniquement pour les questions et non pour une autre entrée  Pour vos réponses, variez vos phrases d'introduction au lieu d'utiliser toujours 'Merci pour votre question'. Utilisez différentes expressions comme:",
                    "En arabe: أهلاً بك، يسعدني مساعدتك - شكراً على سؤالك - أفهم ما تقصد - سؤال جيد - طبعاً يمكنني مساعدتك",
                    "En français: Je comprends votre demande - Je vous écoute - Bien sûr, je peux vous aider - C'est une excellente question - Je suis là pour vous aider",
                    "Si l'utilisateur vous salue en arabe, répondez avec une salutation en arabe. Si la salutation est en français, répondez en français.",
                    "Adaptez toujours votre réponse à la langue de la question (arabe ou français).",
                    "Vérifiez les données attentivement lorsque vous répondez.",
                    "Essayez d'éviter tous les mots et textes qui n'ont pas de sens dans ces données.",
                    "Faites très attention à la langue dans laquelle la question est posée.",
                    "Vous devez répondre dans la même langue que celle de la question.",
                    "Ne répondez pas tant que vous n'êtes pas sûr de la langue de la question.",
                    "Si c'est en arabe, répondez en arabe. Si c'est en français, répondez en français. Si c'est en anglais, répondez en anglais.",
                    "Ignorez les éléments inutiles dans la question tels que les numéros de version ou de commande, et concentrez-vous uniquement sur la question.",
                    "Faites attention aux fautes d'orthographe pour ne pas altérer votre compréhension.",
                    "Extraire les détails JSON du texte conformément aux questions posées et aux spécifications Pydantic.",
                    "Extraire les détails comme indiqué dans le texte. Vous pouvez les reformater, mais gardez le sens.",
                    "Ne pas générer d'introduction ni de conclusion.",
                    "repandre en paragraphe text",
                    "n'oblier pas les questions similaires a la fin au moins deux mais Ils doivent être présentés avec le contexte du texte et ne doivent en aucun cas être mentionnés auparavant. Indiquez simplement à l'utilisateur que vous pouvez l'aider avec d'autres choses, puis posez des questions. ",
                    "Ne vous limitez pas toujours à la première phrase de votre question, très bien, merci, mais diversifiez plutôt la phrase.",
                ].join('\\n')
            },
        ];

        // Add conversation history (last 5 messages)
        const conversationHistory = data.messages.slice(-5);
        conversationHistory.forEach(msg => {
            prompte_Task_messages.push({
                role: msg.role,
                content: msg.role === "user" ? 
                    [
                        `## Question : ${msg.content}`,
                        `## Pydantic Details:`,
                        JSON.stringify(chatBotResponseSchema),
                        ``,
                        `## Output text sans titres qui exsiste dans json:`
                    ].join('\\n') : msg.content
            });
        });

        // Call the Llama3 model API to get a chat completion
        const completion = await openai.chat.completions.create({
            model: "ahmed-ouka/llama3-8b-eniad-merged-32bit",
            messages: prompte_Task_messages,
            temperature: 0.2,
            max_tokens: 1024,
            stream: false
        });

        const message = completion.choices[0].message;
        message.timestamp = Date.now()

        // Generate audio from the response using ElevenLabs
        console.log('Preparing to call ElevenLabs for TTS...');
        if (message.content) {
            try {
                console.log("Attempting to generate audio from ElevenLabs...");
                const voiceId = "JBFqnCBsd6RMkjVDRZzb"; 
                const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json',
                        'xi-api-key': 'sk_6cf5064cd435e231f7bd3c9925fa9218433cec59a59ad665',
                    },
                    body: JSON.stringify({
                        text: message.content.replace(/\*/g, ''),
                        model_id: 'eleven_multilingual_v2'
                    }),
                });

                console.log('ElevenLabs response status:', elevenLabsResponse.status);

                if (!elevenLabsResponse.ok) {
                    const errorBody = await elevenLabsResponse.text();
                    console.error(`ElevenLabs API Error: ${errorBody}`);
                    throw new Error(`ElevenLabs API failed with status ${elevenLabsResponse.status}`);
                }

                const audioBuffer = await elevenLabsResponse.arrayBuffer();
                console.log('Received audio buffer. Size:', audioBuffer.byteLength, 'bytes.');
                if (audioBuffer.byteLength > 0) {
                    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
                    message.audio = audioBase64;
                    console.log("Audio successfully generated and attached.");
                } else {
                    console.log("Received empty audio buffer from ElevenLabs.");
                }

            } catch (error) {
                console.error("ElevenLabs TTS Error:", error.message);
            }
        }
        console.log('Message object before saving:', message);
        
        data.messages.push(message);
        await data.save();

        return NextResponse.json({success: true, data: message})
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}