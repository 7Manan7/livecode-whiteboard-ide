import React, { useState } from 'react';
import Layout from './components/Layout';
import CodeEditor from './components/CodeEditor';
import Whiteboard from './components/Whiteboard';
import VideoChat from './components/VideoChat';
import Chat from './components/Chat';
import RoomHeader from './components/RoomHeader';
import { useSocket } from './context/SocketContext';
import { v4 as uuidV4 } from 'uuid';

function App() {
    const [activeTab, setActiveTab] = useState('ide');
    const [code, setCode] = useState('// Write your code here\nconsole.log("Hello World!");');
    const [language, setLanguage] = useState('javascript');
    const [roomId, setRoomId] = useState('');
    const socket = useSocket();

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let id = params.get('room');

        if (!id) {
            id = uuidV4();
            window.history.replaceState(null, '', `?room=${id}`);
        }

        setRoomId(id);

        if (socket) {
            socket.emit('join-room', { roomId: id, username: 'User-' + Math.floor(Math.random() * 1000) });
        }
    }, [socket]);

    return (
        <Layout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            rightSidebar={
                <div className="flex flex-col h-full">
                    <div className="h-1/2 border-b border-[#333]">
                        <VideoChat roomId={roomId} />
                    </div>
                    <div className="h-1/2">
                        <Chat roomId={roomId} />
                    </div>
                </div>
            }
        >
            <RoomHeader roomId={roomId} />
            {activeTab === 'ide' ? (
                <CodeEditor
                    code={code}
                    setCode={setCode}
                    language={language}
                    setLanguage={setLanguage}
                    roomId={roomId}
                />
            ) : (
                <Whiteboard roomId={roomId} />
            )}
        </Layout>
    );
}

export default App;

