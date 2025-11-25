import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Pencil, Square, Circle as CircleIcon, Type, Trash2, MousePointer, Minus, Plus } from 'lucide-react';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [activeTool, setActiveTool] = useState('pencil');
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(2);

    useEffect(() => {
        if (canvasRef.current && !fabricCanvasRef.current) {
            const canvas = new fabric.Canvas(canvasRef.current, {
                isDrawingMode: true,
                width: window.innerWidth - 48,
                height: window.innerHeight,
                backgroundColor: '#ffffff',
            });
            fabricCanvasRef.current = canvas;

            // Force render to show white background immediately
            canvas.renderAll();

            // Initial brush setup
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.width = brushSize;
            canvas.freeDrawingBrush.color = color;

            // Handle resize
            const handleResize = () => {
                canvas.setDimensions({
                    width: window.innerWidth - 48,
                    height: window.innerHeight
                });
                canvas.backgroundColor = '#ffffff';
                canvas.renderAll();
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        canvas.isDrawingMode = activeTool === 'pencil';

        if (activeTool === 'pencil') {
            canvas.freeDrawingBrush.width = brushSize;
            canvas.freeDrawingBrush.color = color;
        }
    }, [activeTool, color, brushSize]);

    const addShape = (type) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        setActiveTool('select');
        canvas.isDrawingMode = false;

        let shape;
        if (type === 'rect') {
            shape = new fabric.Rect({
                left: 100,
                top: 100,
                fill: 'transparent',
                stroke: color,
                strokeWidth: brushSize,
                width: 100,
                height: 100
            });
        } else if (type === 'circle') {
            shape = new fabric.Circle({
                left: 100,
                top: 100,
                fill: 'transparent',
                stroke: color,
                strokeWidth: brushSize,
                radius: 50
            });
        } else if (type === 'text') {
            shape = new fabric.IText('Type here', {
                left: 100,
                top: 100,
                fontFamily: 'Inter, Arial',
                fill: color,
                fontSize: 20
            });
        }

        if (shape) {
            canvas.add(shape);
            canvas.setActiveObject(shape);
            canvas.renderAll();
        }
    };

    const clearCanvas = () => {
        const canvas = fabricCanvasRef.current;
        if (canvas) {
            canvas.clear();
            canvas.backgroundColor = '#ffffff';
            canvas.renderAll();
        }
    };

    const tools = [
        { id: 'select', icon: <MousePointer size={18} />, action: () => { setActiveTool('select'); fabricCanvasRef.current.isDrawingMode = false; } },
        { id: 'pencil', icon: <Pencil size={18} />, action: () => setActiveTool('pencil') },
        { id: 'rect', icon: <Square size={18} />, action: () => addShape('rect') },
        { id: 'circle', icon: <CircleIcon size={18} />, action: () => addShape('circle') },
        { id: 'text', icon: <Type size={18} />, action: () => addShape('text') },
    ];

    return (
        <div style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            position: 'relative'
        }}>
            {/* Toolbar */}
            <div style={{
                height: '35px',
                backgroundColor: '#2d2d30',
                borderBottom: '1px solid #3e3e42',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '12px',
                fontSize: '13px'
            }}>
                {/* Tools */}
                <div style={{ display: 'flex', gap: '4px' }}>
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            onClick={tool.action}
                            style={{
                                padding: '6px 10px',
                                backgroundColor: activeTool === tool.id ? '#007acc' : 'transparent',
                                color: activeTool === tool.id ? '#ffffff' : '#cccccc',
                                border: 'none',
                                borderRadius: '2px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease'
                            }}
                            title={tool.id}
                            onMouseOver={(e) => {
                                if (activeTool !== tool.id) {
                                    e.currentTarget.style.backgroundColor = '#3c3c3c';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (activeTool !== tool.id) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {tool.icon}
                        </button>
                    ))}
                </div>

                <div style={{ width: '1px', height: '20px', backgroundColor: '#3e3e42' }}></div>

                {/* Color Picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#858585', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Color
                    </span>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{
                            width: '28px',
                            height: '22px',
                            border: '1px solid #3e3e42',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            backgroundColor: 'transparent'
                        }}
                    />
                </div>

                {/* Brush Size */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#858585', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Size
                    </span>
                    <button
                        onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
                        style={{
                            padding: '4px 6px',
                            backgroundColor: 'transparent',
                            color: '#cccccc',
                            border: '1px solid #3e3e42',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3c3c3c'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Minus size={12} />
                    </button>
                    <span style={{ color: '#cccccc', fontSize: '12px', minWidth: '20px', textAlign: 'center' }}>
                        {brushSize}
                    </span>
                    <button
                        onClick={() => setBrushSize(Math.min(20, brushSize + 1))}
                        style={{
                            padding: '4px 6px',
                            backgroundColor: 'transparent',
                            color: '#cccccc',
                            border: '1px solid #3e3e42',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3c3c3c'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Plus size={12} />
                    </button>
                </div>

                <div style={{ flex: 1 }}></div>

                {/* Clear Button */}
                <button
                    onClick={clearCanvas}
                    style={{
                        padding: '4px 12px',
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #3e3e42',
                        borderRadius: '2px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#dc2626';
                    }}
                >
                    <Trash2 size={14} />
                    Clear
                </button>
            </div>

            {/* Canvas Area */}
            <div style={{
                flex: 1,
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

export default Whiteboard;
