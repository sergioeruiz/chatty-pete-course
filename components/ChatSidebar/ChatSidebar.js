import { faMessage, faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ChatSidebar = () => {
    const [ chatList, setChatList ] = useState([]);

    useEffect(() => {
        const loadChatList = async () => {
            const response = await fetch(`/api/chat/getChatList`, {
                method: 'POST'
            });
            const json = await response.json();
            console.log('Chat List: ', json);
            setChatList(json?.chats || []);
        };
        loadChatList();
    }, []);

    return (
        <div className="bg-gray-900 text-white flex flex-col overflow-hidden">
            <Link href="/chat" className="side-menu-item btn">
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                New chat
            </Link>
            <div className="flex-1 overflow-auto bg-gray-950">
                { chatList.map(chat => (
                    <Link
                        className="side-menu-item"
                        key={chat._id}
                        href={`/chat/${chat._id}`}
                    >
                        <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>
                        {chat.title}
                    </Link>
                ))}
            </div>
            <Link href="/api/auth/logout" className="side-menu-item">
                <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon>
                Logout
            </Link>
        </div>
    );
};