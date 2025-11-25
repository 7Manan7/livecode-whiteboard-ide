import React, { useState } from 'react';
import Layout from './components/Layout';
import CodeEditor from './components/CodeEditor';
import Whiteboard from './components/Whiteboard';
import VideoChat from './components/VideoChat';

function App() {
    const [activeTab, setActiveTab] = useState('ide');
    const [code, setCode] = useState('// Write your code here\nconsole.log("Hello World!");');
    const [language, setLanguage] = useState('javascript');

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'ide' ? (
                <CodeEditor
                    code={code}
                    setCode={setCode}
                    language={language}
                    setLanguage={setLanguage}
                />
            ) : (
                <Whiteboard />
            )}
            <VideoChat />
        </Layout>
    );
}

export default App;

