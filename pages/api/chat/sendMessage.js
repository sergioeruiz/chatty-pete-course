import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
    runtime: "edge",
};

export default async function handler(req) {
    try {
        const { message } = await req.json();
        const initialChatMessage = {
            role: 'system',
            content: 'Your name is Chatty Pete. An incredibly intelligent and quick-thinking AI, taht always replies with a enthusiastic and positive energy. Your reponse must be formatted as markdown.',
        };

        const response = await fetch(
            `${req.headers.get('origin')}/api/chat/createNewChat`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    cookie: req.header.get('cookie'),
                },
                body: JSON.stringify({
                    message,
                })
            },{
                onBeforeStream: ({ emit }) => {
                    emit(chatsID, 'newChatId');
                },
                onAfterStream: async ({ fullContent }) => {
                    await fetch(`${ req.headers.get('origin') }/api/chat/addMessageToChat`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            cookie: req.headers.get('cookie'),
                        },
                        body: JSON.stringify({
                            chatId,
                            role: 'assistant',
                            content: fullContent,
                        }),
                    });
                }
            }

        );
        const json = await response.json();
        const chatID = json._id;
        console.log('new chat', json);

        const stream = await new OpenAIEdgeStream(
            "https://api.openai.com/v1/chat/completions",
            {
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                method: 'POST',
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [initialChatMessage,
                        {
                            content: message,
                            role: 'user', 
                        }
                    ],
                    stream: true,
                }),
            }
        );
        return new Response(stream);
        
    } catch(e) {
        console.log("an error ocurrend in message: ", e);
    }
    
} 