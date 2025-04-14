import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { FaDownload } from 'react-icons/fa';
import '../styles/EditorPage.css';

function EditorPage({ selectedImage }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
    });

    if (selectedImage) {
      fabric.Image.fromURL(selectedImage, (img) => {
        img.scaleToWidth(800);
        fabricCanvas.add(img);
        fabricCanvas.centerObject(img);
        fabricCanvas.renderAll();
      });
    }

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [selectedImage]);

  const addText = () => {
    if (canvas) {
      const text = new fabric.IText('Double click to edit', {
        left: 100,
        top: 100,
        fontSize: 20,
        fill: '#000000',
      });
      canvas.add(text);
      canvas.renderAll();
    }
  };

  const addShape = (type) => {
    if (canvas) {
      let shape;
      switch (type) {
        case 'rectangle':
          shape = new fabric.Rect({
            left: 100,
            top: 100,
            width: 100,
            height: 100,
            fill: 'rgba(255, 0, 0, 0.5)',
          });
          break;
        case 'circle':
          shape = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 50,
            fill: 'rgba(0, 255, 0, 0.5)',
          });
          break;
        case 'triangle':
          shape = new fabric.Triangle({
            left: 100,
            top: 100,
            width: 100,
            height: 100,
            fill: 'rgba(0, 0, 255, 0.5)',
          });
          break;
      }
      if (shape) {
        canvas.add(shape);
        canvas.renderAll();
      }
    }
  };

  const downloadImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
      });
      const link = document.createElement('a');
      link.download = `edited_image_${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No image to download. Please add an image first.');
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-container">
        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>
        <div className="toolbar">
          <button onClick={addText}>Add Text</button>
          <button onClick={() => addShape('rectangle')}>Add Rectangle</button>
          <button onClick={() => addShape('circle')}>Add Circle</button>
          <button onClick={() => addShape('triangle')}>Add Triangle</button>
          <button onClick={downloadImage}>
            <FaDownload className="download-icon" /> Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorPage;