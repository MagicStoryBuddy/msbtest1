'use client';

import { useState } from 'react';

export default function PDFSimpleTestPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().substring(11, 19)}: ${message}`]);
  };
  
  const generatePDF = async () => {
    setIsGenerating(true);
    setPdfUrl(null);
    setError(null);
    setLogs([]);
    
    try {
      addLog('Starting PDF generation test...');
      
      // Sample story for testing
      const testStory = `Once upon a time, there was a brave robot named Robo Rex. 
      He lived in a magical castle and loved to go on adventures. 
      One day, he decided to search for a hidden treasure. 
      He explored the castle from top to bottom, looking behind paintings and under rugs.
      Finally, in the deepest dungeon, behind an old bookshelf, he found a chest full of magical gears that sparkled with rainbow colors.
      "Wow!" said Robo Rex. "These magical gears will help me on my next adventure!"
      He carefully packed the treasure in his backpack and headed home, ready for his next exciting mission.
      The end.`;
      
      addLog('Sending request to generate-story-pdf API...');
      
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
      
      addLog(`API response status: ${response.status}`);
      
      const data = await response.json();
      addLog(`API response data: ${JSON.stringify(data, null, 2)}`);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to generate PDF');
      }
      
      if (!data.pdfUrl) {
        throw new Error('No PDF URL returned');
      }
      
      addLog(`PDF generated successfully, URL: ${data.pdfUrl}`);
      setPdfUrl(data.pdfUrl);
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      addLog(`Error: ${err.message}`);
      setError(err.message || 'Sorry, we had trouble creating the PDF. Please try again!');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">Simple PDF Test Page</h1>
        
        <div className="bg-white rounded-xl p-8 shadow-md mb-8">
          <p className="mb-6 text-gray-700">
            This page tests only the PDF generation with placeholder images, without attempting to use DALL-E.
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
                <span>📕</span> Generate Test PDF with Placeholders
              </button>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
              <p className="font-medium">Error generating PDF:</p>
              <p>{error}</p>
            </div>
          )}
        </div>
        
        {logs.length > 0 && (
          <div className="bg-gray-800 text-gray-200 rounded-xl p-4 font-mono text-sm overflow-x-auto">
            <div className="mb-2 text-gray-400">Logs:</div>
            {logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 