import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Type, Bookmark, Settings, BookOpen } from 'lucide-react';

interface EPUBReaderProps {
  file: File | null;
  onClose: () => void;
}

const EPUBReader: React.FC<EPUBReaderProps> = ({ file, onClose }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('serif');
  const [lineHeight, setLineHeight] = useState(1.6);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);

  useEffect(() => {
    if (file) {
      // Simulate EPUB loading and chapter extraction
      setChapters([
        'Chapter 1: The Beginning',
        'Chapter 2: The Journey',
        'Chapter 3: The Discovery',
        'Chapter 4: The Challenge',
        'Chapter 5: The Resolution'
      ]);
    }
  }, [file]);

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentChapter)) {
      setBookmarks(bookmarks.filter(b => b !== currentChapter));
    } else {
      setBookmarks([...bookmarks, currentChapter]);
    }
  };

  const getChapterContent = () => {
    const contents = [
      `In the beginning, there was a story waiting to be told. The pages rustled with anticipation as the reader opened the book, ready to embark on a journey through words and imagination.

      The digital age had transformed how we consume literature, but the essence of storytelling remained unchanged. Each word carried weight, each sentence built upon the last, creating a tapestry of meaning that transcended the medium.

      This EPUB reader demonstrates the capabilities of modern web technology to deliver immersive reading experiences. With customizable fonts, adjustable sizing, and bookmark functionality, readers can tailor their experience to their preferences.

      The story continues to unfold, page by page, chapter by chapter, drawing the reader deeper into the narrative world that exists between the lines of code and the imagination of the reader.`,
      
      `The journey had begun in earnest now. Each step forward revealed new landscapes of possibility, new horizons of understanding that stretched beyond the immediate view.

      Technology and literature had found a harmonious balance in this digital realm. The reader could adjust the very fabric of the text - its size, its spacing, its typeface - to create the perfect reading environment.

      Bookmarks served as waypoints on this literary journey, allowing readers to mark significant moments, beautiful passages, or important plot points for future reference.

      The integration of focus modes and ambient soundscapes created an environment where deep reading could flourish, free from the distractions of the modern world.`,
      
      `Discovery came in many forms. Sometimes it was the sudden understanding of a complex character's motivation. Other times it was the recognition of a theme that wove throughout the narrative like a golden thread.

      The EPUB format had revolutionized digital reading by maintaining the flexibility of text while preserving the author's intended structure. Chapters flowed seamlessly, maintaining the rhythm of the original work.

      Interactive elements enhanced the reading experience without overwhelming it. The ability to customize the reading environment meant that each reader could create their ideal conditions for absorption and comprehension.

      Progress through the book was marked not just by page numbers, but by the accumulation of understanding, the building of emotional connection with characters and themes.`,
      
      `Challenges arose as they always do in any worthwhile endeavor. The balance between technological capability and reading simplicity required careful consideration.

      The reader interface needed to be powerful enough to provide meaningful customization while remaining intuitive enough not to distract from the primary purpose: reading.

      Font choices affected not just aesthetics but readability and comprehension. Line spacing influenced the flow of reading. These seemingly small details combined to create the overall reading experience.

      The integration with focus modes and productivity tools represented a new approach to reading - one that acknowledged the realities of modern attention spans while providing tools to enhance concentration and retention.`,
      
      `Resolution came not as an ending, but as a new beginning. The reading experience had been transformed from a passive consumption of text to an active engagement with ideas.

      The combination of traditional reading with modern technology had created something greater than the sum of its parts. Readers could now immerse themselves in literature while maintaining the tools they needed for focus and comprehension.

      Bookmarks preserved important moments, customizable text ensured comfort, and the integration with productivity systems meant that insights gained from reading could be captured and applied.

      This was the future of reading - not a replacement for traditional books, but an enhancement that honored the past while embracing the possibilities of the future.`
    ];
    
    return contents[currentChapter] || 'Chapter content loading...';
  };

  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-gray-900 dark:text-white">{file.name}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              bookmarks.includes(currentChapter)
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Table of Contents */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contents</h3>
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setCurrentChapter(index)}
                className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                  currentChapter === index
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{chapter}</span>
                  {bookmarks.includes(index) && (
                    <Bookmark className="w-3 h-3 text-yellow-500 fill-current" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reading Area */}
        <div className="flex-1 flex flex-col">
          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Type className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Font Size:</span>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{fontSize}px</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Font:</span>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="serif">Serif</option>
                    <option value="sans-serif">Sans Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Line Height:</span>
                  <input
                    type="range"
                    min="1.2"
                    max="2.0"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{lineHeight}</span>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {chapters[currentChapter]}
              </h2>
              
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                style={{
                  fontSize: `${fontSize}px`,
                  fontFamily: fontFamily,
                  lineHeight: lineHeight
                }}
              >
                {getChapterContent().split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 text-justify">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapter === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Chapter {currentChapter + 1} of {chapters.length}
            </div>
            
            <button
              onClick={handleNextChapter}
              disabled={currentChapter === chapters.length - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPUBReader;