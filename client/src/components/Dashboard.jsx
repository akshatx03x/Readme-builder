import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch('http://localhost:3000/api/repos', {
        method: 'GET',
        credentials: 'include',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) {
        navigate('/');
        return;
      }
      const data = await response.json();
      setRepos(data);
      setLoading(false);
    };
    fetchRepos();
  }, [navigate]);

  if (loading) return <div className="text-center p-4">Loading repositories...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Repositories</h1>
      <ul className="space-y-2">
        {repos.map(repo => (
          <li key={repo.fullName} className="p-2 bg-gray-100 rounded">
            {repo.name} ({repo.private ? 'Private' : 'Public'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;