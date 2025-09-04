import React, { useState } from 'react';

const GeminiChatUI = () => {
  // State to manage the UI's mode: initial or searching/results
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');

  // Function to handle the "Ask Gemini" button click or Enter key press
  const handleAsk = () => {
    if (query.trim() !== '') {
      setIsSearching(true);
    }
  };

  return (
    <>
      {/* Background blobs positioned relative to the parent container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main UI Container: Holds all the visible elements and stacks them */}
      <div className="absolute bottom-10 right-10 w-full max-w-4xl p-8 z-50 flex flex-col items-end">
        
        {/* Conditional rendering for the results search box */}
        {isSearching && (
          <div className="w-full max-w-3xl mx-auto mb-6 flex flex-col items-center">
            {/* The new search/results box positioned above the main bar */}
            <div className="w-full bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-blue-700/30 shadow-2xl transition-all duration-500 ease-in-out animate-fade-in-up" style={{ height: '50vh' }}>
              <div className="p-6">
                 <p className="text-zinc-400 text-lg">Results for: **{query}**</p>
                 <div className="mt-4 text-zinc-500">
                    <p>Your AI-generated response will be shown here.</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Conditional rendering for the "Hello, Akshat" greeting */}
        {!isSearching && (
          <div className="w-full text-center mb-10">
            <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-600 tracking-tight animate-fade-in-up">
              Hello, Akshat
            </div>
          </div>
        )}

        {/* The main input bar that always stays in place */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative flex items-center bg-zinc-900/50 backdrop-blur-xl p-3 rounded-full border border-blue-700/30 shadow-2xl transition-all duration-500 ease-in-out hover:border-blue-500/50 hover:shadow-blue-900/30 animate-fade-in">
            <button className="flex items-center space-x-2 p-2 rounded-full text-zinc-400 hover:text-blue-300 hover:bg-zinc-700/50 transition-colors duration-200 ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">Tools</span>
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none text-lg px-4"
              placeholder="Ask Gemini"
              aria-label="Ask Gemini"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
            />
            <div className="flex items-center space-x-2 mr-1">
              <button className="p-2 rounded-full text-zinc-400 hover:text-blue-300 hover:bg-zinc-700/50 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
                </svg>
              </button>
              <button 
                className="p-2 rounded-full text-zinc-400 hover:text-blue-300 hover:bg-zinc-700/50 transition-colors duration-200"
                onClick={handleAsk}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeminiChatUI;