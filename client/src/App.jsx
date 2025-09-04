import React, { useState } from 'react';
import { auth, googleProvider, githubProvider } from './utils/firebase';
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  // ---------------- GOOGLE LOGIN ----------------
  const googleLogin = async () => {
    try {
      setError(''); // Clear previous errors
      const response = await signInWithPopup(auth, googleProvider);

      const user = response.user;
      const userData = {
        name: user.displayName || 'Google User', // Fallback for displayName
        email: user.email,
        avatar: user.photoURL || 'https://example.com/default-avatar.png', // Fallback for avatar
        phoneNumber: user.phoneNumber,
      };

      const apiResponse = await fetch('http://localhost:3000/api/auth/google-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.message || 'Failed to login with Google');
      }

      const responseData = await apiResponse.json();
      console.log('✅ Google Login Success:', responseData);

      localStorage.setItem('token', responseData.token); // Store token
      navigate('/'); // Navigate to dashboard
    } catch (error) {
      console.error('❌ Google login error:', error.message);
      setError(error.message); // Display error to user
    }
  };

  // ---------------- GITHUB LOGIN ----------------
  const gitLogin = async () => {
    try {
      setError('');
      githubProvider.addScope('repo'); // Add scope for private repos

      const response = await signInWithPopup(auth, githubProvider);
      const credential = GithubAuthProvider.credentialFromResult(response);
      const accessToken = credential.accessToken; // GitHub access token

      const user = response.user;
      const userData = {
        name: user.displayName || 'GitHub User',
        email: user.email,
        avatar: user.photoURL || 'https://example.com/default-avatar.png',
        phoneNumber: user.phoneNumber,
        githubToken: accessToken, // Send token to backend
        provider: 'github',
      };

      const apiResponse = await fetch('http://localhost:3000/api/auth/google-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.message || 'Failed to login with GitHub');
      }

      const responseData = await apiResponse.json();
      console.log('✅ GitHub Login Success:', responseData);

      localStorage.setItem('token', responseData.token); // Your app's JWT
      navigate('/'); // Navigate to dashboard
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Logo Placeholder */}
        <div className="flex justify-center mb-6">
          <img
            src="https://via.placeholder.com/100x100?text=Logo"
            alt="Logo"
            className="h-16 w-16"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to your account
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Google Login Button */}
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 py-3 rounded-lg font-medium transition duration-200 shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {/* GitHub Login Button */}
          <button
            onClick={gitLogin}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition duration-200 shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            Sign in with GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;
