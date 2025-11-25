import React from 'react';
import { Code, PenTool, Video, Settings } from 'lucide-react';

const Layout = ({ activeTab, setActiveTab, children }) => {
    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#1e1e1e',
            color: '#cccccc',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Activity Bar (Sidebar) */}
            <div style={{
                width: '48px',
                backgroundColor: '#333333',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRight: '1px solid #2d2d30'
            }}>
                {/* Navigation Icons */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <ActivityBarIcon
                        icon={<Code size={24} />}
                        label="Code Editor"
                        isActive={activeTab === 'ide'}
                        onClick={() => setActiveTab('ide')}
                    />
                    <ActivityBarIcon
                        icon={<PenTool size={24} />}
                        label="Whiteboard"
                        isActive={activeTab === 'whiteboard'}
                        onClick={() => setActiveTab('whiteboard')}
                    />
                </div>

                {/* Bottom Icons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                    <ActivityBarIcon
                        icon={<Video size={20} />}
                        label="Video Call"
                        isActive={false}
                        onClick={() => { }}
                    />
                    <ActivityBarIcon
                        icon={<Settings size={20} />}
                        label="Settings"
                        isActive={false}
                        onClick={() => { }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {children}
            </div>
        </div>
    );
};

const ActivityBarIcon = ({ icon, label, isActive, onClick }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={label}
            style={{
                width: '100%',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                borderLeft: isActive ? '2px solid #007acc' : '2px solid transparent',
                color: isActive ? '#ffffff' : isHovered ? '#cccccc' : '#858585',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease'
            }}
        >
            {icon}
        </button>
    );
};

export default Layout;
