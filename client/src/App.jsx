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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex items-center justify-center p-4 font-inter">
      <div className="bg-zinc-800/20 backdrop-blur-lg shadow-xl rounded-3xl p-8 w-full max-w-md border border-zinc-700/40">
        {/* Logo Placeholder */}
        <div className="flex justify-center mb-6">
          <img
            src="https://th.bing.com/th/id/R.93b95738cb630f899bacf7dd835b5ad5?rik=NabHb25auWhA2w&riu=http%3a%2f%2fwww.pxwall.com%2fwp-content%2fuploads%2f2018%2f10%2fSunset-4k-Ultra-HD-Wallpaper.jpg&ehk=PRFcf2yTsmb1dAoamyEjJ%2f5sV587KlMWlKKiSo6Kp3U%3d&risl=&pid=ImgRaw&r=0"
            alt="Logo"
            className="h-50 w-100 rounded-2xl"
          />
        </div>

        <h1 className="text-3xl font-bold text-zinc-100 text-center mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Welcome Back
        </h1>
        <p className="text-zinc-400 text-center mb-8 text-base">
          Sign in to your account
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-950/50 text-red-400 p-3 rounded-xl mb-6 text-sm border border-red-600/30">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Google Login Button */}
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 bg-zinc-800/50 backdrop-blur-md border border-zinc-600/50 hover:bg-zinc-700/50 text-zinc-100 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
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
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            Sign in with GitHub
          </button>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;