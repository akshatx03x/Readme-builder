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
    credentials: "include", // ✅ sends cookies
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <p className="text-lg text-gray-600">Loading repositories...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <p className="text-red-600 text-lg">
            Error: {error}. Check console for details.
          </p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your GitHub Repositories</h1>

        {repos.length === 0 ? (
          <p className="text-gray-600">
            No repositories found. Make sure you logged in with GitHub and gave repo access.
          </p>
        ) : (
          <ul className="space-y-4">
            {repos.map((repo) => (
              <li
                key={repo.fullName}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">{repo.name}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      repo.private
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {repo.private ? "Private" : "Public"}
                  </span>
                </div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline mt-1 block"
                >
                  View on GitHub
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Open GitHub Profile
          </a>
        </div>
      </div>
    );
  };

  export default Dashboard;
