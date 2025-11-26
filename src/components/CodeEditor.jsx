import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Settings, ChevronDown, Loader2, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const CodeEditor = ({ code, setCode, language, setLanguage, roomId }) => {
  const [theme, setTheme] = useState('vs-dark');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('code-update', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off('code-update');
    };
  }, [socket, setCode]);

  const handleEditorChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit('code-change', { roomId, code: value });
    }
  };

  const languages = [
    { id: 'javascript', label: 'JavaScript', pistonLang: 'javascript', version: '18.15.0' },
    { id: 'typescript', label: 'TypeScript', pistonLang: 'typescript', version: '5.0.3' },
    { id: 'python', label: 'Python', pistonLang: 'python', version: '3.10.0' },
    { id: 'java', label: 'Java', pistonLang: 'java', version: '15.0.2' },
    { id: 'cpp', label: 'C++', pistonLang: 'cpp', version: '10.2.0' },
  ];

  const currentLang = languages.find(l => l.id === language) || languages[0];

  const runCode = async () => {
    setIsRunning(true);
    setShowOutput(true);
    setOutput('Running...');

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: currentLang.pistonLang,
          version: currentLang.version,
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.run) {
        const result = data.run.output || data.run.stderr || 'No output';
        setOutput(result);
      } else {
        setOutput('Error: Unable to execute code');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1e1e1e'
    }}>
      {/* Toolbar */}
      <div style={{
        height: '35px',
        backgroundColor: '#2d2d30',
        borderBottom: '1px solid #3e3e42',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        justifyContent: 'space-between',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#858585', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Language
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                backgroundColor: '#3c3c3c',
                color: '#cccccc',
                border: '1px solid #3e3e42',
                borderRadius: '2px',
                padding: '3px 24px 3px 8px',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23858585' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 6px center'
              }}
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Theme Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#858585', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Theme
            </span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                backgroundColor: '#3c3c3c',
                color: '#cccccc',
                border: '1px solid #3e3e42',
                borderRadius: '2px',
                padding: '3px 24px 3px 8px',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23858585' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 6px center'
              }}
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={runCode}
            disabled={isRunning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              backgroundColor: isRunning ? '#15803d' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '2px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              outline: 'none',
              opacity: isRunning ? 0.7 : 1
            }}
            onMouseOver={(e) => !isRunning && (e.currentTarget.style.backgroundColor = '#15803d')}
            onMouseOut={(e) => !isRunning && (e.currentTarget.style.backgroundColor = '#16a34a')}
          >
            {isRunning ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={14} />}
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              color: '#858585',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#3c3c3c';
              e.currentTarget.style.color = '#cccccc';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#858585';
            }}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Editor and Output Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Editor */}
        <div style={{ flex: showOutput ? '1' : '1', overflow: 'hidden' }}>
          <Editor
            height="100%"
            width="100%"
            language={language}
            value={code}
            theme={theme}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
              fontLigatures: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              bracketPairColorization: {
                enabled: true
              },
            }}
          />
        </div>

        {/* Output Panel */}
        {showOutput && (
          <div style={{
            height: '200px',
            backgroundColor: '#1e1e1e',
            borderTop: '1px solid #3e3e42',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Output Header */}
            <div style={{
              height: '30px',
              backgroundColor: '#2d2d30',
              borderBottom: '1px solid #3e3e42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px'
            }}>
              <span style={{ fontSize: '12px', color: '#cccccc', fontWeight: '500' }}>Output</span>
              <button
                onClick={() => setShowOutput(false)}
                style={{
                  padding: '2px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#858585',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '2px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#3c3c3c';
                  e.currentTarget.style.color = '#cccccc';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#858585';
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Output Content */}
            <div style={{
              flex: 1,
              padding: '12px',
              fontFamily: "'Cascadia Code', 'Consolas', monospace",
              fontSize: '13px',
              color: '#cccccc',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {output}
            </div>
          </div>
        )}
      </div>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
