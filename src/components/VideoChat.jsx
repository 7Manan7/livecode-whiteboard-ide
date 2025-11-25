import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Minimize2 } from 'lucide-react';

const VideoChat = () => {
    const [stream, setStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const userVideo = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }
            })
            .catch((err) => {
                console.error("Error accessing media devices:", err);
            });
    }, []);

    // Reconnect video when component becomes visible after minimize
    useEffect(() => {
        if (!isMinimized && stream && userVideo.current) {
            userVideo.current.srcObject = stream;
        }
    }, [isMinimized, stream]);

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsVideoOff(!isVideoOff);
        }
    };

    if (isMinimized) {
        return (
            <button
                onClick={() => setIsMinimized(false)}
                style={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#007acc',
                    border: 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    zIndex: 1000
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a8ad4'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007acc'}
            >
                <VideoIcon size={20} />
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            width: '320px',
            backgroundColor: '#2d2d30',
            border: '1px solid #3e3e42',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                padding: '8px 12px',
                backgroundColor: '#252526',
                borderBottom: '1px solid #3e3e42',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#16a34a'
                    }}></div>
                    <span style={{ fontSize: '12px', color: '#cccccc', fontWeight: '500' }}>Interview Call</span>
                </div>
                <button
                    onClick={() => setIsMinimized(true)}
                    style={{
                        padding: '4px',
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
                    <Minimize2 size={14} />
                </button>
            </div>

            {/* Video Area */}
            <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                backgroundColor: '#1e1e1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {stream ? (
                    <video
                        playsInline
                        muted
                        ref={userVideo}
                        autoPlay
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: 'scaleX(-1)'
                        }}
                    />
                ) : (
                    <div style={{
                        textAlign: 'center',
                        color: '#858585',
                        fontSize: '12px'
                    }}>
                        <VideoIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                        <div>Connecting...</div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{
                padding: '12px',
                backgroundColor: '#252526',
                borderTop: '1px solid #3e3e42',
                display: 'flex',
                justifyContent: 'center',
                gap: '8px'
            }}>
                <ControlButton
                    icon={isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                    onClick={toggleMute}
                    isActive={isMuted}
                    isDanger={isMuted}
                />
                <ControlButton
                    icon={isVideoOff ? <VideoOff size={16} /> : <VideoIcon size={16} />}
                    onClick={toggleVideo}
                    isActive={isVideoOff}
                    isDanger={isVideoOff}
                />
                <ControlButton
                    icon={<PhoneOff size={16} />}
                    onClick={() => { }}
                    isDanger={true}
                />
            </div>
        </div>
    );
};

const ControlButton = ({ icon, onClick, isActive, isDanger }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const getBackgroundColor = () => {
        if (isDanger && isActive) return '#dc2626';
        if (isDanger) return '#dc2626';
        if (isActive) return '#3c3c3c';
        if (isHovered) return '#3c3c3c';
        return '#2d2d30';
    };

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '8px 12px',
                backgroundColor: getBackgroundColor(),
                border: '1px solid #3e3e42',
                borderRadius: '2px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
            }}
        >
            {icon}
        </button>
    );
};

export default VideoChat;
