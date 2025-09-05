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

  // Function to handle the back button click
  const handleGoBack = () => {
    setIsSearching(false);
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
        
        {/* Conditional rendering for the results search box and the back button */}
        {isSearching && (
          <div className="w-full max-w-3xl mx-auto mb-6 flex flex-col items-center">
            {/* Back button */}
            <button
              onClick={handleGoBack}
              className="mb-4 self-start flex items-center space-x-2 text-zinc-400 hover:text-blue-300 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            
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
              Hello, <span className='text-white text-3xl font-medium'>Want to Build Readme? </span><span className='text-2xl text-yellow-600 font-medium'>I am here</span>
            </div>
          </div>
        )}

        {/* The main input bar that always stays in place */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative flex items-center bg-zinc-900/50 backdrop-blur-xl p-3 rounded-full border border-blue-700/30 shadow-2xl transition-all duration-500 ease-in-out hover:border-blue-500/50 hover:shadow-blue-900/30 animate-fade-in">
            {/* Logo in search bar */}
            <div className="flex items-center justify-center p-2 mr-2">
              <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-yellow-500">GemScribe</span>
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none text-lg"
              placeholder="Ask Gemscribe"
              aria-label="Ask Gemscribe"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
            />
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
    </>
  );
};

export default GeminiChatUI;
