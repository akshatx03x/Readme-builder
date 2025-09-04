import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/repos", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            navigate("/login");
            return;
          }
          const errorText = await response.text();
          throw new Error(errorText || `HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.repos)) {
          setRepos(data.repos);
        } else {
          throw new Error("Invalid response format or no repos");
        }
      } catch (err) {
        console.error("❌ Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex items-center justify-between">
        <div className="w-[30%] max-w-md ml-8">
          <div className="animate-pulse flex items-center space-x-3">
            <div className="h-6 w-6 bg-blue-600/40 rounded-full"></div>
            <p className="text-lg text-zinc-400 font-inter">Loading repositories...</p>
          </div>
        </div>
        <div className="w-[70%] max-w-4xl mr-8">
          <div className="bg-zinc-800/20 backdrop-blur-lg p-8 rounded-3xl border border-zinc-700/40 shadow-xl h-[50vh] flex items-center justify-center">
            <p className="text-zinc-400 text-lg font-inter">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex items-center justify-between">
        <div className="w-[30%] max-w-md ml-8">
          <p className="text-lg text-red-500 font-inter bg-zinc-800/50 p-5 rounded-2xl border border-red-600/30">
            Error: {error}. Check console for details.
          </p>
        </div>
        <div className="w-[70%] max-w-4xl mr-8">
          <div className="bg-zinc-800/20 backdrop-blur-lg p-8 rounded-3xl border border-zinc-700/40 shadow-xl h-[50vh] flex items-center justify-center">
            <p className="text-zinc-400 text-lg font-inter">Error occurred. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 p-8 flex font-inter">
      <div className="w-[30%] max-w-md ml-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-100 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            GitHub Repositories
          </h1>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors duration-200 mt-2 block"
          >
            Open Profile &rarr;
          </a>
        </div>

        {repos.length === 0 ? (
          <p className="text-zinc-500 text-base leading-relaxed bg-zinc-800/40 backdrop-blur-md p-5 rounded-2xl border border-zinc-700/30">
            No repositories found. Ensure you're logged in with GitHub and have granted repository access.
          </p>
        ) : (
          <ul className="space-y-4">
            {repos.map((repo) => (
              <li
                key={repo.fullName}
                className="bg-zinc-800/20 backdrop-blur-lg p-6 rounded-3xl border border-zinc-700/40 hover:bg-zinc-800/50 transition-all duration-300 ease-in-out shadow-xl hover:shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-zinc-100 tracking-tight">
                    {repo.name}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      repo.private
                        ? "bg-red-950/60 text-red-400 border-red-600/40"
                        : "bg-green-950/60 text-green-400 border-green-600/40"
                    } border transition-colors duration-200`}
                  >
                    {repo.private ? "Private" : "Public"}
                  </span>
                </div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm font-medium hover:text-blue-400 transition-colors duration-200 mt-3 block"
                >
                  View on GitHub &rarr;
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-[70%] max-w-4xl mr-8">
        <div className="bg-zinc-800/20 backdrop-blur-lg p-8 rounded-3xl border border-zinc-700/40 shadow-xl h-[50vh] flex items-center justify-center">
          <p className="text-zinc-400 text-lg font-inter">Additional content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;