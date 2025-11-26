import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Minimize2 } from 'lucide-react';
import SimplePeer from 'simple-peer';
import { useSocket } from '../context/SocketContext';

const VideoChat = ({ roomId }) => {
    const [stream, setStream] = useState(null);
    const [peers, setPeers] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const socket = useSocket();
    const userVideo = useRef();
    const peersRef = useRef([]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }

                if (!socket) return;

                socket.on("existing-users", (users) => {
                    const peers = [];
                    users.forEach((userID) => {
                        const peer = createPeer(userID, socket.id, currentStream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        });
                        peers.push({
                            peerID: userID,
                            peer,
                        });
                    });
                    setPeers(peers);
                });

                socket.on("user-connected", (payload) => {
                    console.log("User connected:", payload);
                });

                socket.on("signal", (payload) => {
                    const item = peersRef.current.find((p) => p.peerID === payload.callerID);
                    if (item) {
                        item.peer.signal(payload.signal);
                    } else {
                        const peer = addPeer(payload.signal, payload.callerID, currentStream);
                        peersRef.current.push({
                            peerID: payload.callerID,
                            peer,
                        });
                        setPeers((users) => [...users, { peerID: payload.callerID, peer }]);
                    }
                });

                socket.on("user-disconnected", (id) => {
                    const peerObj = peersRef.current.find((p) => p.peerID === id);
                    if (peerObj) {
                        peerObj.peer.destroy();
                    }
                    const peers = peersRef.current.filter((p) => p.peerID !== id);
                    peersRef.current = peers;
                    setPeers(peers);
                });
            })
            .catch((err) => {
                console.error("Error accessing media devices:", err);
            });

        return () => {
            // Cleanup
        }
    }, [socket, roomId]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("signal", { userToSignal, callerID, signal });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("signal", { userToSignal: callerID, callerID: socket.id, signal });
        });

        peer.signal(incomingSignal);

        return peer;
    }

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

    const totalVideos = peers.length + 1;

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e]">
            <div className="p-3 border-b border-[#333] bg-[#252526] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">Video ({totalVideos})</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <div className={`grid gap-2 ${totalVideos === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {/* Local Video */}
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-[#333]">
                        {stream ? (
                            <video
                                playsInline
                                muted
                                ref={userVideo}
                                autoPlay
                                className="w-full h-full object-cover scale-x-[-1]"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Loading...</span>
                                </div>
                            </div>
                        )}
                        <div className="absolute bottom-1 left-1 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">You</div>

                        <div className="absolute top-1 right-1 flex gap-1">
                            {isMuted && <div className="bg-red-500/80 p-1 rounded"><MicOff size={10} className="text-white" /></div>}
                        </div>
                    </div>

                    {/* Remote Videos */}
                    {peers.map((peer) => (
                        <Video key={peer.peerID} peer={peer.peer} />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="p-3 bg-[#252526] border-t border-[#333] flex justify-center gap-3">
                <ControlButton
                    icon={isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    onClick={toggleMute}
                    isActive={isMuted}
                    isDanger={isMuted}
                    title={isMuted ? "Unmute" : "Mute"}
                />
                <ControlButton
                    icon={isVideoOff ? <VideoOff size={18} /> : <VideoIcon size={18} />}
                    onClick={toggleVideo}
                    isActive={isVideoOff}
                    isDanger={isVideoOff}
                    title={isVideoOff ? "Start Video" : "Stop Video"}
                />
            </div>
        </div>
    );
};

const Video = ({ peer }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", (stream) => {
            ref.current.srcObject = stream;
        });
    }, [peer]);

    return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-[#333]">
            <video playsInline autoPlay ref={ref} className="w-full h-full object-cover" />
            <div className="absolute bottom-1 left-1 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">Peer</div>
        </div>
    );
};

const ControlButton = ({ icon, onClick, isActive, isDanger, title }) => {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded border transition-colors flex items-center justify-center
                ${isDanger
                    ? 'bg-red-600 border-red-700 text-white hover:bg-red-700'
                    : isActive
                        ? 'bg-[#3c3c3c] border-[#3e3e42] text-white'
                        : 'bg-[#2d2d30] border-[#3e3e42] text-white hover:bg-[#3c3c3c]'
                }`}
        >
            {icon}
        </button>
    );
};

export default VideoChat;
