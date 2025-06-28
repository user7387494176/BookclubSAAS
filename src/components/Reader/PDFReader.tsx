import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, BookOpen, FileText } from 'lucide-react';

interface PDFReaderProps {
  file: File | null;
  onClose: () => void;
}

const PDFReader: React.FC<PDFReaderProps> = ({ file, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fileUrl, setFileUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      
      // For demo purposes, we'll simulate PDF loading
      // In a real implementation, you'd use PDF.js library
      setTotalPages(Math.floor(Math.random() * 50) + 10);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span className="font-medium">{file.name}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Page Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Other Controls */}
          <button
            onClick={handleRotate}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          
          <a
            href={fileUrl}
            download={file.name}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Reader Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div 
          className="bg-white shadow-2xl"
          style={{ 
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center'
          }}
        >
          {/* PDF Content Placeholder */}
          <div className="w-[595px] h-[842px] bg-white border border-gray-300 p-8 flex flex-col">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {file.name.replace(/\.[^/.]+$/, "")}
              </h1>
              <div className="text-sm text-gray-600">Page {currentPage}</div>
            </div>
            
            <div className="flex-1 space-y-4 text-gray-800">
              <p className="text-justify leading-relaxed">
                This is a simulated PDF viewer. In a production environment, you would integrate 
                with PDF.js or a similar library to render actual PDF content. The viewer supports 
                zoom, rotation, and page navigation controls.
              </p>
              
              <p className="text-justify leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              
              <p className="text-justify leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Simulated content for page {currentPage} of {totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;