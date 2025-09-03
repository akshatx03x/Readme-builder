import React, { useState } from 'react';
import { auth, googleProvider, githubProvider } from './utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const googleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const user = response.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        phoneNumber: user.phoneNumber
      };

      const apiResponse = await fetch("http://localhost:3000/api/auth/google-login", {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to login with Google');
      }

      const responseData = await apiResponse.json();
      console.log('Google login success:', responseData);
    } catch (error) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        setError('Authentication popup was closed or cancelled. Please try again.');
      } else {
        setError(`Google login error: ${error.message}`);
      }
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const gitLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await signInWithPopup(auth, githubProvider);
      const user = response.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        phoneNumber: user.phoneNumber
      };

      const apiResponse = await fetch("http://localhost:3000/api/auth/github-login", {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to login with GitHub');
      }

      const responseData = await apiResponse.json();
      console.log('GitHub login success:', responseData);
    } catch (error) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        setError('Authentication popup was closed or cancelled. Please try again.');
      } else {
        setError(`GitHub login error: ${error.message}`);
      }
      console.error('GitHub login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-white text-center mb-6">Sign In</h1>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-md mb-6 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-4">
          <motion.button
            onClick={googleLogin}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white font-medium transition-colors
              ${isLoading ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {isLoading ? 'Signing In...' : 'Sign In with Google'}
          </motion.button>
          <motion.button
            onClick={gitLogin}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white font-medium transition-colors
              ${isLoading ? 'bg-gray-700/50 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.49v-1.73c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.564 9.564 0 0112 6.8c.85.004 1.71.11 2.52.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.59.67.49A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" fill="#ffffff"/>
              </svg>
            )}
            {isLoading ? 'Signing In...' : 'Sign In with GitHub'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default App;