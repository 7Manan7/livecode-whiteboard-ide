import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const Chat = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const messagesEndRef = useRef(null);
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (data) => {
            setMessages((prev) => [...prev, data]);
        };

        socket.on('chat-message', handleMessage);

        return () => {
            socket.off('chat-message', handleMessage);
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        const messageData = {
            roomId,
            message: newMessage,
            username: 'You', // In a real app, get from auth
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Optimistic update
        // setMessages((prev) => [...prev, { ...messageData, userId: socket.id }]); // Server echoes back, so usually don't need this if local echo is handled by server broadcast to all including sender, OR if server broadcasts to others and we add locally. 
        // My server implementation: io.to(roomId).emit... which includes sender. So no manual add needed if I listen to it.

        socket.emit('chat-message', messageData);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-[#333]">
            <div className="p-3 border-b border-[#333] bg-[#252526] flex items-center gap-2">
                <MessageSquare size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Group Chat</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                    const isMe = msg.userId === socket?.id;
                    return (
                        <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className={`text-xs font-medium ${isMe ? 'text-blue-400' : 'text-green-400'}`}>
                                    {isMe ? 'You' : msg.username || 'User'}
                                </span>
                                <span className="text-[10px] text-gray-500">{msg.time}</span>
                            </div>
                            <div className={`px-3 py-2 rounded-lg max-w-[85%] text-sm break-words ${isMe
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-[#333] text-gray-200 rounded-tl-none'
                                }`}>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-[#252526] border-t border-[#333]">
                <div className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-[#1e1e1e] text-gray-200 text-sm rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-[#333]"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 p-1"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
