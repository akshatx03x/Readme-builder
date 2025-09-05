import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { URL } from '../assets/constants.js';

const GeminiChatUI = forwardRef((props, ref) => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [responseText, setResponseText] = useState('');
  const textareaRef = useRef(null);

  // Expose the generateReadme function to the parent component via a ref.
  useImperativeHandle(ref, () => ({
    generateReadme,
  }));

  /**
   * Generates a prompt and triggers the AI to create a README with code blocks.
   * @param {Object} repo The repository object containing details like name, private status, description, and url.
   */
  const generateReadme = async (repo) => {
    // Update the query to display in the search bar with repo name and URL
    const displayQuery = `Make README for ${repo.name} with link ${repo.url} and also provide complete decription`;
    setQuery(displayQuery);

    // Construct a detailed prompt for the AI, including the repo URL and requesting code blocks
    const readmeQuery = `Generate a detailed README.md for a GitHub repository named "${repo.name}" with the URL "${repo.url}". The repository is ${repo.private ? 'private' : 'public'}. The description is "${repo.description || 'No description provided.'}". Include sections for "Description", "Features", "Installation", "Usage" (with example code blocks in an appropriate programming language based on the repository name or description), and "Contributing". Ensure code blocks are formatted with triple backticks (\`\`\`) for proper Markdown rendering.`;
    
    // Call the API function directly with the new query
    await handleAsk(readmeQuery);
  };

  /**
   * Sends the query to the Gemini API and updates the response text.
   * @param {string} [apiQuery=query] The query string. Defaults to the component's state.
   */
  const handleAsk = async (apiQuery = query) => {
    if (apiQuery.trim() === '') {
      return; // Do nothing if the query is empty.
    }

    setIsSearching(true);
    const payload = {
      "contents": [
        {
          "parts": [
            {
              "text": apiQuery
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from API');
      }

      const data = await response.json();
      const answer = (data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response available').replace(/\*/g, '');
      setResponseText(answer);
      console.log('✅ Response:', answer);
    } catch (error) {
      console.error('❌ Error fetching response:', error.message);
      setResponseText('Error: Unable to get response. Please try again.');
    }
  };

  const handleGoBack = () => {
    setIsSearching(false);
    setQuery('');
    setResponseText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [query]);

  const renderFormattedResponse = () => {
    if (!responseText) {
      return null;
    }
    const lines = responseText.split('\n');
    const elements = [];
    let listItems = [];
    let isCodeBlock = false;
    let codeBlockContent = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle code block start/end
      if (trimmedLine.startsWith('```')) {
        if (isCodeBlock) {
          // End of code block
          elements.push(
            <pre key={`code-${index}`} className="bg-zinc-800 p-4 rounded-md mb-4 overflow-x-auto">
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          isCodeBlock = false;
        } else {
          // Start of code block
          isCodeBlock = true;
        }
        return;
      }

      if (isCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle list items
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        const content = trimmedLine.substring(1).trim();
        listItems.push(<li key={index}>{content}</li>);
      } else {
        if (listItems.length > 0) {
          elements.push(<ul key={`list-${elements.length}`} className="list-disc list-inside mb-4">{listItems}</ul>);
          listItems = [];
        }
        if (trimmedLine) {
          elements.push(<p key={index} className="mb-2">{line}</p>);
        }
      }
    });

    // Handle any remaining code block or list items
    if (isCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <pre key={`code-final`} className="bg-zinc-800 p-4 rounded-md mb-4 overflow-x-auto">
          <code>{codeBlockContent.join('\n')}</code>
        </pre>
      );
    }
    if (listItems.length > 0) {
      elements.push(<ul key={`list-final`} className="list-disc list-inside mb-4">{listItems}</ul>);
    }

    return elements;
  };

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #52525B;
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: padding-box;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #71717A;
          }
        `}
      </style>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="absolute bottom-10 right-10 w-full max-w-4xl p-8 z-50 flex flex-col items-end">
        {isSearching && (
          <div className="w-full max-w-3xl mx-auto mb-6 flex flex-col items-center">
            <button
              onClick={handleGoBack}
              className="mb-4 self-start flex items-center space-x-2 text-zinc-400 hover:text-blue-300 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <div className="w-full bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-blue-700/30 shadow-2xl transition-all duration-500 ease-in-out animate-fade-in-up" style={{ height: '50vh' }}>
              <div className="p-6 overflow-y-auto h-full custom-scrollbar">
                <p className="text-zinc-500 text-sm">Press Enter to Search and wait 10-20 sec for Response.</p>
                <p className="text-zinc-100 text-lg">Results...</p>
                <div className="mt-4 text-zinc-300">
                  {renderFormattedResponse()}
                </div>
              </div>
            </div>
          </div>
        )}
        {!isSearching && (
          <div className="w-full text-center mb-10">
            <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-600 tracking-tight animate-fade-in-up">
              Hello, <span className='text-white text-3xl font-medium'>Want to Build Readme? </span><span className='text-2xl text-yellow-600 font-medium'>I am here</span>
            </div>
          </div>
        )}
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative flex items-end bg-zinc-900/50 backdrop-blur-xl p-3 rounded-full border border-blue-700/30 shadow-2xl transition-all duration-500 ease-in-out hover:border-blue-500/50 hover:shadow-blue-900/30 animate-fade-in">
            <div className="flex items-center justify-center p-2 mr-2">
              <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-yellow-500">GemScribe</span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-40 custom-scrollbar pr-2">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent border-none text-zinc-100 placeholder-zinc-500 focus:outline-none text-lg resize-none"
                placeholder="Ask Gemscribe"
                aria-label="Ask Gemscribe"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows="1"
              />
            </div>
            <button
              className="p-2 rounded-full text-zinc-400 hover:text-blue-300 hover:bg-zinc-700/50 transition-colors duration-200"
              onClick={() => handleAsk()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

export default GeminiChatUI;