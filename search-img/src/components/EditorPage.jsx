import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { FaDownload, FaFont, FaRegCircle, FaRegSquare, FaRegStar } from 'react-icons/fa';
import '../styles/EditorPage.css';

function EditorPage({ selectedImage }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [imageInstance, setImageInstance] = useState(null);

    // Canvas initialization
    useEffect(() => {
        const initCanvas = () => {
            const container = containerRef.current;
            if (!container) return;
            
            const canvasWidth = container.offsetWidth;
            const canvasHeight = (canvasWidth * 3) / 4;
            
            const newCanvas = new fabric.Canvas(canvasRef.current, {
                width: canvasWidth,
                height: canvasHeight,
                preserveObjectStacking: true,
                selection: true,
                backgroundColor: '#000000',
            });
            
            setCanvas(newCanvas);
            return newCanvas;
        };

        const newCanvas = initCanvas();
        
        const handleResize = () => {
            if (!containerRef.current || !newCanvas) return;
            const container = containerRef.current;
            const canvasWidth = container.offsetWidth;
            const canvasHeight = (canvasWidth * 3) / 4;
            
            newCanvas.setDimensions({ width: canvasWidth, height: canvasHeight });
            newCanvas.renderAll();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            newCanvas.dispose();
        };
    }, []);

    // Image loading
    useEffect(() => {
        if (canvas && selectedImage) {
            fabric.Image.fromURL(selectedImage, img => {
                img.set({
                    originX: 'center',
                    originY: 'center',
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    selectable: false,
                    evented: false,
                    crossOrigin: 'anonymous'
                });
                
                img.scaleToWidth(canvas.width);
                canvas.add(img);
                canvas.sendToBack(img);
                canvas.renderAll();
                setImageInstance(img);
            }, { crossOrigin: 'anonymous' });
        }
    }, [canvas, selectedImage]);

    // Add text element
    const addText = () => {
        if (!canvas) return;
        
        const text = new fabric.IText('Click to edit text', {
            left: canvas.width / 2,
            top: canvas.height / 2,
            fontSize: 24,
            fill: '#4affde',
            fontFamily: 'Arial',
            originX: 'center',
            originY: 'center',
            hasControls: true,
            padding: 10,
            borderColor: '#4affde',
            cornerColor: '#4affde',
            cornerSize: 12,
            transparentCorners: false,
        });
        
        canvas.add(text);
        canvas.bringToFront(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    // Add shapes
    const addShape = (type) => {
        if (!canvas) return;
        
        let shape;
        const shapeProps = {
            left: canvas.width / 2,
            top: canvas.height / 2,
            fill: 'rgba(255,255,255,0.1)',
            stroke: '#6d8cff',
            strokeWidth: 2,
            originX: 'center',
            originY: 'center',
            hasControls: true,
            hasBorders: true,
            borderColor: '#6d8cff',
            cornerColor: '#6d8cff',
            cornerSize: 12,
            transparentCorners: false,
        };

        switch (type) {
            case 'rectangle':
                shape = new fabric.Rect({
                    ...shapeProps,
                    width: 150,
                    height: 100,
                    stroke: '#4affde',
                });
                break;
            case 'circle':
                shape = new fabric.Circle({
                    ...shapeProps,
                    radius: 50,
                    stroke: '#ff76f4',
                });
                break;
            case 'triangle':
                shape = new fabric.Triangle({
                    ...shapeProps,
                    width: 100,
                    height: 100,
                    stroke: '#6effaf',
                });
                break;
        }

        if (shape) {
            canvas.add(shape);
            canvas.bringToFront(shape);
            canvas.setActiveObject(shape);
            canvas.renderAll();
        }
    };

    // Download functionality
    const downloadImage = () => {
        if (!canvas) return;

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const scaleFactor = 2;
        
        tempCanvas.width = canvas.width * scaleFactor;
        tempCanvas.height = canvas.height * scaleFactor;
        tempCtx.scale(scaleFactor, scaleFactor);
        tempCtx.drawImage(canvas.lowerCanvasEl, 0, 0);

        const link = document.createElement('a');
        link.download = `design-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="editor-page">
            <div className="editor-container">
                <div className="canvas-container" ref={containerRef}>
                    <canvas ref={canvasRef} />
                    <div className="canvas-overlay"></div>
                </div>
                <div className="toolbar">
                    <button onClick={addText} className="toolbar-btn neon-text">
                        <FaFont className="toolbar-icon" />
                        Add Text
                    </button>
                    <button 
                        onClick={() => addShape('rectangle')} 
                        className="toolbar-btn neon-blue"
                    >
                        <FaRegSquare className="toolbar-icon" />
                        Rectangle
                    </button>
                    <button 
                        onClick={() => addShape('circle')} 
                        className="toolbar-btn neon-pink"
                    >
                        <FaRegCircle className="toolbar-icon" />
                        Circle
                    </button>
                    <button 
                        onClick={() => addShape('triangle')} 
                        className="toolbar-btn neon-green"
                    >
                        <FaRegStar className="toolbar-icon" />
                        Triangle
                    </button>
                    <button 
                        onClick={downloadImage} 
                        className="toolbar-btn download-btn"
                    >
                        <FaDownload className="toolbar-icon" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditorPage;