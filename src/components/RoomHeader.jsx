import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

const RoomHeader = ({ roomId }) => {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedId, setCopiedId] = useState(false);

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const copyId = () => {
        navigator.clipboard.writeText(roomId);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-[#333]">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-300">Live Session</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#252526] rounded-md border border-[#333]">
                    <span className="text-xs text-gray-500">Room ID:</span>
                    <code className="text-xs text-blue-400 font-mono">{roomId}</code>
                    <button
                        onClick={copyId}
                        className="ml-2 hover:text-white text-gray-400 transition-colors"
                        title="Copy Room ID"
                    >
                        {copiedId ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>

                <button
                    onClick={copyLink}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                >
                    {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
                    {copiedLink ? 'Copied!' : 'Invite Others'}
                </button>
            </div>
        </div>
    );
};

export default RoomHeader;
