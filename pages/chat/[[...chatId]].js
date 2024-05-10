import { ChatSidebar } from "components/ChatSidebar";
import Head from "next/head";
import { streamReader } from "openai-edge-stream";
import { useState } from "react";

export default function ChatPage() {
  const [ incomingMessage, setInconmingMessage ] = useState('');
  const [messageText, setMessageText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("message text", messageText);
    const response = await fetch(`/api/chat/sendMessage`, {
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message: messageText
      })
    });
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    await streamReader(reader, (message) => {
      console.log(message);
      setInconmingMessage(s => `${s}${message.content}`);
    });
  };

  return (
    <>
      <Head>
        <title>New chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="bg-gray-700 text-white flex flex-col ">
          <div className="flex-1">{incomingMessage}</div>
          <footer className="bg-gray-800 p-5">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2">
                <textarea
                  value={ messageText }
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Send a message..."
                  className="w-full resize-none rounded-md bg-gray-700 p-2 focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500" />
                <button type="submit" className="btn">Send</button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}
