import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar';
import './WelcomePage.scss';
import { useAuth } from '../../Hooks/useAuth';
import { TaskList } from '../Task';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="welcome-container">
      <Navbar />
      <TaskList />
    </div>
  );
};

export default WelcomePage;