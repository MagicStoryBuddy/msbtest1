'use client';

import { useState } from 'react';

export default function PDFTestPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const generatePDF = async () => {
    setIsGenerating(true);
    setPdfUrl(null);
    setError(null);
    
    try {
      console.log('Starting PDF generation test...');
      
      // Sample story for testing
      const testStory = `Once upon a time, there was a brave robot named Robo Rex. 
      He lived in a magical castle and loved to go on adventures. 
      One day, he decided to search for a hidden treasure. 
      He explored the castle from top to bottom, looking behind paintings and under rugs.
      Finally, in the deepest dungeon, behind an old bookshelf, he found a chest full of magical gears that sparkled with rainbow colors.
      "Wow!" said Robo Rex. "These magical gears will help me on my next adventure!"
      He carefully packed the treasure in his backpack and headed home, ready for his next exciting mission.
      The end.`;
      
      // Send the request to the API
      const response = await fetch('/api/generate-story-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story: testStory,
          hero: "Robo Rex",
          place: "Castle",
          mission: "Find Treasure"
        }),
      });
      
      const data = await response.json();
      console.log('PDF API response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to generate PDF');
      }
      
      if (!data.pdfUrl) {
        throw new Error('No PDF URL returned');
      }
      
      console.log('PDF generated successfully, URL:', data.pdfUrl);
      setPdfUrl(data.pdfUrl);
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      setError(err.message || 'Sorry, we had trouble creating the PDF. Please try again!');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">PDF Generation Test Page</h1>
        
        <div className="bg-white rounded-xl p-8 shadow-md">
          <p className="mb-6 text-gray-700">
            This page allows you to test the PDF generation feature directly, without going through the story generation process.
          </p>
          
          <div className="flex justify-center mb-6">
            {isGenerating ? (
              <div className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Creating PDF Storybook...</span>
              </div>
            ) : pdfUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="text-green-600 font-medium mb-2">PDF generated successfully!</div>
                <a 
                  href={pdfUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
                >
                  <span>📕</span> Open PDF Storybook
                </a>
                <button
                  onClick={() => setPdfUrl(null)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 mt-1"
                >
                  Reset
                </button>
              </div>
            ) : (
              <button
                onClick={generatePDF}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
              >
                <span>📕</span> Generate Test PDF
              </button>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
              <p className="font-medium">Error generating PDF:</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-3 text-indigo-700">Environment Info</h2>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
              {`OPENAI_API_KEY: ${process.env.NEXT_PUBLIC_OPENAI_API_KEY_SET ? "Set (via NEXT_PUBLIC)" : "Not set in client"}`}
            </pre>
            <p className="text-xs text-gray-500 mt-2">
              Note: For security, the actual API key is not displayed. This only shows if a key is set.
            </p>
            
            <div className="mt-6">
              <a href="/" className="text-indigo-600 hover:text-indigo-800">← Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 